from strawberry.types import Info
from fastapi import HTTPException

from app.graphql.types.user import UserType


def resolve_me(info: Info) -> UserType:
    user_id   = info.context["user_id"]
    user_repo = info.context["user_repo"]

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


