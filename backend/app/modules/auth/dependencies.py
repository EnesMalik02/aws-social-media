from fastapi import Depends
from app.infrastructure.dynamodb import user_repo
from app.infrastructure.repositories.user_repository import UserRepository
from app.modules.auth.service import AuthService


def get_user_repo() -> UserRepository:
    return user_repo


def get_auth_service(repo: UserRepository = Depends(get_user_repo)) -> AuthService:
    return AuthService(user_repo=repo)
