export type OrderStatus = 
  | 'pendiente_mozo'
  | 'en_cocina'
  | 'en_preparacion'
  | 'listo'
  | 'entregado'
  | 'cancelado';

export interface Dish {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  category_name?: string;
  image_url?: string;
  is_available: boolean;
  allergens: string[];
  tags: string[];
  preparation_time_minutes?: number;
}

export interface Category {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  icon?: string;
  display_order: number;
  dishes_count?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  address?: string;
  phone?: string;
  currency: string;
  tables_count: number;
}

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  table_number: number;
  status: string;
  qr_code_url?: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  dish_id: string;
  dish_name: string;
  unit_price: number;
  quantity: number;
  notes?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_number: number;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  customer_notes?: string;
  created_at: string;
  updated_at: string;
  waiter_name?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ActionItem {
  action_type: 'ADD_TO_CART' | 'HIGHLIGHT_DISH' | 'FILTER_CATEGORY';
  payload: Record<string, any>;
}

export interface ChatResponse {
  reply: string;
  actions: ActionItem[];
  suggested_dishes: Dish[];
}

export interface MetricTopDish {
  dish_id: string;
  dish_name: string;
  category_name: string;
  units_sold: number;
  revenue: number;
}

export interface CategoryRevenue {
  category_name: string;
  percentage: number;
  total: number;
}

export interface RestaurantMetrics {
  total_sales_today: number;
  total_orders_today: number;
  pending_orders: number;
  average_ticket: number;
  top_dishes: MetricTopDish[];
  revenue_by_category: CategoryRevenue[];
  hourly_orders: { hour: string; orders: number; sales: number }[];
}

export interface ExtractedDish {
  name: string;
  description: string;
  price: number;
  category_name: string;
  allergens: string[];
  tags: string[];
}

export interface ExtractedCategory {
  name: string;
  description?: string;
}

export interface MenuExtractionResult {
  restaurant_name?: string;
  categories: ExtractedCategory[];
  dishes: ExtractedDish[];
}
