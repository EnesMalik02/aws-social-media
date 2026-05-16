import strawberry
from strawberry.types import Info
from fastapi import HTTPException

from app.graphql.types.post import PostType, CommentType


def resolve_post(info: Info, post_id: str) -> PostType:
    post_repo   = info.context["post_repo"]
    viewer_id   = info.context.get("user_id")
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    is_liked = post_repo.is_liked(post_id, viewer_id) if viewer_id else False
    return PostType(**post, is_liked=is_liked)


def resolve_user_posts(info: Info, user_id: str) -> list[PostType]:
    post_repo = info.context["post_repo"]
    viewer_id = info.context.get("user_id")
    posts     = post_repo.get_user_posts(user_id)
    if not posts:
        return []
    post_ids  = [p["post_id"] for p in posts]
    liked_map = post_repo.batch_is_liked(post_ids, viewer_id) if viewer_id else {}
    return [PostType(**p, is_liked=liked_map.get(p["post_id"], False)) for p in posts]


def resolve_post_comments(info: Info, post_id: str) -> list[CommentType]:
    post_repo = info.context["post_repo"]
    comments = post_repo.get_comments(post_id)
    return [CommentType(**c) for c in comments]


@strawberry.type
class PostQuery:
    post: PostType = strawberry.field(resolver=resolve_post)
    user_posts: list[PostType] = strawberry.field(resolver=resolve_user_posts)
    post_comments: list[CommentType] = strawberry.field(resolver=resolve_post_comments)
