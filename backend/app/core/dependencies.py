from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from app.core.security import decode_token

security = HTTPBearer()


def get_current_user(token=Depends(security)) -> str:
    user_id = decode_token(token.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user_id


def validate_token(token=Depends(security)) -> str:
    user_id = decode_token(token.credentials)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return user_id
    