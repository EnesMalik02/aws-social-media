from fastapi import FastAPI
from app.api.routes import auth, users, posts

app = FastAPI(title="Pixora API", version="0.1.0")

app.include_router(auth.router)

@app.get("/health")
async def health():
    return {"status": "ok"}