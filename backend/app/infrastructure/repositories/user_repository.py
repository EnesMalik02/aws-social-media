from boto3.dynamodb.conditions import Key
from app.infrastructure.keys import Keys
from app.infrastructure.utils import clean

class UserRepository:
    def __init__(self, table): 
        self.table = table

    def create_user(self, user_id: str, username: str, email: str, password_hash: str) -> dict:
        item = {
            **Keys.user(user_id),
            **Keys.username_index(username),
            **Keys.email_index(email),
            "user_id":  user_id,
            "username": username.lower(),
            "email":    email.lower(),
            "password": password_hash,
            "bio":      "",
            "avatar":   "",
        }
        self.table.put_item(Item=item)
        return clean(item)

    def get_user_by_id(self, user_id: str) -> dict | None:
        response = self.table.get_item(Key=Keys.user(user_id))
        return clean(response.get("Item"))

    def get_user_by_username(self, username: str) -> dict | None:
        response = self.table.query(
            IndexName="GSI1",
            KeyConditionExpression=Key("GSI1PK").eq(f"USERNAME#{username.lower()}"),
        )
        items = response.get("Items", [])
        return clean(items[0]) if items else None

    def get_user_by_email(self, email: str) -> dict | None:
        response = self.table.query(
            IndexName="GSI2",
            KeyConditionExpression=Key("GSI2PK").eq(f"EMAIL#{email.lower()}"),
        )
        items = response.get("Items", [])
        return clean(items[0]) if items else None

    def update_user(self, user_id: str, fields: dict) -> dict | None:
        update_expr = "SET " + ", ".join(f"#{k} = :{k}" for k in fields)
        attr_names  = {f"#{k}": k for k in fields}
        attr_values = {f":{k}": v for k, v in fields.items()}

        response = self.table.update_item(
            Key=Keys.user(user_id),
            UpdateExpression=update_expr,
            ExpressionAttributeNames=attr_names,
            ExpressionAttributeValues=attr_values,
            ReturnValues="ALL_NEW",
        )
        return clean(response.get("Attributes"))