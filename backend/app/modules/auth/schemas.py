from pydantic import BaseModel, EmailStr, field_validator


# --- Request Schemas ---

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("username")
    @classmethod
    def username_valid(cls, v):
        # Only allow alphanumeric and underscores
        if not v.replace("_", "").isalnum():
            raise ValueError("Username can only contain letters, numbers and underscores")
        if len(v) < 3 or len(v) > 30:
            raise ValueError("Username must be between 3 and 30 characters")
        return v.lower()

    @field_validator("password")
    @classmethod
    def password_valid(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# --- Response Schemas ---

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    user_id:  str
    username: str
    email:    str
    bio:      str = ""
    avatar:   str = ""


class RegisterResponse(BaseModel):
    user:  UserResponse
    token: TokenResponse


class LoginResponse(BaseModel):
    user:  UserResponse
    token: TokenResponse


class MeResponse(BaseModel):
    user_id:  str
    username: str
    email:    str
    bio:      str = ""
    avatar:   str = ""