import io
import qrcode
from typing import List
from fastapi import APIRouter, Response, HTTPException
from app.models.schemas import RestaurantTable
from app.core.supabase import db_store

router = APIRouter()

@router.get("/{restaurant_id}", response_model=List[RestaurantTable])
def get_tables(restaurant_id: str):
    tables = db_store.tables.get(restaurant_id, [])
    if not tables:
        tables = db_store.tables.get("rest_faro_demo", [])
    return tables

@router.get("/{restaurant_id}/{table_number}/qr")
def get_table_qr_code(restaurant_id: str, table_number: int, base_url: str = "http://localhost:3000"):
    """
    Generates dynamic QR image pointing directly to table's interactive menu:
    URL: {base_url}/menu/{restaurant_id}?mesa={table_number}
    """
    target_url = f"{base_url}/menu/{restaurant_id}?mesa={table_number}"
    
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(target_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#bc4119", back_color="white")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    
    return Response(content=buf.getvalue(), media_type="image/png")
