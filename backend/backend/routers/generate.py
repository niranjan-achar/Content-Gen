import uuid
from datetime import datetime
from typing import Literal

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from .. import db
from ..providers import provider_manager

router = APIRouter()


class GenerateRequest(BaseModel):
    type: Literal["blog", "caption", "tweet"]
    topic: str
    user_id: str = "anonymous"


class GenerateResponse(BaseModel):
    generated_text: str
    history_id: str


@router.post("/", response_model=GenerateResponse)
async def generate(req: GenerateRequest, authorization: str = Header(None)):
    """Generate content using the configured provider and save to history."""
    prov = provider_manager.get_provider()
    if prov is None:
        raise HTTPException(status_code=500, detail="No provider configured")
    
    text = await prov.generate(req.type, req.topic)
    
    # Save to history
    history_id = str(uuid.uuid4())
    try:
        query = """
            INSERT INTO public.content_history 
            (id, user_id, type, input_text, generated_text, created_at)
            VALUES (:id, :user_id, :type, :input_text, :generated_text, :created_at)
        """
        await db.db.execute(
            query=query,
            values={
                "id": history_id,
                "user_id": req.user_id,
                "type": req.type,
                "input_text": req.topic,
                "generated_text": text,
                "created_at": datetime.utcnow()
            }
        )
    except Exception as e:
        # If DB fails, still return the generated text
        print(f"Failed to save history: {e}")
    
    return {"generated_text": text, "history_id": history_id}
