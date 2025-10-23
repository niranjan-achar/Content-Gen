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


from .routers import auth, generate, history, reminders  # noqa: E402

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(generate.router, prefix="/generate", tags=["generate"])
app.include_router(history.router, prefix="/history", tags=["history"])
app.include_router(reminders.router, prefix="/reminders", tags=["reminders"])

from . import db as _db  # noqa: E402


@app.on_event("startup")
async def _startup():
    try:
        await _db.connect()
    except Exception:
        # allow dev without DB
        pass


@app.on_event("shutdown")
async def _shutdown():
    try:
        await _db.disconnect()
    except Exception:
        pass
