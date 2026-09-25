from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, MenuExtractionResult
from app.services.ai_agent import ai_agent_service
from app.services.menu_extractor import menu_extractor_service

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(request: ChatRequest):
    """
    Interactive Sommelier and Dining Assistant powered by Gemini with Function Calling.
    Handles food inquiries, allergen validation, wine pairings, and executes add-to-cart operations.
    """
    try:
        return await ai_agent_service.process_chat(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el asistente IA: {str(e)}")

@router.post("/extract-menu", response_model=MenuExtractionResult)
async def extract_menu_from_upload(
    restaurant_id: str = Form("rest_faro_demo"),
    file: UploadFile = File(...)
):
    """
    Extracts categories, dishes, prices, and allergen tags from an uploaded Menu PDF or Photo using Gemini Multimodal Structured Outputs.
    """
    try:
        extraction, count = await menu_extractor_service.process_menu_upload(restaurant_id, file)
        return extraction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extrayendo carta con IA: {str(e)}")
