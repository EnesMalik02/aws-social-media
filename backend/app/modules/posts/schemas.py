from pydantic import BaseModel
from typing import Optional


# --- Request Schemas ---

class CreatePostRequest(BaseModel):
    caption:   str
    image_url: str


class AddCommentRequest(BaseModel):
    text: str


# --- Response Schemas ---

class PostResponse(BaseModel):
    post_id:     str
    user_id:     str
    caption:     str
    image_url:   str
    likes_count: int = 0
    created_at:  str


class CommentResponse(BaseModel):
    comment_id: str
    post_id:    str
    user_id:    str
    text:       str
    created_at: str


class UploadUrlResponse(BaseModel):
    upload_url: str  # presigned URL for S3 upload
    image_url:  str  # final public URL after upload