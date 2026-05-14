from fastapi import Depends
from app.infrastructure.dynamodb import post_repo
from app.infrastructure.repositories.post_repository import PostRepository
from app.modules.posts.service import PostService


def get_post_repo() -> PostRepository:
    return post_repo


def get_post_service(repo: PostRepository = Depends(get_post_repo)) -> PostService:
    return PostService(post_repo=repo)
