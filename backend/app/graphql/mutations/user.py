import strawberry
from strawberry.types import Info
from fastapi import HTTPException
from typing import Optional

from app.graphql.types.user import UserType
from app.infrastructure.repositories.user_repository import (
    get_user_by_username,
    update_user,
)


@strawberry.input
class UpdateProfileInput:
    """Fields the user can update. All optional — only send what changed."""
    username: Optional[str] = None
    bio:      Optional[str] = None
    avatar:   Optional[str] = None


def resolve_update_profile(info: Info, input: UpdateProfileInput) -> UserType:
    user_id = info.context.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Build only changed fields
    fields = {}
    if input.username is not None:
        # Check if username already taken by someone else
        existing = get_user_by_username(input.username)
        if existing and existing["user_id"] != user_id:
            raise HTTPException(status_code=409, detail="Username already taken")
        fields["username"] = input.username.lower()

    if input.bio is not None:
        fields["bio"] = input.bio

    if input.avatar is not None:
        fields["avatar"] = input.avatar

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated = update_user(user_id, fields)

    return UserType(
        user_id=updated["user_id"],
        username=updated["username"],
        email=updated["email"],
        bio=updated.get("bio"),
        avatar=updated.get("avatar"),
    )