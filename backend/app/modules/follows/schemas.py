from pydantic import BaseModel


class FollowUserResponse(BaseModel):
    user_id:  str
    username: str
    avatar:   str = ""


class FollowStatusResponse(BaseModel):
    """Used for both follow and unfollow responses."""
    following:       bool
    followers_count: int