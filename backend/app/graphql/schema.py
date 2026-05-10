import strawberry
from strawberry.fastapi import GraphQLRouter
from fastapi import Request

from app.graphql.queries.user import resolve_me, resolve_user
from app.graphql.mutations.user import resolve_update_profile
from app.graphql.types.user import UserType


@strawberry.type
class Query:
    me: UserType = strawberry.field(resolver=resolve_me)
    
    user: UserType = strawberry.field(resolver=resolve_user)

@strawberry.type
class Mutation:
    update_profile: UserType = strawberry.mutation(
        resolver=resolve_update_profile,
        permission_classes=[]
        )

schema = strawberry.Schema(query=Query, mutation=Mutation)


async def get_context(request: Request) -> dict:
    from app.core.security import decode_token
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    user_id = decode_token(token) if token else None
    return {"user_id": user_id}


def get_graphql_router() -> GraphQLRouter:
    return GraphQLRouter(schema, context_getter=get_context)