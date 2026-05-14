import strawberry
from strawberry.types import Info
from fastapi import HTTPException
from typing import Optional

from app.graphql.types.user import UserType


@strawberry.input
class UpdateProfileInput:
    username: Optional[str] = None
    bio:      Optional[str] = None
    avatar:   Optional[str] = None


def resolve_update_profile(info: Info, input: UpdateProfileInput) -> UserType:
    user_id   = info.context.get("user_id")
    user_repo = info.context["user_repo"]

    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    fields = {}
    if input.username is not None:
        existing = user_repo.get_user_by_username(input.username)
        if existing and existing["user_id"] != user_id:
            raise HTTPException(status_code=409, detail="Username already taken")
        fields["username"] = input.username.lower()

    if input.bio is not None:
        fields["bio"] = input.bio

    if input.avatar is not None:
        fields["avatar"] = input.avatar

    if not fields:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated = user_repo.update_user(user_id, fields)

    return UserType(
        user_id=updated["user_id"],
        username=updated["username"],
        email=updated["email"],
        bio=updated.get("bio"),
        avatar=updated.get("avatar"),
    )
