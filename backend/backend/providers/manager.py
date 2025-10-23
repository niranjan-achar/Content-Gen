import os
from typing import Optional

import httpx


class BaseProvider:
    """Base class for content generation providers."""
    async def generate(self, type: str, topic: str) -> str:
        raise NotImplementedError()


class LocalProvider(BaseProvider):
    """Simple local provider for development."""
    async def generate(self, type: str, topic: str) -> str:
        if type == "blog":
            return f"""# Blog Post: {topic}

This is a sample blog post generated locally about {topic}.

## Introduction
{topic} is an interesting subject that deserves exploration.

## Main Content
Here's some generated content about {topic}. In a production environment, 
this would be replaced by AI-generated content from services like Groq or OpenAI.

## Conclusion
Thank you for reading this blog about {topic}!
"""
        elif type == "caption":
            return f"✨ {topic} - Capturing moments that matter. #contentgen #{topic.replace(' ', '').lower()}"
        else:  # tweet
            return f"🚀 Excited to share insights about {topic}! Check it out. #AI #ContentGen"


class GroqProvider(BaseProvider):
    """Groq AI provider for content generation using Llama models."""
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.groq.com/openai/v1"
        
    async def generate(self, type: str, topic: str) -> str:
        """Generate content using Groq's API."""
        if not self.api_key or self.api_key == "your-groq-api-key":
            print("Warning: No valid Groq API key found, using local provider")
            local = LocalProvider()
            return await local.generate(type, topic)
        
        # Define prompts based on content type
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
Must be under 280 characters."""
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a professional content writer. Create engaging, high-quality content based on the user's request."
                            },
                            {
                                "role": "user",
                                "content": prompts.get(type, prompts["blog"])
                            }
                        ],
                        "temperature": 0.7,
                        "max_tokens": 2000
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"].strip()
                else:
                    print(f"Groq API error: {response.status_code} - {response.text}")
                    # Fallback to local provider
                    local = LocalProvider()
                    return await local.generate(type, topic)
                    
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            # Fallback to local provider
            local = LocalProvider()
            return await local.generate(type, topic)


class ProviderManager:
    """Manages content generation providers."""
    def __init__(self):
        self._provider: Optional[BaseProvider] = None

    def get_provider(self) -> BaseProvider:
        if self._provider is None:
            provider_type = os.getenv("CONTENT_PROVIDER", "local")
            if provider_type == "groq":
                api_key = os.getenv("GROQ_API_KEY")
                if not api_key:
                    raise RuntimeError("GROQ_API_KEY not set")
                self._provider = GroqProvider(api_key)
            else:
                self._provider = LocalProvider()
        return self._provider


provider_manager = ProviderManager()
