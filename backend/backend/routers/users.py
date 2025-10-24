from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..supabase_client import supabase_client

router = APIRouter()


class UserStats(BaseModel):
    id: str
    name: Optional[str]
    email: str
    blogs_generated: int
    captions_generated: int
    tweets_generated: int
    total_generated: int


@router.get("/{user_id}", response_model=UserStats)
async def get_user_stats(user_id: str):
    """Get user profile and generation stats."""
    users = await supabase_client.select("users", filters={"id": user_id})
    
    if not users or len(users) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users[0]
    total = user.get("blogs_generated", 0) + user.get("captions_generated", 0) + user.get("tweets_generated", 0)
    
    return {
        "id": user["id"],
        "name": user.get("name"),
        "email": user["email"],
        "blogs_generated": user.get("blogs_generated", 0),
        "captions_generated": user.get("captions_generated", 0),
        "tweets_generated": user.get("tweets_generated", 0),
        "total_generated": total
    }


@router.get("/email/{email}", response_model=UserStats)
async def get_user_by_email(email: str):
    """Get user profile by email."""
    users = await supabase_client.select("users", filters={"email": email})
    
    if not users or len(users) == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = users[0]
    total = user.get("blogs_generated", 0) + user.get("captions_generated", 0) + user.get("tweets_generated", 0)
    
    return {
        "id": user["id"],
        "name": user.get("name"),
        "email": user["email"],
        "blogs_generated": user.get("blogs_generated", 0),
        "captions_generated": user.get("captions_generated", 0),
        "tweets_generated": user.get("tweets_generated", 0),
        "total_generated": total
    }
