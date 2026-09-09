from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime

class Allergen(str, Enum):
    GLUTEN = "gluten"
    LACTOSE = "lactosa"
    NUTS = "frutos_secos"
    EGGS = "huevo"
    FISH = "pescado"
    SHELLFISH = "mariscos"
    SOY = "soja"
    CELIAC_SAFE = "apto_celiaco"
    VEGAN = "vegano"
    VEGETARIAN = "vegetariano"

class OrderStatus(str, Enum):
    PENDIENTE_MOZO = "pendiente_mozo"
    EN_COCINA = "en_cocina"
    EN_PREPARACION = "en_preparacion"
    LISTO = "listo"
    ENTREGADO = "entregado"
    CANCELADO = "cancelado"

class UserRole(str, Enum):
    OWNER = "dueño"
    WAITER = "mozo"
    KITCHEN = "cocina"
    CUSTOMER = "cliente"

# ----------------- Dish & Category Schemas -----------------

class DishBase(BaseModel):
    name: str
    description: Optional[str] = ""
    price: float
    category_id: str
    category_name: Optional[str] = ""
    image_url: Optional[str] = None
    is_available: bool = True
    allergens: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    preparation_time_minutes: Optional[int] = 15

class DishCreate(DishBase):
    pass

class DishUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[str] = None
    category_name: Optional[str] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    allergens: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    preparation_time_minutes: Optional[int] = None

class Dish(DishBase):
    id: str
    restaurant_id: str
    created_at: Optional[datetime] = None

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = ""
    icon: Optional[str] = "Utensils"
    display_order: int = 0

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: str
    restaurant_id: str
    dishes_count: int = 0

class Restaurant(BaseModel):
    id: str
    name: str
    slug: str
    description: Optional[str] = ""
    logo_url: Optional[str] = None
    owner_id: str
    address: Optional[str] = ""
    phone: Optional[str] = ""
    currency: str = "ARS"
    tables_count: int = 10

class RestaurantTable(BaseModel):
    id: str
    restaurant_id: str
    table_number: int
    qr_code_url: Optional[str] = None
    status: str = "disponible" # disponible, ocupada, esperando_atencion

# ----------------- Order Schemas -----------------

class OrderItemCreate(BaseModel):
    dish_id: str
    dish_name: str
    unit_price: float
    quantity: int = 1
    notes: Optional[str] = ""

class OrderItem(OrderItemCreate):
    id: str
    order_id: str
    subtotal: float

class OrderCreate(BaseModel):
    restaurant_id: str
    table_number: int
    items: List[OrderItemCreate]
    customer_notes: Optional[str] = ""

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    waiter_id: Optional[str] = None
    waiter_name: Optional[str] = None

class Order(BaseModel):
    id: str
    restaurant_id: str
    table_number: int
    status: OrderStatus
    items: List[OrderItem]
    total: float
    customer_notes: Optional[str] = ""
    created_at: datetime
    updated_at: datetime
    waiter_name: Optional[str] = None

# ----------------- AI Structured Outputs (Menu OCR/PDF Extraction) -----------------

class ExtractedDish(BaseModel):
    name: str = Field(description="Nombre del plato o bebida")
    description: str = Field(description="Descripción o ingredientes del plato", default="")
    price: float = Field(description="Precio numérico del plato")
    category_name: str = Field(description="Categoría a la que pertenece el plato, ej: Entradas, Principales, Postres, Bebidas, etc.")
    allergens: List[str] = Field(description="Lista de alérgenos o etiquetas detectadas (ej: sin_tacc, gluten, lactosa, vegano, vegetariano)", default_factory=list)
    tags: List[str] = Field(description="Etiquetas adicionales como 'sugerencia_del_chef', 'picante', 'sin_alcohol'", default_factory=list)

class ExtractedCategory(BaseModel):
    name: str = Field(description="Nombre de la categoría")
    description: Optional[str] = Field(description="Breve descripción si existe", default="")

class MenuExtractionResult(BaseModel):
    restaurant_name: Optional[str] = Field(description="Nombre del restaurante si fue detectado en la carta", default=None)
    categories: List[ExtractedCategory] = Field(description="Lista de categorías detectadas en la carta")
    dishes: List[ExtractedDish] = Field(description="Lista completa de platos y bebidas extraídos con precios y categorías")

# ----------------- AI Chat & Function Calling Schemas -----------------

class ChatMessage(BaseModel):
    role: str # "user", "assistant", "system", "tool"
    content: str
    name: Optional[str] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None

class ActionItem(BaseModel):
    action_type: str # "ADD_TO_CART", "HIGHLIGHT_DISH", "FILTER_CATEGORY"
    payload: Dict[str, Any]

class ChatRequest(BaseModel):
    restaurant_id: str
    table_number: Optional[int] = None
    messages: List[ChatMessage]
    current_cart: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    reply: str
    actions: List[ActionItem] = Field(default_factory=list)
    suggested_dishes: List[Dish] = Field(default_factory=list)

# ----------------- Analytics & Metrics -----------------

class MetricTopDish(BaseModel):
    dish_id: str
    dish_name: str
    category_name: str
    units_sold: int
    revenue: float

class CategoryRevenue(BaseModel):
    category_name: str
    percentage: float
    total: float

class RestaurantMetrics(BaseModel):
    total_sales_today: float
    total_orders_today: int
    pending_orders: int
    average_ticket: float
    top_dishes: List[MetricTopDish]
    revenue_by_category: List[CategoryRevenue]
    hourly_orders: List[Dict[str, Any]]
