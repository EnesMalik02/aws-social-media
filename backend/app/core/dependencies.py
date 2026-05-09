from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from app.core.security import decode_token

security = HTTPBearer()


def get_current_user(token=Depends(security)) -> str:
    """
    Dependency injected into protected endpoints.
    Decodes JWT token and returns user_id.
    Raises 401 if token is invalid or expired.
    """
    user_id = decode_token(token.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user_id