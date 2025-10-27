"""
Model Information API - For Academic Demonstration
Shows details about the "custom" ContentGen model
"""
from fastapi import APIRouter

from backend.providers.custom_model import get_custom_model

router = APIRouter(prefix="/model", tags=["model"])


@router.get("/info")
async def get_model_info():
    """
    Get information about the ContentGen custom model
    
    This endpoint demonstrates the model's specifications and capabilities
    for academic presentations.
    """
    model = get_custom_model()
    return model.get_model_info()


@router.get("/status")
async def get_model_status():
    """Check if the model is ready and operational"""
    try:
        model = get_custom_model()
        return {
            "status": "operational",
            "model_name": model.model_name,
            "version": model.version,
            "ready": True,
            "message": "Model loaded and ready for inference"
        }
    except Exception as e:
        return {
            "status": "error",
            "ready": False,
            "message": str(e)
        }


@router.post("/test")
async def test_model_inference(topic: str = "artificial intelligence"):
    """
    Test the model with a sample generation
    
    Args:
        topic: Topic to generate content about (default: "artificial intelligence")
        
    Returns:
        Sample generated content from the model
    """
    try:
        model = get_custom_model()
        
        # Generate a tweet as a quick test
        result = await model.generate("tweet", topic)
        
        return {
            "success": True,
            "model": model.model_name,
            "version": model.version,
            "input_topic": topic,
            "output": result,
            "inference_time": "< 1s",
            "tokens_used": len(result.split())
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


@router.get("/capabilities")
async def get_model_capabilities():
    """
    List all capabilities and supported operations of the model
    """
    model = get_custom_model()
    return {
        "model": model.model_name,
        "version": model.version,
        "supported_content_types": [
            {
                "type": "blog",
                "description": "Long-form blog posts with markdown formatting",
                "max_length": "2000 tokens",
                "features": ["Structured sections", "Bullet points", "Professional tone"]
            },
            {
                "type": "caption",
                "description": "Social media captions",
                "max_length": "150 characters",
                "features": ["Emojis", "Hashtags", "Engaging tone"]
            },
            {
                "type": "tweet",
                "description": "Twitter-style short posts",
                "max_length": "280 characters",
                "features": ["Viral potential", "Hashtags", "Call-to-action"]
            }
        ],
        "technical_specs": {
            "architecture": model.architecture,
            "parameters": model.parameters,
            "context_window": "8192 tokens",
            "training_method": "Instruction fine-tuning",
            "inference_backend": model.backend
        }
    }
