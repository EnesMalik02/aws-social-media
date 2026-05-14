from fastapi import APIRouter, Depends
from app.modules.auth.service import AuthService
from app.modules.auth.dependencies import get_auth_service
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
def register(body: RegisterRequest, service: AuthService = Depends(get_auth_service)):
    return service.register(body)


@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, service: AuthService = Depends(get_auth_service)):
    return service.login(body)


@router.get("/me", response_model=MeResponse)
def me(current_user_id: str = Depends(get_current_user), service: AuthService = Depends(get_auth_service)):
    return service.get_me(current_user_id)


@router.get("/refresh")
def refresh(user_id: str = Depends(validate_token), service: AuthService = Depends(get_auth_service)):
    return service.refresh_token(user_id)
