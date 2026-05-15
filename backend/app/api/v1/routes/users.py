from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user
from app.modules.follows.service import follow_service
from app.modules.follows.schemas import FollowStatusResponse, FollowUserResponse

router = APIRouter()


@router.post("/{user_id}/follow", response_model=FollowStatusResponse)
def follow(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Follow a user."""
    return follow_service.follow(current_user_id, user_id)


@router.delete("/{user_id}/follow", response_model=FollowStatusResponse)
def unfollow(
    user_id: str,
    current_user_id: str = Depends(get_current_user)
):
    return follow_service.unfollow(current_user_id, user_id)


@router.get("/{user_id}/following", response_model=list[FollowUserResponse])
def get_following(user_id: str):
    """Get list of users that user_id follows."""
    return follow_service.get_following(user_id)


@router.get("/{user_id}/followers", response_model=list[FollowUserResponse])
def get_followers(user_id: str):
    """Get list of users that follow user_id."""
    return follow_service.get_followers(user_id)