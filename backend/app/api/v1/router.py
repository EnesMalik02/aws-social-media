from fastapi import APIRouter
from app.api.v1.routes import auth, posts, users

router = APIRouter()

router.include_router(auth.router,  prefix="/auth",  tags=["auth"])
router.include_router(posts.router, prefix="/posts", tags=["posts"])
router.include_router(users.router, prefix="/users", tags=["users"])
