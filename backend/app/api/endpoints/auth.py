from typing import Optional
from fastapi import APIRouter, Header, HTTPException
from app.models.schemas import UserRole

router = APIRouter()

@router.get("/me")
def get_current_user_profile(
    authorization: Optional[str] = Header(None),
    x_user_role: Optional[str] = Header("dueño")
):
    """
    Clerk Multi-tenant authentication helper.
    Returns the active user profile, tenant restaurant ID, and role.
    """
    return {
        "user_id": "user_faro_admin_01",
        "email": "admin@faro-restaurant.com",
        "restaurant_id": "rest_faro_demo",
        "restaurant_name": "Faro - Cocina de Mar & Fuego",
        "role": x_user_role or "dueño",
        "clerk_configured": bool(authorization)
    }
