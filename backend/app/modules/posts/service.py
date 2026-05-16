import uuid
from fastapi import HTTPException

from app.infrastructure.repositories.post_repository import PostRepository
from app.infrastructure.s3 import generate_upload_url
from app.modules.posts.schemas import (
    CreatePostRequest,
    PostResponse,
    CommentResponse,
)


class PostService:
    def __init__(self, post_repo: PostRepository):
        self.post_repo = post_repo

    def get_upload_url(self, user_id: str, filename: str, content_type: str = "image/jpeg") -> dict:
        key        = f"posts/{user_id}/{uuid.uuid4()}/{filename}"
        upload_url = generate_upload_url(key, content_type)
        image_url  = f"https://pixora-media-675715936315.s3.eu-central-1.amazonaws.com/{key}"
        return {"upload_url": upload_url, "image_url": image_url}

    def create(self, user_id: str, body: CreatePostRequest) -> PostResponse:
        post = self.post_repo.create_post(user_id, body.caption, body.image_url)
        return PostResponse(**post)

    def get_post(self, post_id: str) -> PostResponse:
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        return PostResponse(**post)

    def get_posts_by_user(self, user_id: str) -> list[PostResponse]:
        posts = self.post_repo.get_user_posts(user_id)
        return [PostResponse(**p) for p in posts]

    def delete(self, post_id: str, user_id: str) -> None:
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if post["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not your post")
        self.post_repo.delete_post(post_id, user_id, post["created_at"])

    def like(self, post_id: str, user_id: str) -> None:
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if self.post_repo.is_liked(post_id, user_id):
            raise HTTPException(status_code=409, detail="Already liked")
        self.post_repo.like_post(post_id, user_id)

    def unlike(self, post_id: str, user_id: str) -> None:
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        if not self.post_repo.is_liked(post_id, user_id):
            raise HTTPException(status_code=409, detail="Not liked yet")
        self.post_repo.unlike_post(post_id, user_id)

    def comment(self, post_id: str, user_id: str, text: str) -> CommentResponse:
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        result = self.post_repo.add_comment(post_id, user_id, text)
        return CommentResponse(**result)

    def get_post_comments(self, post_id: str) -> list[CommentResponse]:
        post = self.post_repo.get_post_by_id(post_id)
        if not post:
            raise HTTPException(status_code=404, detail="Post not found")
        comments = self.post_repo.get_comments(post_id)
        return [CommentResponse(**c) for c in comments]
