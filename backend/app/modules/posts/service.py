# modules/posts/service.py
from app.infrastructure.dynamodb import post_repo
from app.modules.posts.schemas import (
    CreatePostRequest,
    PostResponse,
    CommentResponse,
)
from app.infrastructure.s3 import generate_upload_url
from fastapi import HTTPException


def get_upload_url(user_id: str, filename: str) -> dict:
    import uuid
    key        = f"posts/{user_id}/{uuid.uuid4()}/{filename}"
    upload_url = generate_upload_url(key)
    image_url  = f"https://pixora-media-675715936315.s3.eu-central-1.amazonaws.com/{key}"
    return {"upload_url": upload_url, "image_url": image_url}


def create(user_id: str, body: CreatePostRequest) -> PostResponse:
    post = post_repo.create_post(user_id, body.caption, body.image_url)
    return PostResponse(**post)


def get_post(post_id: str) -> PostResponse:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return PostResponse(**post)


def get_posts_by_user(user_id: str) -> list[PostResponse]:
    posts = post_repo.get_user_posts(user_id)
    return [PostResponse(**p) for p in posts]


def delete(post_id: str, user_id: str) -> None:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not your post")
    post_repo.delete_post(post_id, user_id, post["created_at"])


def like(post_id: str, user_id: str) -> None:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post_repo.is_liked(post_id, user_id):
        raise HTTPException(status_code=409, detail="Already liked")
    post_repo.like_post(post_id, user_id)


def unlike(post_id: str, user_id: str) -> None:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if not post_repo.is_liked(post_id, user_id):
        raise HTTPException(status_code=409, detail="Not liked yet")
    post_repo.unlike_post(post_id, user_id)


def comment(post_id: str, user_id: str, text: str) -> CommentResponse:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    result = post_repo.add_comment(post_id, user_id, text)
    return CommentResponse(**result)


def get_post_comments(post_id: str) -> list[CommentResponse]:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    comments = post_repo.get_comments(post_id)
    return [CommentResponse(**c) for c in comments]