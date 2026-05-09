from fastapi import APIRouter, Depends
from app.modules.auth import service as auth_service
from app.modules.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    RegisterResponse,
    LoginResponse,
    MeResponse,
)
from app.core.dependencies import get_current_user, validate_token

router = APIRouter()


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(body: RegisterRequest):
    """Register a new user and return access and refresh token."""
    return auth_service.register(body)


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    """Login with email and password, returns access and refresh token."""
    return auth_service.login(body)


@router.get("/me", response_model=MeResponse)
def me(current_user_id: str = Depends(get_current_user)):
    """Get current authenticated user's profile."""
    return auth_service.get_me(current_user_id)


@router.get("/refresh")
def refresh(user_id: str = Depends(validate_token)):
    return auth_service.refresh_token(user_id)

