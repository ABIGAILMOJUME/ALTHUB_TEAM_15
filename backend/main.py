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
    RequestIDMiddleware
)
from fastapi.responses import Response
from prometheus_client import generate_latest
import models
from database import engine
from routes.auth import login_router
from routes.user import user_router
from routes.pickup import pickup_router
from routes.report import report_router
from routes import admin
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

app.include_router(admin.admin_router)
app.include_router(login_router)
app.include_router(user_router)
app.include_router(pickup_router)
app.include_router(report_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {"message: Welcome to home page"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": time.time()}

# Metrics endpoint for Prometheus
@app.get("/metrics")
async def metrics():
    return Response(generate_latest())

# Startup event
@app.on_event("startup")
async def startup_event():
    import logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[logging.StreamHandler()]
    )
    
    print("Application started with production middleware")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
