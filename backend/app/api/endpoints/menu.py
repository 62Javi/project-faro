import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import Dish, DishCreate, DishUpdate, Category, CategoryCreate, Restaurant
from app.core.supabase import db_store

router = APIRouter()

@router.get("/{restaurant_id}", response_model=dict)
def get_restaurant_and_menu(restaurant_id: str):
    """Returns restaurant profile, categories, and all active dishes"""
    restaurant = db_store.restaurants.get(restaurant_id)
    if not restaurant:
        # Auto-create or return default demo
        restaurant = db_store.restaurants.get("rest_faro_demo")
        restaurant_id = "rest_faro_demo"

    categories = db_store.categories.get(restaurant_id, [])
    dishes = db_store.dishes.get(restaurant_id, [])
    
    return {
        "restaurant": restaurant,
        "categories": categories,
        "dishes": dishes
    }

@router.get("/{restaurant_id}/dishes", response_model=List[Dish])
def get_dishes(restaurant_id: str, category_id: Optional[str] = None):
    dishes = db_store.dishes.get(restaurant_id, [])
    if category_id:
        dishes = [d for d in dishes if d.category_id == category_id]
    return dishes

@router.post("/{restaurant_id}/dishes", response_model=Dish)
def create_dish(restaurant_id: str, dish_in: DishCreate):
    dishes = db_store.dishes.setdefault(restaurant_id, [])
    new_dish = Dish(
        id=f"dish_{uuid.uuid4().hex[:8]}",
        restaurant_id=restaurant_id,
        name=dish_in.name,
        description=dish_in.description or "",
        price=dish_in.price,
        category_id=dish_in.category_id,
        category_name=dish_in.category_name or "General",
        image_url=dish_in.image_url or "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
        is_available=dish_in.is_available,
        allergens=dish_in.allergens,
        tags=dish_in.tags,
        preparation_time_minutes=dish_in.preparation_time_minutes or 15
    )
    dishes.append(new_dish)
    return new_dish

@router.put("/{restaurant_id}/dishes/{dish_id}", response_model=Dish)
def update_dish(restaurant_id: str, dish_id: str, dish_in: DishUpdate):
    dishes = db_store.dishes.get(restaurant_id, [])
    dish = next((d for d in dishes if d.id == dish_id), None)
    if not dish:
        raise HTTPException(status_code=404, detail="Plato no encontrado")
    
    update_data = dish_in.model_dump(exclude_unset=True)
    for k, v in update_data.items():
        setattr(dish, k, v)
    
    return dish

@router.delete("/{restaurant_id}/dishes/{dish_id}")
def delete_dish(restaurant_id: str, dish_id: str):
    dishes = db_store.dishes.get(restaurant_id, [])
    db_store.dishes[restaurant_id] = [d for d in dishes if d.id != dish_id]
    return {"success": True, "message": "Plato eliminado correctamente"}

@router.post("/{restaurant_id}/categories", response_model=Category)
def create_category(restaurant_id: str, cat_in: CategoryCreate):
    cats = db_store.categories.setdefault(restaurant_id, [])
    new_cat = Category(
        id=f"cat_{uuid.uuid4().hex[:8]}",
        restaurant_id=restaurant_id,
        name=cat_in.name,
        description=cat_in.description or "",
        icon=cat_in.icon or "Utensils",
        display_order=cat_in.display_order,
        dishes_count=0
    )
    cats.append(new_cat)
    return new_cat
