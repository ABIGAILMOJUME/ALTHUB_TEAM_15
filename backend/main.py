import os, time
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from middleware import (
    SecurityMiddleware,
    LoggingMiddleware,
    MonitoringMiddleware,
    RateLimitingMiddleware,
    ErrorHandlingMiddleware,
    RequestIDMiddleware)
import models
from database import engine
from routes.auth import auth_router
from routes.user import user_router
from routes.pickup import pickup_router
from routes.report import report_router
from core.config import settings


models.Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)



app = FastAPI(
    title="Waste Management API",
    description="Production API with middleware",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

app.add_middleware(RequestIDMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityMiddleware)
app.add_middleware(MonitoringMiddleware)
app.add_middleware(RateLimitingMiddleware)
app.add_middleware(ErrorHandlingMiddleware)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(pickup_router)
app.include_router(report_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {"message: Welcome to home page"}


