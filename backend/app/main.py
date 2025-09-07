from __future__ import annotations
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from .routers.chat import router as chat_router
from .routers.images import router as images_router


app = FastAPI(title="Dhee")

# CORS - allow all by default (adjust in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "frontend")
FRONTEND_DIR = os.path.abspath(FRONTEND_DIR)
STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "static")
STATIC_DIR = os.path.abspath(STATIC_DIR)

os.makedirs(STATIC_DIR, exist_ok=True)

app.include_router(chat_router)
app.include_router(images_router)

# Serve frontend and static
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
