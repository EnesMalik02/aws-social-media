import strawberry
from strawberry.fastapi import GraphQLRouter
from strawberry.tools import merge_types
from fastapi import Request

from app.graphql.queries import UserQuery, PostQuery
from app.graphql.mutations import UserMutation

Query    = merge_types("Query",    (UserQuery, PostQuery))
Mutation = merge_types("Mutation", (UserMutation,))

schema = strawberry.Schema(query=Query, mutation=Mutation)


async def get_context(request: Request) -> dict:
    from app.core.security import decode_token
    from app.infrastructure.dynamodb import user_repo, post_repo, follow_repo

    token   = request.headers.get("Authorization", "").replace("Bearer ", "")
    user_id = decode_token(token) if token else None

    return {
        "user_id":    user_id,
        "user_repo":  user_repo,
        "post_repo":  post_repo,
        "follow_repo": follow_repo,
    }


def get_graphql_router() -> GraphQLRouter:
    return GraphQLRouter(schema, context_getter=get_context)
