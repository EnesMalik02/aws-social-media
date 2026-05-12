import boto3
from app.core.config import settings
from app.infrastructure.repositories.user_repository import UserRepository
from app.infrastructure.repositories.post_repository import PostRepository

dynamodb = boto3.resource("dynamodb", region_name=settings.AWS_REGION)
table    = dynamodb.Table(settings.DYNAMODB_TABLE)

user_repo = UserRepository(table=table)
post_repo = PostRepository(table=table)