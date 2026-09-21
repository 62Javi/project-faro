import uuid
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from fastapi import WebSocket
from app.models.schemas import Order, OrderCreate, OrderItem, OrderStatus, OrderStatusUpdate
from app.core.supabase import db_store

class ConnectionManager:
    def __init__(self):
        # restaurant_id -> list of active websockets
        self.kitchen_connections: Dict[str, List[WebSocket]] = {}
        self.waiter_connections: Dict[str, List[WebSocket]] = {}
        self.customer_connections: Dict[str, List[WebSocket]] = {}

    async def connect_kitchen(self, restaurant_id: str, websocket: WebSocket):
        await websocket.accept()
        if restaurant_id not in self.kitchen_connections:
            self.kitchen_connections[restaurant_id] = []
        self.kitchen_connections[restaurant_id].append(websocket)

    def disconnect_kitchen(self, restaurant_id: str, websocket: WebSocket):
        if restaurant_id in self.kitchen_connections and websocket in self.kitchen_connections[restaurant_id]:
            self.kitchen_connections[restaurant_id].remove(websocket)

    async def connect_waiter(self, restaurant_id: str, websocket: WebSocket):
        await websocket.accept()
        if restaurant_id not in self.waiter_connections:
            self.waiter_connections[restaurant_id] = []
        self.waiter_connections[restaurant_id].append(websocket)

    def disconnect_waiter(self, restaurant_id: str, websocket: WebSocket):
        if restaurant_id in self.waiter_connections and websocket in self.waiter_connections[restaurant_id]:
            self.waiter_connections[restaurant_id].remove(websocket)

    async def broadcast_to_kitchen(self, restaurant_id: str, event_type: str, data: Any):
        if restaurant_id in self.kitchen_connections:
            message = json.dumps({"event": event_type, "data": data}, default=str)
            for ws in list(self.kitchen_connections[restaurant_id]):
                try:
                    await ws.send_text(message)
                except Exception:
                    self.disconnect_kitchen(restaurant_id, ws)

    async def broadcast_to_waiters(self, restaurant_id: str, event_type: str, data: Any):
        if restaurant_id in self.waiter_connections:
            message = json.dumps({"event": event_type, "data": data}, default=str)
            for ws in list(self.waiter_connections[restaurant_id]):
                try:
                    await ws.send_text(message)
                except Exception:
                    self.disconnect_waiter(restaurant_id, ws)

    async def broadcast_order_event(self, restaurant_id: str, event_type: str, order: Order):
        order_dict = order.model_dump()
        await self.broadcast_to_waiters(restaurant_id, event_type, order_dict)
        await self.broadcast_to_kitchen(restaurant_id, event_type, order_dict)

connection_manager = ConnectionManager()

class OrderService:
    async def create_order(self, order_in: OrderCreate) -> Order:
        rest_id = order_in.restaurant_id
        order_id = f"ord_{uuid.uuid4().hex[:8]}"
        
        items: List[OrderItem] = []
        total = 0.0
        
        for item in order_in.items:
            subtotal = item.unit_price * item.quantity
            total += subtotal
            items.append(OrderItem(
                id=f"oi_{uuid.uuid4().hex[:8]}",
                order_id=order_id,
                dish_id=item.dish_id,
                dish_name=item.dish_name,
                unit_price=item.unit_price,
                quantity=item.quantity,
                notes=item.notes,
                subtotal=subtotal
            ))

        new_order = Order(
            id=order_id,
            restaurant_id=rest_id,
            table_number=order_in.table_number,
            status=OrderStatus.PENDIENTE_MOZO,
            items=items,
            total=total,
            customer_notes=order_in.customer_notes,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            waiter_name=None
        )

        if rest_id not in db_store.orders:
            db_store.orders[rest_id] = []
        db_store.orders[rest_id].insert(0, new_order)

        # Broadcast event to Waiters in real time
        await connection_manager.broadcast_to_waiters(rest_id, "ORDER_CREATED", new_order.model_dump())
        return new_order

    async def update_status(self, restaurant_id: str, order_id: str, update: OrderStatusUpdate) -> Optional[Order]:
        orders = db_store.orders.get(restaurant_id, [])
        order = next((o for o in orders if o.id == order_id), None)
        if not order:
            return None

        order.status = update.status
        order.updated_at = datetime.now()
        if update.waiter_name:
            order.waiter_name = update.waiter_name

        # Broadcast appropriate event
        if update.status == OrderStatus.EN_COCINA:
            # Waiter verified and sent to kitchen in live real-time
            await connection_manager.broadcast_to_kitchen(restaurant_id, "ORDER_SENT_TO_KITCHEN", order.model_dump())
            await connection_manager.broadcast_to_waiters(restaurant_id, "ORDER_CONFIRMED", order.model_dump())
        else:
            await connection_manager.broadcast_order_event(restaurant_id, "ORDER_STATUS_CHANGED", order)

        return order

    def get_orders(self, restaurant_id: str, status: Optional[OrderStatus] = None) -> List[Order]:
        orders = db_store.orders.get(restaurant_id, [])
        if status:
            return [o for o in orders if o.status == status]
        return orders

order_service = OrderService()
