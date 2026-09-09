from fastapi import APIRouter
from app.api.endpoints import ai, menu, orders, tables, metrics, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth & Tenants"])
api_router.include_router(ai.router, prefix="/ai", tags=["Google Gemini AI"])
api_router.include_router(menu.router, prefix="/restaurants", tags=["Menu & Dishes"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(tables.router, prefix="/tables", tags=["Tables & QRs"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["Metrics & Analytics"])
