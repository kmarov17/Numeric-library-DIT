from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth.auth import router as auth_router
from app.routers.auth.users import router as users_router
from app.routers.books import router as books_router
from app.routers.loans import router as loans_router


app = FastAPI(
    title="DIT Numeric Library API",
    description="API for Project DIT Numeric Library",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

prefix = "/api"
app.include_router(auth_router, prefix=prefix)
app.include_router(users_router, prefix=prefix)
app.include_router(books_router, prefix=prefix)
app.include_router(loans_router, prefix=prefix)

@app.get("/", tags=["root"])
async def read_root() -> dict:
    return {"message": "Welcome to DIT Numeric Library API!"}
