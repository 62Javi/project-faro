import { Dish, Category, Restaurant, RestaurantTable, Order, OrderStatus, RestaurantMetrics, ChatMessage, ChatResponse, MenuExtractionResult } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = {
  // Restaurant & Menu
  async getRestaurantMenu(restaurantId: string = 'rest_faro_demo'): Promise<{ restaurant: Restaurant; categories: Category[]; dishes: Dish[] }> {
    const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al cargar la carta');
    return res.json();
  },

  async getDishes(restaurantId: string = 'rest_faro_demo', categoryId?: string): Promise<Dish[]> {
    const url = new URL(`${API_BASE_URL}/restaurants/${restaurantId}/dishes`);
    if (categoryId) url.searchParams.append('category_id', categoryId);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener platos');
    return res.json();
  },

  async createDish(restaurantId: string, dishData: Partial<Dish>): Promise<Dish> {
    const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/dishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dishData),
    });
    if (!res.ok) throw new Error('Error al crear plato');
    return res.json();
  },

  async updateDish(restaurantId: string, dishId: string, dishData: Partial<Dish>): Promise<Dish> {
    const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/dishes/${dishId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dishData),
    });
    if (!res.ok) throw new Error('Error al actualizar plato');
    return res.json();
  },

  async deleteDish(restaurantId: string, dishId: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/dishes/${dishId}`, {
      method: 'DELETE',
    });
    return res.ok;
  },

  // Orders
  async createOrder(orderData: {
    restaurant_id: string;
    table_number: number;
    items: { dish_id: string; dish_name: string; unit_price: number; quantity: number; notes?: string }[];
    customer_notes?: string;
  }): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Error al enviar el pedido');
    return res.json();
  },

  async getOrders(restaurantId: string = 'rest_faro_demo', status?: OrderStatus): Promise<Order[]> {
    const url = new URL(`${API_BASE_URL}/orders/${restaurantId}`);
    if (status) url.searchParams.append('status', status);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener pedidos');
    return res.json();
  },

  async updateOrderStatus(
    restaurantId: string,
    orderId: string,
    status: OrderStatus,
    waiterName?: string
  ): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders/${restaurantId}/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, waiter_name: waiterName }),
    });
    if (!res.ok) throw new Error('Error al actualizar estado del pedido');
    return res.json();
  },

  // Tables
  async getTables(restaurantId: string = 'rest_faro_demo'): Promise<RestaurantTable[]> {
    const res = await fetch(`${API_BASE_URL}/tables/${restaurantId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener mesas');
    return res.json();
  },

  // Metrics
  async getMetrics(restaurantId: string = 'rest_faro_demo'): Promise<RestaurantMetrics> {
    const res = await fetch(`${API_BASE_URL}/metrics/${restaurantId}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Error al obtener métricas');
    return res.json();
  },

  // AI Function Calling Chat
  async chatWithAi(
    messages: ChatMessage[],
    restaurantId: string = 'rest_faro_demo',
    tableNumber?: number,
    currentCart?: any[]
  ): Promise<ChatResponse> {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        restaurant_id: restaurantId,
        table_number: tableNumber,
        messages,
        current_cart: currentCart,
      }),
    });
    if (!res.ok) throw new Error('Error en el asistente Faro AI');
    return res.json();
  },

  // AI Multimodal Menu Extraction (Gemini)
  async extractMenuWithGemini(file: File, restaurantId: string = 'rest_faro_demo'): Promise<MenuExtractionResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('restaurant_id', restaurantId);

    const res = await fetch(`${API_BASE_URL}/ai/extract-menu`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Error al digitalizar la carta con Gemini');
    return res.json();
  },
};
