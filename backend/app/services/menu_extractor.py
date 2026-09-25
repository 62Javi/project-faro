import io
import uuid
from typing import Tuple, List
from fastapi import UploadFile
from app.models.schemas import MenuExtractionResult, Category, Dish
from app.core.gemini import gemini_service
from app.core.supabase import db_store

class MenuExtractorService:
    async def process_menu_upload(self, restaurant_id: str, file: UploadFile) -> Tuple[MenuExtractionResult, int]:
        contents = await file.read()
        mime_type = file.content_type or "application/octet-stream"
        
        # 1. Process with Gemini Multimodal / Structured Outputs
        extraction = await gemini_service.extract_menu_from_file(contents, mime_type)
        
        # 2. Persist extracted categories and dishes into the restaurant database
        existing_categories = db_store.categories.get(restaurant_id, [])
        cat_map = {c.name.lower(): c for c in existing_categories}
        
        created_count = 0
        
        # Add new categories if not exist
        for ext_cat in extraction.categories:
            cat_key = ext_cat.name.lower()
            if cat_key not in cat_map:
                new_cat = Category(
                    id=f"cat_{uuid.uuid4().hex[:8]}",
                    restaurant_id=restaurant_id,
                    name=ext_cat.name,
                    description=ext_cat.description or "",
                    icon="Utensils",
                    display_order=len(existing_categories) + 1,
                    dishes_count=0
                )
                existing_categories.append(new_cat)
                cat_map[cat_key] = new_cat
                
        db_store.categories[restaurant_id] = existing_categories
        
        # Add extracted dishes
        existing_dishes = db_store.dishes.get(restaurant_id, [])
        for ext_dish in extraction.dishes:
            cat_key = ext_dish.category_name.lower()
            target_cat = cat_map.get(cat_key)
            if not target_cat:
                target_cat = Category(
                    id=f"cat_{uuid.uuid4().hex[:8]}",
                    restaurant_id=restaurant_id,
                    name=ext_dish.category_name,
                    description="",
                    icon="Utensils",
                    display_order=len(existing_categories) + 1,
                    dishes_count=0
                )
                existing_categories.append(target_cat)
                cat_map[cat_key] = target_cat

            target_cat.dishes_count += 1
            new_dish = Dish(
                id=f"dish_{uuid.uuid4().hex[:8]}",
                restaurant_id=restaurant_id,
                name=ext_dish.name,
                description=ext_dish.description,
                price=ext_dish.price,
                category_id=target_cat.id,
                category_name=target_cat.name,
                image_url="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=ext_dish.allergens,
                tags=ext_dish.tags,
                preparation_time_minutes=15
            )
            existing_dishes.append(new_dish)
            created_count += 1
            
        db_store.dishes[restaurant_id] = existing_dishes
        return extraction, created_count

menu_extractor_service = MenuExtractorService()
