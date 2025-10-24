import uuid
from datetime import datetime
from typing import Literal

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from ..providers import provider_manager
from ..supabase_client import supabase_client

router = APIRouter()


class GenerateRequest(BaseModel):
    type: Literal["blog", "caption", "tweet"]
    topic: str
    user_id: str = "anonymous"


class GenerateResponse(BaseModel):
    generated_text: str


@router.post("/", response_model=GenerateResponse)
async def generate(req: GenerateRequest, authorization: str = Header(None)):
    """Generate content using the configured provider (no auto-save)."""
    prov = provider_manager.get_provider()
    if prov is None:
        raise HTTPException(status_code=500, detail="No provider configured")

    text = await prov.generate(req.type, req.topic)

    # Don't auto-save - user will manually save via the history endpoint
    return {"generated_text": text}
