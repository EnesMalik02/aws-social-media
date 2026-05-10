from pydantic import HttpUrl
from strawberry.types import Info
from fastapi import HTTPException

from app.graphql.types.user import UserType
from app.infrastructure.dynamodb import user_repo


def resolve_me(info: Info) -> UserType:
    """
    Returns the currently authenticated user's profile.
    Reads user_id from request context — set by JWT middleware.
    """
    # Get user_id injected by auth middleware
    user_id = info.context["user_id"]

    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user = user_repo.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserType(
        user_id=user["user_id"],
        username=user["username"],
        email=user["email"],
        bio=user.get("bio", ""),
        avatar=user.get("avatar", ""),
    )

def resolve_user(id: str) -> UserType:
    user = user_repo.get_user_by_id(id)

    if not user:
        raise HTTPException(status_code=404, detail="User Not Found")
    
    return UserType(
        user_id=user["user_id"],
        username=user["username"],
        email=user["email"],
        bio=user["bio"],
        avatar=user["avatar"]
    )