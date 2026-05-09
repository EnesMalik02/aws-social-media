from boto3.dynamodb.conditions import Key
from app.infrastructure.dynamodb import table
from app.infrastructure.keys import Keys


def create_user(user_id: str, username: str, email: str, password_hash: str) -> dict:
    """Insert a new user into DynamoDB."""
    item = {
        **Keys.user(user_id),           # PK, SK
        **Keys.username_index(username), # GSI1PK, GSI1SK
        **Keys.email_index(email),       # GSI2PK, GSI2SK
        "user_id":  user_id,
        "username": username.lower(),
        "email":    email.lower(),
        "password": password_hash,
        "bio":      "",
        "avatar":   "",
    }
    table.put_item(Item=item)
    return item


def get_user_by_id(user_id: str) -> dict | None:
    """Fetch user by primary key."""
    response = table.get_item(Key=Keys.user(user_id))
    return response.get("Item")


def get_user_by_username(username: str) -> dict | None:
    """Fetch user by username using GSI1."""
    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("GSI1PK").eq(f"USERNAME#{username.lower()}"),
    )
    items = response.get("Items", [])
    return items[0] if items else None


def get_user_by_email(email: str) -> dict | None:
    """Fetch user by email using GSI2."""
    response = table.query(
        IndexName="GSI2",
        KeyConditionExpression=Key("GSI2PK").eq(f"EMAIL#{email.lower()}"),
    )
    items = response.get("Items", [])
    return items[0] if items else None


def update_user(user_id: str, fields: dict) -> dict | None:
    """Update specific fields of a user profile."""
    # Build update expression dynamically
    update_expr   = "SET " + ", ".join(f"#{k} = :{k}" for k in fields)
    attr_names    = {f"#{k}": k for k in fields}
    attr_values   = {f":{k}": v for k, v in fields.items()}

    response = table.update_item(
        Key=Keys.user(user_id),
        UpdateExpression=update_expr,
        ExpressionAttributeNames=attr_names,
        ExpressionAttributeValues=attr_values,
        ReturnValues="ALL_NEW",
    )
    return response.get("Attributes")