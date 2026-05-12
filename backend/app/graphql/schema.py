import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import Request
from typing import List

from app.graphql.queries.user import resolve_me
from app.graphql.queries.post import resolve_post, resolve_user_posts, resolve_post_comments
from app.graphql.mutations.user import resolve_update_profile, UpdateProfileInput
from app.graphql.types.user import UserType
from app.graphql.types.post import PostType, CommentType


@strawberry.type
class Query:
    me: UserType = strawberry.field(resolver=resolve_me)

    post: PostType = strawberry.field(resolver=resolve_post)

    user_posts: List[PostType] = strawberry.field(resolver=resolve_user_posts)

    post_comments: List[CommentType] = strawberry.field(resolver=resolve_post_comments)


@strawberry.type
class Mutation:
    update_profile: UserType = strawberry.mutation(resolver=resolve_update_profile)


schema = strawberry.Schema(query=Query, mutation=Mutation)


async def get_context(request: Request) -> dict:
    from app.core.security import decode_token
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user_id = decode_token(token) if token else None
    return {"user_id": user_id}


def get_graphql_router() -> GraphQLRouter:
    return GraphQLRouter(schema, context_getter=get_context)