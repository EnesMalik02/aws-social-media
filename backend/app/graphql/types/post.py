import strawberry
from typing import Optional


@strawberry.type
class PostType:
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
class CommentType:
    comment_id: str
    post_id:    str
    user_id:    str
    text:       str
    created_at: str


@strawberry.type
class DiscoverPostType:
    post_id:         str
    user_id:         str
    caption:         str
    image_url:       str
    likes_count:     int
    created_at:      str
    author_username: str
    author_avatar:   str


@strawberry.type
class DiscoverResponse:
    posts:       list[DiscoverPostType]
    next_cursor: Optional[str]
    has_more:    bool