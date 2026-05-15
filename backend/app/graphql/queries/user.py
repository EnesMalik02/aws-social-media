import strawberry
from strawberry.types import Info
from fastapi import HTTPException

from app.graphql.types.user import UserType, UserProfileType
from app.graphql.types.post import PostType


def resolve_me(info: Info) -> UserType:
    user_id   = info.context.get("user_id")
    user_repo = info.context["user_repo"]

    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")

    user = user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserType(**user)


def _build_user_profile(info: Info, user: dict) -> UserProfileType:
    post_repo   = info.context["post_repo"]
    follow_repo = info.context["follow_repo"]
    current_user_id = info.context.get("user_id")

    user_id = user["user_id"]
    posts = post_repo.get_user_posts(user_id)

    is_following = False
    if current_user_id and current_user_id != user_id:
        follow = follow_repo.get_follow(current_user_id, user_id)
        is_following = follow is not None

    return UserProfileType(
        user_id=user["user_id"],
        username=user["username"],
        bio=user.get("bio", ""),
        avatar=user.get("avatar", ""),
        followers_count=int(user.get("followers_count", 0)),
        following_count=int(user.get("following_count", 0)),
        is_owner=current_user_id == user_id,
        is_following=is_following,
        posts=[PostType(**p) for p in posts],
    )


def resolve_user_profile_by_username(info: Info, username: str) -> UserProfileType:
    user_repo = info.context["user_repo"]
    user = user_repo.get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return _build_user_profile(info, user)


@strawberry.type
class UserQuery:
    me: UserType = strawberry.field(resolver=resolve_me)
    user_profile_by_username: UserProfileType = strawberry.field(resolver=resolve_user_profile_by_username)