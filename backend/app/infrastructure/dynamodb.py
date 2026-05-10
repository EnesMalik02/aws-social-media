import boto3
from app.core.config import settings
from app.infrastructure.repositories.user_repository import UserRepository

# Initialize DynamoDB client once — reused across Lambda warm starts
dynamodb = boto3.resource("dynamodb", region_name=settings.AWS_REGION)
table    = dynamodb.Table(settings.DYNAMODB_TABLE)

user_repo = UserRepository(table=table)