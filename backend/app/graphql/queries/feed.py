from typing import Optional

import strawberry
from strawberry.types import Info
from fastapi import HTTPException

from app.graphql.types.feed import FeedPostType, FeedResponse

_PAGE_SIZE = 20


def resolve_feed(info: Info, limit: int = _PAGE_SIZE, cursor: Optional[str] = None) -> FeedResponse:
    user_id = info.context.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Authentication required")

    follow_repo = info.context["follow_repo"]
    post_repo   = info.context["post_repo"]
    user_repo   = info.context["user_repo"]

    following = follow_repo.get_following(user_id)
    if not following:
        return FeedResponse(posts=[], next_cursor=None, has_more=False)

    fetch_limit = limit + 1
    all_posts: list[dict] = []
    for entry in following:
        posts = post_repo.get_user_posts_page(entry["following_id"], limit=fetch_limit, cursor=cursor)
        all_posts.extend(posts)

    all_posts.sort(key=lambda p: p["created_at"], reverse=True)

    has_more   = len(all_posts) > limit
    page       = all_posts[:limit]
    next_cursor = page[-1]["created_at"] if has_more and page else None

    author_ids = list({p["user_id"] for p in page})
    authors: dict[str, dict] = {}
    for aid in author_ids:
        user = user_repo.get_user_by_id(aid)
        if user:
            authors[aid] = user

    post_ids  = [p["post_id"] for p in page]
    liked_map = post_repo.batch_is_liked(post_ids, user_id)

    feed_posts = [
        FeedPostType(
            post_id=p["post_id"],
            user_id=p["user_id"],
            username=authors.get(p["user_id"], {}).get("username", ""),
            avatar=authors.get(p["user_id"], {}).get("avatar", ""),
            caption=p["caption"],
            image_url=p["image_url"],
            likes_count=int(p.get("likes_count", 0)),
            created_at=p["created_at"],
            is_liked=liked_map.get(p["post_id"], False),
        )
        for p in page
    ]

    return FeedResponse(posts=feed_posts, next_cursor=next_cursor, has_more=has_more)


@strawberry.type
class FeedQuery:
    feed: FeedResponse = strawberry.field(resolver=resolve_feed)
