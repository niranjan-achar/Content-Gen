import os
import uuid
from datetime import datetime
from typing import Literal

import httpx
from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from ..providers import provider_manager
from ..supabase_client import supabase_client

router = APIRouter()


class GenerateRequest(BaseModel):
    type: Literal["blog", "caption", "tweet"]
    topic: str
    user_id: str = "anonymous"
    model: Literal["groq", "custom"] = "groq"  # Add model selection


class GenerateResponse(BaseModel):
    generated_text: str


async def generate_with_custom_ai(content_type: str, topic: str) -> str:
    """Generate content using Custom AI (Llama-3.2-3B based model)"""
    api_key = os.getenv("GROQ_API_KEY")

    print(f"🤖 Custom AI Request:")
    print(f"   Model: llama-3.2-3b-preview")
    print(f"   Type: {content_type}")
    print(f"   Topic: {topic}")

    prompts = {
        "blog": f"""Write a detailed, well-structured blog post about "{topic}". 
Include:
- An engaging title with # markdown
- Introduction section with ## markdown
- 2-3 main content sections with ## markdown headings
- Bullet points or lists where appropriate
- A conclusion
Keep it professional and informative. Use markdown formatting.""",
        "caption": f"""Create an engaging social media caption about "{topic}".
Make it catchy, include relevant emojis, and 2-3 relevant hashtags.
Keep it under 150 characters.""",
        "tweet": f"""Write a compelling tweet about "{topic}".
Make it engaging, use emojis, include 2-3 hashtags.
Must be under 280 characters.""",
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # Gemma models don't support system role, use only user role
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama-3.2-3b-preview",
                    "messages": [
                        {
                            "role": "user",
                            "content": f"You are a professional content writer. {prompts.get(content_type, prompts['blog'])}",
                        }
                    ],
                    "temperature": 0.7,
                    "max_tokens": 2000,
                },
            )

            print(f"   Response Status: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                result = data["choices"][0]["message"]["content"].strip()
                print(f"   ✅ Custom AI Success! Generated {len(result)} characters")
                return result
            else:
                error_detail = response.text
                print(f"   ❌ Custom AI Error: {response.status_code}")
                print(f"   Error details: {error_detail}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Custom AI error: {response.status_code} - {error_detail}",
                )
    except httpx.HTTPError as e:
        print(f"   ❌ HTTP Error: {e}")
        raise HTTPException(status_code=500, detail=f"Custom AI HTTP error: {str(e)}")
    except Exception as e:
        print(f"   ❌ Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail=f"Custom AI error: {str(e)}")


@router.post("/", response_model=GenerateResponse)
async def generate(req: GenerateRequest, authorization: str = Header(None)):
    """Generate content using the selected provider (Groq or Custom AI)."""

    # Debug logging
    print(f"\n{'='*60}")
    print(f"📥 Generate Request Received:")
    print(f"   Model: {req.model}")
    print(f"   Type: {req.type}")
    print(f"   Topic: {req.topic}")
    print(f"   GROQ_API_KEY exists: {bool(os.getenv('GROQ_API_KEY'))}")
    print(f"   CONTENT_PROVIDER: {os.getenv('CONTENT_PROVIDER')}")
    print(f"{'='*60}\n")

    # Select provider based on user's choice
    if req.model == "custom":
        # Use Custom AI model (Gemma-2-2B-it based)
        print(f"🤖 Using Custom AI model (Gemma-2-9B) for {req.type} generation")
        text = await generate_with_custom_ai(req.type, req.topic)
    else:
        # Use default Groq provider
        print(f"⚡ Using Groq API (Llama 3.3 70B) for {req.type} generation")
        prov = provider_manager.get_provider()
        if prov is None:
            raise HTTPException(status_code=500, detail="No provider configured")
        text = await prov.generate(req.type, req.topic)

    # Don't auto-save - user will manually save via the history endpoint
    return {"generated_text": text}
