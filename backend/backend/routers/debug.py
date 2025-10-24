"""Debug endpoints to help troubleshoot issues"""
from fastapi import APIRouter, Header
from ..supabase_client import supabase_client

router = APIRouter()


@router.get("/auth-test")
async def test_auth(authorization: str = Header(None)):
    """Test if auth header is being passed correctly"""
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]
    
    return {
        "authorization_header_present": bool(authorization),
        "authorization_header_value": authorization[:50] + "..." if authorization else None,
        "extracted_token_length": len(auth_token) if auth_token else 0,
        "service_role_key_present": bool(supabase_client.service_role),
    }


@router.get("/users-count")
async def count_users():
    """Count users in public.users table"""
    try:
        users = await supabase_client.select("users")
        return {
            "count": len(users),
            "users": [{"id": u.get("id"), "email": u.get("email")} for u in users],
        }
    except Exception as e:
        return {"error": str(e)}


@router.post("/test-insert")
async def test_insert(authorization: str = Header(None)):
    """Test inserting a dummy user (for debugging)"""
    import uuid
    
    auth_token = None
    if authorization and authorization.lower().startswith("bearer "):
        auth_token = authorization.split(None, 1)[1]
    
    test_user_id = str(uuid.uuid4())
    data = {
        "id": test_user_id,
        "email": f"test-{test_user_id[:8]}@example.com",
        "name": "Test User",
    }
    
    result = await supabase_client.insert("users", data, auth_token=auth_token)
    
    return {
        "success": bool(result),
        "result": result,
        "used_service_role": bool(supabase_client.service_role and not auth_token),
    }
