from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.order_service import connection_manager

router = APIRouter()

@router.websocket("/ws/kitchen/{restaurant_id}")
async def websocket_kitchen(websocket: WebSocket, restaurant_id: str):
    await connection_manager.connect_kitchen(restaurant_id, websocket)
    try:
        while True:
            # Keep-alive loop or incoming kitchen heartbeats
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect_kitchen(restaurant_id, websocket)
    except Exception:
        connection_manager.disconnect_kitchen(restaurant_id, websocket)

@router.websocket("/ws/waiter/{restaurant_id}")
async def websocket_waiter(websocket: WebSocket, restaurant_id: str):
    await connection_manager.connect_waiter(restaurant_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect_waiter(restaurant_id, websocket)
    except Exception:
        connection_manager.disconnect_waiter(restaurant_id, websocket)
