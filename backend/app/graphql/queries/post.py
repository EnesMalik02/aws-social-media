import strawberry
from strawberry.types import Info
from fastapi import HTTPException

from app.graphql.types.post import PostType, CommentType


def resolve_post(info: Info, post_id: str) -> PostType:
    post_repo = info.context["post_repo"]
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostType(**post)


def resolve_user_posts(info: Info, user_id: str) -> list[PostType]:
    post_repo = info.context["post_repo"]
    posts = post_repo.get_user_posts(user_id)
    return [PostType(**p) for p in posts]


def resolve_post_comments(info: Info, post_id: str) -> list[CommentType]:
    post_repo = info.context["post_repo"]
    comments = post_repo.get_comments(post_id)
    return [CommentType(**c) for c in comments]


@strawberry.type
class PostQuery:
    post: PostType = strawberry.field(resolver=resolve_post)
    user_posts: list[PostType] = strawberry.field(resolver=resolve_user_posts)
    post_comments: list[CommentType] = strawberry.field(resolver=resolve_post_comments)
