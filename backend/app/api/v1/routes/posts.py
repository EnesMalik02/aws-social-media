from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_user
from app.modules.posts.service import PostService
from app.modules.posts.dependencies import get_post_service
from app.modules.posts.schemas import (
    CreatePostRequest,
    AddCommentRequest,
    PostResponse,
    CommentResponse,
    UploadUrlResponse,
)

router = APIRouter()


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"}

@router.get("/upload-url", response_model=UploadUrlResponse)
def get_upload_url(
    filename: str,
    content_type: str = "image/jpeg",
    current_user_id: str = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")
    return service.get_upload_url(current_user_id, filename, content_type)


@router.post("/", response_model=PostResponse, status_code=201)
def create_post(
    body: CreatePostRequest,
    current_user_id: str = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    return service.create(current_user_id, body)


@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: str,
    service: PostService = Depends(get_post_service),
):
    return service.get_post(post_id)


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    service.delete(post_id, current_user_id)


@router.post("/{post_id}/like", status_code=204)
def like_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    service.like(post_id, current_user_id)


@router.delete("/{post_id}/like", status_code=204)
def unlike_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    service.unlike(post_id, current_user_id)


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=201)
def add_comment(
    post_id: str,
    body: AddCommentRequest,
    current_user_id: str = Depends(get_current_user),
    service: PostService = Depends(get_post_service),
):
    return service.comment(post_id, current_user_id, body.text)


@router.get("/{post_id}/comments", response_model=list[CommentResponse])
def get_comments(
    post_id: str,
    service: PostService = Depends(get_post_service),
):
    return service.get_post_comments(post_id)
