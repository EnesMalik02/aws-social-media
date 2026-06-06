import json
import base64
from typing import Optional

import strawberry
from strawberry.types import Info

from app.graphql.types.post import DiscoverPostType, DiscoverResponse


def resolve_discover(
    info: Info,
    limit: int = 20,
    cursor: Optional[str] = None,
) -> DiscoverResponse:
    post_repo = info.context["post_repo"]
    user_repo = info.context["user_repo"]

    last_evaluated_key = None
    if cursor:
        try:
            last_evaluated_key = json.loads(base64.b64decode(cursor).decode())
        except Exception:
            last_evaluated_key = None

    result = post_repo.get_discover_posts(limit=limit, last_evaluated_key=last_evaluated_key)

    author_ids = list({p["user_id"] for p in result["items"]})
    authors: dict[str, dict] = {}
    for aid in author_ids:
        user = user_repo.get_user_by_id(aid)
        if user:
            authors[aid] = user

    posts = [
        DiscoverPostType(
            post_id=post["post_id"],
            user_id=post["user_id"],
            caption=post["caption"],
            image_url=post["image_url"],
            likes_count=int(post.get("likes_count", 0)),
            created_at=post["created_at"],
            author_username=authors.get(post["user_id"], {}).get("username", ""),
            author_avatar=authors.get(post["user_id"], {}).get("avatar", ""),
        )
        for post in result["items"]
    ]

    next_cursor = None
    if result["last_evaluated_key"]:
        next_cursor = base64.b64encode(
            json.dumps(result["last_evaluated_key"]).encode()
        ).decode()

    return DiscoverResponse(posts=posts, next_cursor=next_cursor, has_more=result["has_more"])


@strawberry.type
class DiscoverQuery:
    discover: DiscoverResponse = strawberry.field(resolver=resolve_discover)
