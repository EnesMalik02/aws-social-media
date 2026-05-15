from boto3.dynamodb.conditions import Key as BotoKey
from app.infrastructure.utils import clean
from app.infrastructure.keys import Keys


class FollowRepository:
    def __init__(self, table) -> None:
        self.table = table

    def follow_user(self, follower_id: str, following_id: str) -> None:
        self.table.meta.client.transact_write_items(
            TransactItems=[
                {
                    "Put": {
                        "TableName": self.table.name,
                        "Item": {
                            **Keys.following(follower_id, following_id),
                            "follower_id":  follower_id,
                            "following_id": following_id,
                        },
                        "ConditionExpression": "attribute_not_exists(PK) AND attribute_not_exists(SK)",
                    }
                },
                {
                    "Put": {
                        "TableName": self.table.name,
                        "Item": {
                            **Keys.follower(following_id, follower_id),
                            "follower_id":  follower_id,
                            "following_id": following_id,
                        },
                    }
                },
                {
                    "Update": {
                        "TableName": self.table.name,
                        "Key": Keys.user(follower_id),
                        "UpdateExpression": "SET following_count = if_not_exists(following_count, :zero) + :inc",
                        "ExpressionAttributeValues": {":inc": 1, ":zero": 0},
                    }
                },
                {
                    "Update": {
                        "TableName": self.table.name,
                        "Key": Keys.user(following_id),
                        "UpdateExpression": "SET followers_count = if_not_exists(followers_count, :zero) + :inc",
                        "ExpressionAttributeValues": {":inc": 1, ":zero": 0},
                    }
                },
            ]
        )

    def unfollow_user(self, follower_id: str, unfollowing_id: str) -> None:
        self.table.meta.client.transact_write_items(
            TransactItems=[
                # Delete follow record
                {
                    "Delete": {
                        "TableName": self.table.name,
                        "Key": Keys.following(follower_id, unfollowing_id),
                        # Fail if not following
                        "ConditionExpression": "attribute_exists(PK) AND attribute_exists(SK)",
                    }
                },
                # Delete reverse index
                {
                    "Delete": {
                        "TableName": self.table.name,
                        "Key": Keys.follower(unfollowing_id, follower_id),
                    }
                },
                # Decrement follower's following_count
                {
                    "Update": {
                        "TableName": self.table.name,
                        "Key": Keys.user(follower_id),
                        "UpdateExpression": "SET following_count = following_count - :dec",
                        "ConditionExpression": "following_count > :zero",
                        "ExpressionAttributeValues": {":dec": 1, ":zero": 0},
                    }
                },
                # Decrement following's followers_count
                {
                    "Update": {
                        "TableName": self.table.name,
                        "Key": Keys.user(unfollowing_id),
                        "UpdateExpression": "SET followers_count = followers_count - :dec",
                        "ConditionExpression": "followers_count > :zero",
                        "ExpressionAttributeValues": {":dec": 1, ":zero": 0},
                    }
                },
            ]
        )

    def get_follow(self, follower_id: str, following_id: str) -> dict | None:
        response = self.table.get_item(Key=Keys.following(follower_id, following_id))
        return response.get("Item")

    def get_following(self, user_id: str, limit: int = 50) -> list[dict]:
        response = self.table.query(
            KeyConditionExpression=(
                BotoKey("PK").eq(f"USER#{user_id}") &
                BotoKey("SK").begins_with("FOLLOWING#")
            ),
            Limit=limit,
        )
        return [clean(item) for item in response.get("Items", [])]

    def get_followers(self, user_id: str, limit: int = 50) -> list[dict]:
        response = self.table.query(
            KeyConditionExpression=(
                BotoKey("PK").eq(f"USER#{user_id}") &
                BotoKey("SK").begins_with("FOLLOWER#")
            ),
            Limit=limit,
        )
        return [clean(item) for item in response.get("Items", [])]