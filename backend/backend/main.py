import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI(title="ContentGen API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

from .routers import (  # noqa: E402
    auth,
    debug,
    generate,
    history,
    model,
    reminders,
    users,
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(debug.router, prefix="/debug", tags=["debug"])
app.include_router(generate.router, prefix="/generate", tags=["generate"])
app.include_router(history.router, prefix="/history", tags=["history"])
app.include_router(reminders.router, prefix="/reminders", tags=["reminders"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(model.router, tags=["model"])  # Custom model info endpoint

from . import db as _db  # noqa: E402


@app.on_event("startup")
async def _startup():
    # Skip database connection if using REST API
    if os.getenv("USE_SUPABASE_REST", "false").lower() == "true":
        print("🔄 Using Supabase REST API (skipping direct database connection)")
        return

    try:
        print("🔌 Connecting to database...")
        await _db.connect()
        print("✅ Database connected successfully!")
    except Exception as e:
        print(f"⚠️ Database connection failed: {e}")
        print("⚠️ Running in dev mode without database")
        pass


@app.on_event("shutdown")
async def _shutdown():
    # Skip database disconnection if using REST API
    if os.getenv("USE_SUPABASE_REST", "false").lower() == "true":
        print("🔄 REST API mode - no database connection to close")
        return

    try:
        print("🔌 Disconnecting from database...")
        await _db.disconnect()
        print("✅ Database disconnected")
    except Exception as e:
        print(f"⚠️ Database disconnect failed: {e}")
        pass
