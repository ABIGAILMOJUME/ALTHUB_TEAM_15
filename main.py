import os
from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI
import models
from database import engine
from routes.auth import login_router
from routes.user import user_router
from routes.pickup import pickup_router
from routes.report import report_router
from routes import admin

models.Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)



app = FastAPI()


app.include_router(admin.admin_router)
app.include_router(login_router)
app.include_router(user_router)
app.include_router(pickup_router)
app.include_router(report_router)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.get("/")
def home():
    return {"message: Welcome to home page"}
