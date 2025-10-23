from datetime import datetime
from typing import List, Literal, Optional

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from .. import db

router = APIRouter()


class HistoryItem(BaseModel):
    id: str
    user_id: str
    type: Literal["blog", "caption", "tweet"]
    input_text: Optional[str]
    generated_text: Optional[str]
    created_at: datetime


@router.get("/", response_model=List[HistoryItem])
async def list_history(type: Optional[Literal["blog", "caption", "tweet"]] = Query(None)):
    """List content history, optionally filtered by type."""
    query = "select * from public.content_history order by created_at desc"
    params = {}
    if type:
        query = "select * from public.content_history where type = :type order by created_at desc"
        params = {"type": type}
    rows = await db.db.fetch_all(query=query, values=params)
    return rows


@router.delete("/{item_id}")
async def delete_history(item_id: str):
    """Delete a history item by ID."""
    query = "delete from public.content_history where id = :id returning id"
    row = await db.db.fetch_one(query=query, values={"id": item_id})
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": str(row[0])}
