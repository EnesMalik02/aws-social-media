import strawberry
from typing import Optional


@strawberry.type
class FeedPostType:
    post_id:     str
    user_id:     str
    username:    str
    avatar:      str
    caption:     str
    image_url:   str
    likes_count: int
    created_at:  str
    is_liked:    bool


@strawberry.type
class FeedResponse:
    posts:       list[FeedPostType]
    next_cursor: Optional[str]
    has_more:    bool
