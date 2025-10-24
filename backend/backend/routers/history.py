from datetime import datetime
from typing import List, Literal, Optional
from uuid import uuid4

from fastapi import APIRouter, Header, HTTPException, Query
from pydantic import BaseModel

from ..supabase_client import supabase_client

router = APIRouter()


class HistoryItem(BaseModel):
    id: str
    user_id: str
    type: Literal["blog", "caption", "tweet"]
    input_text: Optional[str]
    generated_text: Optional[str]
    created_at: datetime


class HistoryCreate(BaseModel):
    type: Literal["blog", "caption", "tweet"]
    input_text: str
    generated_text: str
    user_id: str


@router.get("/", response_model=List[HistoryItem])
async def list_history(
    type: Optional[Literal["blog", "caption", "tweet"]] = Query(None),
    authorization: str = Header(None),
):
    """List content history, optionally filtered by type."""
    filters = {"type": type} if type else {}
    # If the frontend included a user JWT, forward it to Supabase so RLS
    # policies can authenticate the request. Otherwise this will fall back
    # to the anon/service-role behavior in the client.
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]

    rows = await supabase_client.select(
        "content_history",
        filters=filters,
        order_by="created_at.desc",
        auth_token=auth_token,
    )
    return rows


@router.post("/", response_model=HistoryItem)
async def create_history(item: HistoryCreate, authorization: str = Header(None)):
    """Manually save content to history."""
    print(f"🔍 Received history create request:")
    print(f"   user_id: {item.user_id}")
    print(f"   type: {item.type}")
    print(f"   authorization header present: {bool(authorization)}")
    
    data = {
        "user_id": item.user_id,
        "type": item.type,
        "input_text": item.input_text,
        "generated_text": item.generated_text,
    }
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]

    result = await supabase_client.insert(
        "content_history", data, auth_token=auth_token
    )
    if result:
        return result
    else:
        raise HTTPException(status_code=500, detail="Failed to save history")


@router.delete("/{item_id}")
async def delete_history(item_id: str, authorization: str = Header(None)):
    """Delete a history item by ID."""
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]

    success = await supabase_client.delete(
        "content_history", item_id, auth_token=auth_token
    )
    if success:
        return {"deleted": item_id}
    else:
        raise HTTPException(status_code=404, detail="Not found")
