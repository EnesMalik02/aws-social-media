import boto3
from boto3.dynamodb.conditions import Key
from app.core.config import settings

# Initialize DynamoDB client once — reused across Lambda warm starts
dynamodb = boto3.resource("dynamodb", region_name=settings.AWS_REGION)
table    = dynamodb.Table(settings.DYNAMODB_TABLE)


# --- User Operations ---

def create_user(user_id: str, username: str, email: str, password_hash: str) -> dict:
    """Create a new user record in DynamoDB using single table design."""
    item = {
        "PK":       f"USER#{user_id}",
        "SK":       "PROFILE",
        "user_id":  user_id,
        "username": username,
        "email":    email,
        "password": password_hash,
        "bio":      "",
        "avatar":   "",
        # GSI1 allows querying by username
        "GSI1PK":   f"USERNAME#{username}",
        "GSI1SK":   "PROFILE",
        # GSI2 allows querying by email
        "GSI2PK":   f"EMAIL#{email}",
        "GSI2SK":   "PROFILE",
    }
    table.put_item(Item=item)
    return item


def get_user_by_id(user_id: str) -> dict | None:
    """Fetch user profile by user ID."""
    response = table.get_item(Key={
        "PK": f"USER#{user_id}",
        "SK": "PROFILE",
    })
    return response.get("Item")


def get_user_by_username(username: str) -> dict | None:
    """Fetch user profile by username using GSI1."""
    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("GSI1PK").eq(f"USERNAME#{username.lower()}"),
    )
    items = response.get("Items", [])
    return items[0] if items else None


def get_user_by_email(email: str) -> dict | None:
    """Fetch user profile by email using GSI2."""
    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("GSI1PK").eq(f"EMAIL#{email.lower()}"),
    )
    items = response.get("Items", [])
    return items[0] if items else None