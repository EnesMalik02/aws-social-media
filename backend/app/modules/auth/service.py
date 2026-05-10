import uuid
from fastapi import HTTPException

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.infrastructure.dynamodb import user_repo
from app.modules.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    RegisterResponse,
    LoginResponse,
    MeResponse,
    UserResponse,
    TokenResponse,
)


def _build_user_response(user: dict) -> UserResponse:
    """Convert DynamoDB item to UserResponse schema."""
    return UserResponse(
        user_id=user["user_id"],
        username=user["username"],
        email=user["email"],
        bio=user.get("bio"),
        avatar=user.get("avatar"),
    )


def register(body: RegisterRequest) -> RegisterResponse:
    # Check if email already exists
    if user_repo.get_user_by_email(body.email):
        raise HTTPException(status_code=409, detail="Email already registered")

    # Check if username already taken
    if user_repo.get_user_by_username(body.username):
        raise HTTPException(status_code=409, detail="Username already taken")

    user_id = str(uuid.uuid4())

    user = user_repo.create_user(
        user_id=user_id,
        username=body.username,
        email=body.email,
        password_hash=hash_password(body.password),
    )

    return RegisterResponse(
        user=_build_user_response(user),
        token=TokenResponse(
            access_token=create_access_token(user_id),
            refresh_token=create_refresh_token(user_id),
        ),
    )


def login(body: LoginRequest) -> LoginResponse:
    user = user_repo.get_user_by_email(body.email)

    # Return same error for wrong email or wrong password — prevents user enumeration
    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return LoginResponse(
        user=_build_user_response(user),
        token=TokenResponse(
            access_token=create_access_token(user["user_id"]),
            refresh_token=create_refresh_token(user["user_id"]),
            ),
    )


def get_me(user_id: str) -> MeResponse:
    user = user_repo.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return MeResponse(
        user_id=user["user_id"],
        username=user["username"],
        email=user["email"],
        bio=user.get("bio"),
        avatar=user.get("avatar"),
    )

def refresh_token(user_id: str) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(user_id),
        refresh_token=create_refresh_token(user_id),
    )