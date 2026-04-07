from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import create_all_tables
from app.routers.sites import router as sites_router
from app.routers.tokens import router as tokens_router
from app.routers.versions import router as versions_router

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup - run before starting up the server
    await create_all_tables()
    yield
    # Teardown - run on shutdown
    pass

app = FastAPI(
    title="StyleSync API",
    description="Tool that transforms websites into interactive design systems.",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sites_router)
app.include_router(tokens_router)
app.include_router(versions_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}
