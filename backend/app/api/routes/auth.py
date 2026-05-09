import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.services.dynamodb import create_user, get_user_by_email, get_user_by_username
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/register")
async def register(body: RegisterRequest):
    # Email kullanımda mı?
    if get_user_by_email(body.email):
        raise HTTPException(status_code=409, detail="Email already registered")

    # Username kullanımda mı?
    if get_user_by_username(body.username):
        raise HTTPException(status_code=409, detail="Username already taken")

    user_id = str(uuid.uuid4())

    create_user(
        user_id=user_id,
        username=body.username,
        email=body.email,
        password_hash=hash_password(body.password),
    )

    token = create_access_token(user_id)

    return {
        "user_id":      user_id,
        "username":     body.username,
        "access_token": token,
        "token_type":   "bearer",
    }


@router.post("/login")
async def login(body: LoginRequest):
    user = get_user_by_email(body.email)

    if not user or not verify_password(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user["user_id"])

    return {
        "user_id":      user["user_id"],
        "username":     user["username"],
        "access_token": token,
        "token_type":   "bearer",
    }