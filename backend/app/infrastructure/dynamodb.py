import boto3
from boto3.dynamodb.conditions import Key
from app.core.config import settings

# Connects to DynamoDB using explicit credentials from .env (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY).
# Previously relied on boto3's default credential chain (~/.aws/credentials → env vars → EC2/ECS metadata).
# dynamodb = boto3.resource("dynamodb", region_name=settings.AWS_REGION)

dynamodb = boto3.resource(
    "dynamodb",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)
table    = dynamodb.Table(settings.DYNAMODB_TABLE)


def create_user(user_id: str, username: str, email: str, password_hash: str):
    # Ana kayıt
    table.put_item(Item={
        "PK":       f"USER#{user_id}",
        "SK":       "PROFILE",
        "user_id":  user_id,
        "username": username,
        "email":    email,
        "password": password_hash,
        "bio":      "",
        "avatar":   "",
        "GSI1PK":   f"USERNAME#{username}",
        "GSI1SK":   "PROFILE",
    })


def get_user_by_id(user_id: str) -> dict | None:
    response = table.get_item(Key={
        "PK": f"USER#{user_id}",
        "SK": "PROFILE",
    })
    return response.get("Item")


def get_user_by_username(username: str) -> dict | None:
    response = table.query(
        IndexName="GSI1",
        KeyConditionExpression=Key("GSI1PK").eq(f"USERNAME#{username}"),
    )
    items = response.get("Items", [])
    return items[0] if items else None


def get_user_by_email(email: str) -> dict | None:
    # Email ile arama için GSI2 lazım — şimdilik scan kullan
    # Production'da GSI ekle
    response = table.scan(
        FilterExpression="email = :email",
        ExpressionAttributeValues={":email": email}
    )
    items = response.get("Items", [])
    return items[0] if items else None