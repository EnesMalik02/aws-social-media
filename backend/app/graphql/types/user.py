import strawberry


@strawberry.type
class UserType:
    """GraphQL type for user data returned in queries."""
    user_id:  str
    username: str
    email:    str
    bio:      str
    avatar:   str