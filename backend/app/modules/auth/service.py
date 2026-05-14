import uuid
from fastapi import HTTPException

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token
from app.infrastructure.repositories.user_repository import UserRepository
from app.modules.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    RegisterResponse,
    LoginResponse,
    MeResponse,
    UserResponse,
    TokenResponse,
)


class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def _build_user_response(self, user: dict) -> UserResponse:
        return UserResponse(
            user_id=user["user_id"],
            username=user["username"],
            email=user["email"],
            bio=user.get("bio"),
            avatar=user.get("avatar"),
        )

    def register(self, body: RegisterRequest) -> RegisterResponse:
        if self.user_repo.get_user_by_email(body.email):
            raise HTTPException(status_code=409, detail="Email already registered")

        if self.user_repo.get_user_by_username(body.username):
            raise HTTPException(status_code=409, detail="Username already taken")

        user_id = str(uuid.uuid4())

        user = self.user_repo.create_user(
            user_id=user_id,
            username=body.username,
            email=body.email,
            password_hash=hash_password(body.password),
        )

        return RegisterResponse(
            user=self._build_user_response(user),
            token=TokenResponse(
                access_token=create_access_token(user_id),
                refresh_token=create_refresh_token(user_id),
            ),
        )

    def login(self, body: LoginRequest) -> LoginResponse:
        user = self.user_repo.get_user_by_email(body.email)

        if not user or not verify_password(body.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        return LoginResponse(
            user=self._build_user_response(user),
            token=TokenResponse(
                access_token=create_access_token(user["user_id"]),
                refresh_token=create_refresh_token(user["user_id"]),
            ),
        )

    def get_me(self, user_id: str) -> MeResponse:
        user = self.user_repo.get_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return MeResponse(
            user_id=user["user_id"],
            username=user["username"],
            email=user["email"],
            bio=user.get("bio"),
            avatar=user.get("avatar"),
        )

    def refresh_token(self, user_id: str) -> TokenResponse:
        return TokenResponse(
            access_token=create_access_token(user_id),
            refresh_token=create_refresh_token(user_id),
        )
