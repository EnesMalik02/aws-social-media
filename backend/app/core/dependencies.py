from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from app.core.security import decode_token
from jose import jwt, JWTError
from app.core.config import settings

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

def validate_token(token=Depends(security)) -> str:
    try:
        decoded_data = jwt.decode(token.credentials, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_id = decoded_data.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    