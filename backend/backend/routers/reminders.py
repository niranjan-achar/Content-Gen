from datetime import date as DateType
from datetime import datetime
from datetime import time as TimeType
from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .. import db

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
async def list_reminders():
    """List all reminders."""
    rows = await db.db.fetch_all(query="select * from public.reminders order by created_at desc")
    return rows


@router.post("/")
async def create_reminder(r: Reminder):
    """Create a new reminder."""
    query = """
        insert into public.reminders (user_id, title, topic, date, time, daily, repeat_days) 
        values (:user_id, :title, :topic, :date, :time, :daily, :repeat_days) 
        returning id
    """
    values = {
        "user_id": r.user_id or '00000000-0000-0000-0000-000000000000',
        "title": r.title,
        "topic": r.topic,
        "date": r.date,
        "time": r.time,
        "daily": r.daily,
        "repeat_days": r.repeat_days,
    }
    row = await db.db.fetch_one(query=query, values=values)
    return {"id": str(row[0])}


@router.put("/{id}")
async def update_reminder(id: str, r: Reminder):
    """Update an existing reminder."""
    query = """
        update public.reminders 
        set title = :title, topic = :topic, date = :date, time = :time, daily = :daily, repeat_days = :repeat_days 
        where id = :id 
        returning id
    """
    values = {
        "id": id,
        "title": r.title,
        "topic": r.topic,
        "date": r.date,
        "time": r.time,
        "daily": r.daily,
        "repeat_days": r.repeat_days
    }
    row = await db.db.fetch_one(query=query, values=values)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return {"id": str(row[0])}


@router.delete("/{id}")
async def delete_reminder(id: str):
    """Delete a reminder by ID."""
    query = "delete from public.reminders where id = :id returning id"
    row = await db.db.fetch_one(query=query, values={"id": id})
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": str(row[0])}
