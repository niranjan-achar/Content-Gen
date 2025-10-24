from datetime import date as DateType
from datetime import datetime
from datetime import time as TimeType
from typing import List, Optional
from uuid import uuid4

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from ..supabase_client import supabase_client

router = APIRouter()


class Reminder(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    title: str
    topic: Optional[str] = None
    date: Optional[DateType] = None
    time: Optional[TimeType] = None
    daily: bool = False
    repeat_days: Optional[List[int]] = None
    created_at: Optional[datetime] = None


@router.get("/")
async def list_reminders(authorization: str = Header(None)):
    """List all reminders."""
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]

    reminders = await supabase_client.select(
        "reminders", order_by="created_at.desc", auth_token=auth_token
    )
    return reminders


@router.post("/")
async def create_reminder(r: Reminder, authorization: str = Header(None)):
    """Create a new reminder."""
    data = {
        "user_id": r.user_id or "00000000-0000-0000-0000-000000000000",
        "title": r.title,
        "topic": r.topic,
        "date": str(r.date) if r.date else None,
        "time": str(r.time) if r.time else None,
        "daily": r.daily,
        "repeat_days": r.repeat_days,
    }
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]

    result = await supabase_client.insert("reminders", data, auth_token=auth_token)
    if result:
        return {"id": result["id"]}
    else:
        raise HTTPException(status_code=500, detail="Failed to create reminder")


@router.put("/{id}")
async def update_reminder(id: str, r: Reminder, authorization: str = Header(None)):
    """Update an existing reminder."""
    data = {
        "title": r.title,
        "topic": r.topic,
        "date": str(r.date) if r.date else None,
        "time": str(r.time) if r.time else None,
        "daily": r.daily,
        "repeat_days": r.repeat_days,
    }
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]

    result = await supabase_client.update("reminders", id, data, auth_token=auth_token)
    if result:
        return {"id": result["id"]}
    else:
        raise HTTPException(status_code=500, detail="Failed to update reminder")


@router.delete("/{id}")
async def delete_reminder(id: str, authorization: str = Header(None)):
    """Delete a reminder by ID."""
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]

    success = await supabase_client.delete("reminders", id, auth_token=auth_token)
    if success:
        return {"deleted": id}
    else:
        raise HTTPException(status_code=404, detail="Not found")
