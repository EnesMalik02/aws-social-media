from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.modules.posts import service as post_service
from app.modules.posts.schemas import (
    CreatePostRequest,
    AddCommentRequest,
    PostResponse,
    CommentResponse,
    UploadUrlResponse,
)

router = APIRouter()


@router.get("/upload-url", response_model=UploadUrlResponse)
def get_upload_url(
    filename: str,
    current_user_id: str = Depends(get_current_user)
):
    """Get a presigned S3 URL to upload a photo directly from client."""
    return post_service.get_upload_url(current_user_id, filename)


@router.post("/", response_model=PostResponse, status_code=201)
def create_post(
    body: CreatePostRequest,
    current_user_id: str = Depends(get_current_user)
):
    """Create a new post after photo has been uploaded to S3."""
    return post_service.create(current_user_id, body)


@router.get("/{post_id}", response_model=PostResponse)
def get_post(post_id: str):
    """Get a single post by ID."""
    return post_service.get_post(post_id)


@router.delete("/{post_id}", status_code=204)
def delete_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Delete a post. Only the owner can delete."""
    post_service.delete(post_id, current_user_id)


@router.post("/{post_id}/like", status_code=204)
def like_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Like a post."""
    post_service.like(post_id, current_user_id)


@router.delete("/{post_id}/like", status_code=204)
def unlike_post(
    post_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Remove like from a post."""
    post_service.unlike(post_id, current_user_id)


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=201)
def add_comment(
    post_id: str,
    body: AddCommentRequest,
    current_user_id: str = Depends(get_current_user)
):
    """Add a comment to a post."""
    return post_service.comment(post_id, current_user_id, body.text)


@router.get("/{post_id}/comments", response_model=list[CommentResponse])
def get_comments(post_id: str):
    """Get all comments for a post."""
    return post_service.get_post_comments(post_id)