from app.api.v1.router import router as v1_router
from app.graphql.schema import get_graphql_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Pixora API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(v1_router, prefix="/v1")
app.include_router(get_graphql_router(), prefix="/graphql")




@app.get("/health")
async def health():
    return {"status": "ok"}