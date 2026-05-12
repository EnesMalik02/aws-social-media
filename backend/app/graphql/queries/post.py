from strawberry.types import Info
from fastapi import HTTPException

from app.graphql.types.post import PostType, CommentType
from app.infrastructure.dynamodb import post_repo


def resolve_post(info: Info, post_id: str) -> PostType:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostType(**post)


def resolve_user_posts(info: Info, user_id: str) -> list[PostType]:
    posts = post_repo.get_user_posts(user_id)
    return [PostType(**p) for p in posts]


def resolve_post_comments(info: Info, post_id: str) -> list[CommentType]:
    comments = post_repo.get_comments(post_id)
    return [CommentType(**c) for c in comments]