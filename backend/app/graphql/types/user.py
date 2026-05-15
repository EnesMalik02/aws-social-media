import strawberry
from app.graphql.types.post import PostType


@strawberry.type
class UserType:
    user_id:  str
    username: str
    email:    str
    bio:      str
    avatar:   str


@strawberry.type
class UserProfileType:
    user_id:         str
    username:        str
    bio:             str
    avatar:          str
    followers_count: int
    following_count: int
    is_owner:        bool
    is_following:    bool
    posts:           list[PostType]