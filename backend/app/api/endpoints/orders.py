from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import Order, OrderCreate, OrderStatus, OrderStatusUpdate
from app.services.order_service import order_service
from app.core.supabase import db_store

router = APIRouter()

@router.post("", response_model=Order)
async def create_new_order(order_in: OrderCreate):
    """
    Called by the customer from their table after interacting with the digital menu and Faro AI.
    The order enters in PENDIENTE_MOZO status to be verified by salon staff.
    """
    return await order_service.create_order(order_in)

@router.get("/{restaurant_id}", response_model=List[Order])
def list_orders(restaurant_id: str, status: Optional[OrderStatus] = None):
    """Lists orders for waiter or kitchen view with live filtering"""
    return order_service.get_orders(restaurant_id, status)

@router.patch("/{restaurant_id}/{order_id}/status", response_model=Order)
async def update_order_status(restaurant_id: str, order_id: str, update: OrderStatusUpdate):
    """
    Updates order lifecycle:
    - Waiter confirms -> EN_COCINA (triggers instant alert in Kitchen Display System)
    - Kitchen starts -> EN_PREPARACION
    - Kitchen completes -> LISTO
    - Waiter serves -> ENTREGADO
    """
    updated = await order_service.update_status(restaurant_id, order_id, update)
    if not updated:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return updated
