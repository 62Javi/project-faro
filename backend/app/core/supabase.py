import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.core.config import settings
from app.models.schemas import Dish, Category, Restaurant, RestaurantTable, Order, OrderItem, OrderStatus, RestaurantMetrics, MetricTopDish, CategoryRevenue

# Attempt to initialize real Supabase Client if keys exist
supabase_client = None
if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase_client: Optional[Client] = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        print("Connected to Supabase PostgreSQL Database.")
    except Exception as e:
        print(f"Notice: Supabase client initialization error: {e}. Using local storage manager.")

# In-Memory Database Store (Used seamlessly for local development and demo turnkey mode)
class InMemoryStore:
    def __init__(self):
        self.restaurants: Dict[str, Restaurant] = {}
        self.categories: Dict[str, List[Category]] = {}
        self.dishes: Dict[str, List[Dish]] = {}
        self.tables: Dict[str, List[RestaurantTable]] = {}
        self.orders: Dict[str, List[Order]] = {}
        self._seed_default_restaurant()

    def _seed_default_restaurant(self):
        rest_id = "rest_faro_demo"
        
        # 1. Restaurant
        restaurant = Restaurant(
            id=rest_id,
            name="Faro - Cocina de Mar & Fuego",
            slug="faro-demo",
            description="Sabores auténticos, pesca fresca del día y carnes maduradas a las brasas.",
            logo_url="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=80",
            owner_id="user_owner_01",
            address="Av. Costanera 1420, La Plata",
            phone="+54 221 555-0199",
            currency="ARS",
            tables_count=10
        )
        self.restaurants[rest_id] = restaurant

        # 2. Categories
        cat_entradas = Category(id="cat_1", restaurant_id=rest_id, name="Entradas & Tapeo", description="Para comenzar a compartir", icon="Utensils", display_order=1, dishes_count=3)
        cat_principales = Category(id="cat_2", restaurant_id=rest_id, name="Platos Principales", description="Nuestras especialidades de mar y parrilla", icon="Flame", display_order=2, dishes_count=4)
        cat_postres = Category(id="cat_3", restaurant_id=rest_id, name="Postres Artesanales", description="El toque dulce de la casa", icon="IceCream", display_order=3, dishes_count=2)
        cat_bebidas = Category(id="cat_4", restaurant_id=rest_id, name="Bebidas & Coctelería", description="Vinos seleccionados y cócteles de autor", icon="GlassWater", display_order=4, dishes_count=3)

        self.categories[rest_id] = [cat_entradas, cat_principales, cat_postres, cat_bebidas]

        # 3. Dishes
        self.dishes[rest_id] = [
            Dish(
                id="dish_101",
                restaurant_id=rest_id,
                name="Rabas Crocantes con Alioli de Lima",
                description="Calamares tiernos rebozados con salsa tártara y alioli cítrico de la casa.",
                price=11500.0,
                category_id="cat_1",
                category_name="Entradas & Tapeo",
                image_url="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["mariscos", "gluten", "huevo"],
                tags=["popular", "favorito"],
                preparation_time_minutes=12
            ),
            Dish(
                id="dish_102",
                restaurant_id=rest_id,
                name="Empanadas de Salmón y Langostinos (2 un)",
                description="Masa casera horneada, relleno suave de salmón rosado y langostinos patagónicos.",
                price=8500.0,
                category_id="cat_1",
                category_name="Entradas & Tapeo",
                image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["pescado", "mariscos", "gluten"],
                tags=["recomendado"],
                preparation_time_minutes=10
            ),
            Dish(
                id="dish_103",
                restaurant_id=rest_id,
                name="Provoleta Faro con Tomates Confitados",
                description="Queso provolone fundido al hierro fundido, orégano fresco, oliva y reducción de aceto balsámico.",
                price=9200.0,
                category_id="cat_1",
                category_name="Entradas & Tapeo",
                image_url="https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["lactosa", "vegetariano", "apto_celiaco"],
                tags=["sin_tacc", "vegetariano"],
                preparation_time_minutes=15
            ),
            Dish(
                id="dish_201",
                restaurant_id=rest_id,
                name="Ojo de Bife con Papas Rústicas y Manteca de Chimichurri",
                description="Corte de 450g a punto sugerido, acompañado de papas crocantes al romero y manteca emulsionada.",
                price=24500.0,
                category_id="cat_2",
                category_name="Platos Principales",
                image_url="https://images.unsplash.com/photo-1558030006-450675393462?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["apto_celiaco"],
                tags=["estrella", "sin_tacc"],
                preparation_time_minutes=25
            ),
            Dish(
                id="dish_202",
                restaurant_id=rest_id,
                name="Salmón Rosado con Risotto de Hongos Silvestres",
                description="Posta sellada a la plancha sobre cremoso risotto de portobellos, gírgolas y parmesano estacionado.",
                price=28900.0,
                category_id="cat_2",
                category_name="Platos Principales",
                image_url="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["pescado", "lactosa", "apto_celiaco"],
                tags=["gourmet", "sin_tacc"],
                preparation_time_minutes=20
            ),
            Dish(
                id="dish_203",
                restaurant_id=rest_id,
                name="Sorrentinos de Calabaza Asada y Mozzarella",
                description="Pasta casera rellena con suave puré de calabaza especiada y mozzarella, en salsa crema de salvia y nueces.",
                price=16800.0,
                category_id="cat_2",
                category_name="Platos Principales",
                image_url="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["gluten", "lactosa", "huevo", "frutos_secos", "vegetariano"],
                tags=["vegetariano", "pasta_casera"],
                preparation_time_minutes=18
            ),
            Dish(
                id="dish_204",
                restaurant_id=rest_id,
                name="Paella Marinera Faro (Para 2 personas)",
                description="Arroz bomba en caldo de azafrán con langostinos, calamares, mejillones y pulpo a la española.",
                price=38000.0,
                category_id="cat_2",
                category_name="Platos Principales",
                image_url="https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["mariscos", "pescado", "apto_celiaco"],
                tags=["para_compartir", "sin_tacc"],
                preparation_time_minutes=30
            ),
            Dish(
                id="dish_301",
                restaurant_id=rest_id,
                name="Volcán de Chocolate Belga con Helado de Vainilla",
                description="Corazón fundido de cacao 70%, servido tibio con bocha de helado artesanal de vainilla Bourbon.",
                price=7800.0,
                category_id="cat_3",
                category_name="Postres Artesanales",
                image_url="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["gluten", "lactosa", "huevo", "vegetariano"],
                tags=["dulce", "clasico"],
                preparation_time_minutes=12
            ),
            Dish(
                id="dish_302",
                restaurant_id=rest_id,
                name="Flan Casero con Dulce de Leche y Crema Chantilly",
                description="Receta tradicional de 8 huevos con caramelo dorado, abundante dulce de leche y crema batida.",
                price=6200.0,
                category_id="cat_3",
                category_name="Postres Artesanales",
                image_url="https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["lactosa", "huevo", "apto_celiaco", "vegetariano"],
                tags=["sin_tacc", "tradicional"],
                preparation_time_minutes=5
            ),
            Dish(
                id="dish_401",
                restaurant_id=rest_id,
                name="Gin Tonic Faro (Botánicos & Pomelo Rosado)",
                description="Gin premium Príncipe de los Apóstoles, tónica aromatizada, gajo de pomelo y romero ahumado.",
                price=7200.0,
                category_id="cat_4",
                category_name="Bebidas & Coctelería",
                image_url="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["vegano", "apto_celiaco"],
                tags=["coctel_autor", "alcohol"],
                preparation_time_minutes=5
            ),
            Dish(
                id="dish_402",
                restaurant_id=rest_id,
                name="Limonada Menta y Jengibre (Jarra 1L)",
                description="Limones frescos exprimidos, menta de huerta, jengibre natural y almíbar liviano.",
                price=5500.0,
                category_id="cat_4",
                category_name="Bebidas & Coctelería",
                image_url="https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["vegano", "apto_celiaco"],
                tags=["sin_alcohol", "refrescante"],
                preparation_time_minutes=5
            ),
            Dish(
                id="dish_403",
                restaurant_id=rest_id,
                name="Copa de Malbec Reserva (Valle de Uco)",
                description="Notas de frutos rojos, ciruela y toque sutil de roble francés. Excelente maridaje para carnes.",
                price=6800.0,
                category_id="cat_4",
                category_name="Bebidas & Coctelería",
                image_url="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=500&auto=format&fit=crop&q=80",
                is_available=True,
                allergens=["vegano", "apto_celiaco"],
                tags=["vino", "alcohol"],
                preparation_time_minutes=3
            ),
        ]

        # 4. Tables
        self.tables[rest_id] = [
            RestaurantTable(id=f"tbl_{i}", restaurant_id=rest_id, table_number=i, status="disponible")
            for i in range(1, 11)
        ]

        # 5. Orders (Sample initial orders for live demo)
        self.orders[rest_id] = [
            Order(
                id="ord_demo_1",
                restaurant_id=rest_id,
                table_number=3,
                status=OrderStatus.EN_COCINA,
                items=[
                    OrderItem(id="oi_1", order_id="ord_demo_1", dish_id="dish_101", dish_name="Rabas Crocantes", unit_price=11500.0, quantity=1, notes="Bien crocantes", subtotal=11500.0),
                    OrderItem(id="oi_2", order_id="ord_demo_1", dish_id="dish_401", dish_name="Gin Tonic Faro", unit_price=7200.0, quantity=2, notes="", subtotal=14400.0),
                ],
                total=25900.0,
                customer_notes="Mesa junto a la ventana",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                waiter_name="Carlos (Mozo)"
            ),
            Order(
                id="ord_demo_2",
                restaurant_id=rest_id,
                table_number=7,
                status=OrderStatus.PENDIENTE_MOZO,
                items=[
                    OrderItem(id="oi_3", order_id="ord_demo_2", dish_id="dish_201", dish_name="Ojo de Bife", unit_price=24500.0, quantity=2, notes="Punto jugoso", subtotal=49000.0),
                    OrderItem(id="oi_4", order_id="ord_demo_2", dish_id="dish_403", dish_name="Copa de Malbec Reserva", unit_price=6800.0, quantity=2, notes="", subtotal=13600.0),
                ],
                total=62600.0,
                customer_notes="Cliente consulta si las papas son sin TACC",
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
        ]

db_store = InMemoryStore()
