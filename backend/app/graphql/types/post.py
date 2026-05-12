import strawberry


@strawberry.type
class PostType:
    post_id:     str
    user_id:     str
    caption:     str
    image_url:   str
    likes_count: int
    created_at:  str


@strawberry.type
class CommentType:
    comment_id: str
    post_id:    str
    user_id:    str
    text:       str
    created_at: str