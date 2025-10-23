from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..utils.supabase_jwt import validate_supabase_jwt

router = APIRouter()


class Session(BaseModel):
    access_token: str
    token_type: str


@router.post("/validate")
def validate(session: Session):
    """Validate Supabase JWT and return user info."""
    try:
        payload = validate_supabase_jwt(session.access_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    return payload
