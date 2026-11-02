'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Dish, Category, Restaurant } from '@/lib/types';
import { api } from '@/lib/api';
import { useCart } from '@/hooks/useCart';
import { DishCard } from '@/components/menu/DishCard';
import { CategoryNav } from '@/components/menu/CategoryNav';
import { CartDrawer } from '@/components/menu/CartDrawer';
import { AiChatAssistant } from '@/components/ai/AiChatAssistant';
import { Search, ShieldCheck, Leaf, MapPin, Phone, Loader2 } from 'lucide-react';

export default function CustomerMenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const restaurantId = (params.restaurantId as string) || 'rest_faro_demo';
  const tableParam = searchParams.get('mesa');
  const tableNumber = tableParam ? parseInt(tableParam, 10) : 3;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCeliac, setFilterCeliac] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const cart = useCart(restaurantId, tableNumber);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await api.getRestaurantMenu(restaurantId);
      setRestaurant(data.restaurant);
      setCategories(data.categories);
      setDishes(data.dishes);
    } catch (err) {
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [restaurantId]);

  // Filter logic
  const filteredDishes = dishes.filter((dish) => {
    if (selectedCategory && dish.category_id !== selectedCategory) return false;
    if (filterCeliac && !dish.allergens.includes('apto_celiaco') && !dish.tags.includes('sin_tacc')) return false;
    if (filterVegan && !dish.allergens.includes('vegano')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = dish.name.toLowerCase().includes(q);
      const matchDesc = dish.description.toLowerCase().includes(q);
      const matchTag = dish.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 bg-[#FAFAFA] min-h-screen pb-28">
      {/* Restaurant Header Banner */}
      <div className="relative bg-white border-b border-neutral-200/70 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Mesa N° {tableNumber} &middot; Carta en Vivo
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                {restaurant?.name || 'Faro - Cocina de Mar & Fuego'}
              </h1>
              <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                {restaurant?.description || 'Sabores de costa argentina, fuegos a leña y pesca fresca del día.'}
              </p>
            </div>

            {/* Quick Contact info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {restaurant?.address || 'Av. Costanera 1420, La Plata'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                {restaurant?.phone || '+54 221 555-0199'}
              </span>
            </div>
          </div>

          {/* Mobbin Search & Quick Diet Filters */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por plato, ingrediente o maridaje..."
                className="w-full pl-10 pr-12 py-2.5 rounded-full bg-neutral-100/80 border border-transparent focus:border-neutral-300 focus:bg-white text-neutral-900 placeholder:text-neutral-400 text-xs sm:text-sm transition-all outline-none"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-neutral-200/60 rounded text-[10px] font-medium text-neutral-500">
                <span>⌘</span>K
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterCeliac(!filterCeliac)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all border ${
                  filterCeliac
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Sin TACC
              </button>

              <button
                onClick={() => setFilterVegan(!filterVegan)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all border ${
                  filterVegan
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-600 border-neutral-200/80 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <Leaf className="w-3.5 h-3.5" />
                Vegano
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Category Bar */}
        <div className="mb-6">
          <CategoryNav
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* Dishes Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-900 mx-auto" />
            <p className="text-neutral-500 text-xs sm:text-sm">Cargando carta gastronómica...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-white rounded-2xl border border-neutral-200/80 shadow-xs p-8 max-w-lg mx-auto">
            <p className="text-neutral-900 font-medium text-sm">No se encontraron platos con los filtros seleccionados</p>
            <p className="text-neutral-500 text-xs">Intenta buscar otro término o restablecer los filtros dietarios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAddToCart={(d, q, n) => cart.addToCart(d, q, n)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Bar (Cart Summary) */}
      {cart.itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-neutral-900/95 hover:bg-black text-white font-medium text-xs sm:text-sm shadow-2xl backdrop-blur-md border border-neutral-800 transition-all hover:scale-[1.02] active:scale-98"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-white text-neutral-900 flex items-center justify-center text-[10px] font-bold">
                {cart.itemCount}
              </span>
              <span>Comanda Mesa {tableNumber}</span>
            </div>
            <span className="font-semibold text-neutral-100 tabular-nums">
              ${cart.total.toLocaleString('es-AR')} &rarr;
            </span>
          </button>
        </div>
      )}

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.items}
        tableNumber={tableNumber}
        restaurantId={restaurantId}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        onClearCart={cart.clearCart}
        total={cart.total}
      />

      {/* AI Sommelier Virtual Assistant */}
      <AiChatAssistant
        restaurantId={restaurantId}
        tableNumber={tableNumber}
        onAddToCart={(d, q, n) => cart.addToCart(d, q, n)}
        dishes={dishes}
      />
    </div>
  );
}
