import uuid
from datetime import datetime, timezone
from boto3.dynamodb.conditions import Key
from app.infrastructure.keys import Keys
from app.infrastructure.utils import clean

class PostRepository:
    def __init__(self, table):
        self.table = table

    def create_post(self, user_id: str, caption: str, image_url: str) -> dict:
        post_id    = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        post_item = {
            **Keys.post(post_id),
            "post_id":     post_id,
            "user_id":     user_id,
            "caption":     caption,
            "image_url":   image_url,
            "likes_count": 0,
            "created_at":  created_at,
        }

        user_post_item = {
            **Keys.user_post(user_id, created_at, post_id),
            "post_id":     post_id,
            "user_id":     user_id,
            "caption":     caption,
            "image_url":   image_url,
            "likes_count": 0,
            "created_at":  created_at,
        }

        self.table.meta.client.transact_write_items(
            TransactItems=[
                {"Put": {"TableName": self.table.name, "Item": post_item}},
                {"Put": {"TableName": self.table.name, "Item": user_post_item}},
            ]
        )

        return clean(post_item)

    def get_post_by_id(self, post_id: str) -> dict | None:
        response = self.table.get_item(Key=Keys.post(post_id))
        return clean(response.get("Item"))

    def get_user_posts(self, user_id: str, limit: int = 20) -> list[dict]:
        response = self.table.query(
            KeyConditionExpression=(
                Key("PK").eq(f"USER#{user_id}") &
                Key("SK").begins_with("POST#")
            ),
            ScanIndexForward=False,
            Limit=limit,
        )
        post_ids = [item["post_id"] for item in response.get("Items", [])]
        if not post_ids:
            return []

        batch = self.table.meta.client.batch_get_item(
            RequestItems={
                self.table.name: {"Keys": [Keys.post(pid) for pid in post_ids]}
            }
        )
        items = batch["Responses"].get(self.table.name, [])
        items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return [clean(item) for item in items]

    def get_user_posts_page(self, user_id: str, limit: int = 21, cursor: str | None = None) -> list[dict]:
        if cursor:
            key_condition = (
                Key("PK").eq(f"USER#{user_id}") &
                Key("SK").between("POST#", f"POST#{cursor}")
            )
        else:
            key_condition = (
                Key("PK").eq(f"USER#{user_id}") &
                Key("SK").begins_with("POST#")
            )
        response = self.table.query(
            KeyConditionExpression=key_condition,
            ScanIndexForward=False,
            Limit=limit,
        )
        return [clean(item) for item in response.get("Items", [])]

    def delete_post(self, post_id: str, user_id: str, created_at: str) -> None:
        self.table.meta.client.transact_write_items(
            TransactItems=[
                {"Delete": {"TableName": self.table.name, "Key": Keys.post(post_id)}},
                {"Delete": {"TableName": self.table.name, "Key": Keys.user_post(user_id, created_at, post_id)}},
            ]
        )

    def like_post(self, post_id: str, user_id: str) -> None:
        self.table.put_item(Item={
            **Keys.like(post_id, user_id),
            "post_id":    post_id,
            "user_id":    user_id,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

        self.table.update_item(
            Key=Keys.post(post_id),
            UpdateExpression="SET likes_count = likes_count + :inc",
            ExpressionAttributeValues={":inc": 1},
        )

    def unlike_post(self, post_id: str, user_id: str) -> None:
        self.table.delete_item(Key=Keys.like(post_id, user_id))

        self.table.update_item(
            Key=Keys.post(post_id),
            UpdateExpression="SET likes_count = likes_count - :dec",
            ConditionExpression="likes_count > :zero",
            ExpressionAttributeValues={":dec": 1, ":zero": 0},
        )

    def is_liked(self, post_id: str, user_id: str) -> bool:
        response = self.table.get_item(Key=Keys.like(post_id, user_id))
        return "Item" in response

    def batch_is_liked(self, post_ids: list[str], user_id: str) -> dict[str, bool]:
        if not post_ids:
            return {}
        keys = [Keys.like(pid, user_id) for pid in post_ids]
        response = self.table.meta.client.batch_get_item(
            RequestItems={self.table.name: {"Keys": keys}}
        )
        liked = {
            item["post_id"]
            for item in response["Responses"].get(self.table.name, [])
        }
        return {pid: pid in liked for pid in post_ids}

    def add_comment(self, post_id: str, user_id: str, text: str) -> dict:
        comment_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc).isoformat()

        item = {
            **Keys.comment(post_id, created_at, comment_id),
            "comment_id": comment_id,
            "post_id":    post_id,
            "user_id":    user_id,
            "text":       text,
            "created_at": created_at,
        }

        self.table.put_item(Item=item)
        return clean(item)

    def get_comments(self, post_id: str, limit: int = 50) -> list[dict]:
        response = self.table.query(
            KeyConditionExpression=(
                Key("PK").eq(f"POST#{post_id}") &
                Key("SK").begins_with("COMMENT#")
            ),
            ScanIndexForward=True,
            Limit=limit,
        )
        return [clean(item) for item in response.get("Items", [])]