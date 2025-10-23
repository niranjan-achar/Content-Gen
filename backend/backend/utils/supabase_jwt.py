import os

import requests
from jose import jwk, jwt
from jose.exceptions import JWTError


def validate_supabase_jwt(token: str) -> dict:
    """Validate Supabase JWT using JWKS.
    
    This is a minimal placeholder implementation.
    For production, cache the JWKS and validate audience/issuer properly.
    """
    jwks_url = os.getenv("SUPABASE_JWKS_URL")
    if not jwks_url:
        # For dev/testing without Supabase
        return {"sub": "test-user-id", "email": "test@example.com"}
    
    try:
        # Fetch JWKS
        resp = requests.get(jwks_url, timeout=5)
        resp.raise_for_status()
        jwks = resp.json()
        
        # Decode header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        # Find matching key
        key = None
        for k in jwks.get("keys", []):
            if k.get("kid") == kid:
                key = k
                break
        
        if not key:
            raise RuntimeError("No matching key found in JWKS")
        
        # Verify token
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            options={"verify_aud": False}  # Adjust based on your needs
        )
        return payload
        
    except JWTError as e:
        raise RuntimeError(f"Invalid token: {e}") from e
    except Exception as e:
        raise RuntimeError(f"Token validation failed: {e}") from e
