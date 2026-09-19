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
import { Search, ShoppingBag, ShieldCheck, Leaf, Sparkles, MapPin, Phone, Loader2 } from 'lucide-react';

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
    <div className="flex-1 bg-navy-950 pb-24">
      {/* Restaurant Header Banner */}
      <div className="relative bg-gradient-to-b from-navy-900 via-navy-950 to-navy-950 border-b border-white/10 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-faro-500/20 text-faro-400 text-xs font-bold border border-faro-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Mesa N° {tableNumber} • Carta Digital en Vivo
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {restaurant?.name || 'Faro - Cocina de Mar & Fuego'}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                {restaurant?.description || 'Sabores de costa argentina, fuegos a leña y pesca fresca del día.'}
              </p>
            </div>

            {/* Quick Contact info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-faro-400" />
                {restaurant?.address || 'Av. Costanera 1420, La Plata'}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-faro-400" />
                {restaurant?.phone || '+54 221 555-0199'}
              </span>
            </div>
          </div>

          {/* Search & Quick Diet Filters */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por plato, ingrediente o bebida..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-faro-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterCeliac(!filterCeliac)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  filterCeliac
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                    : 'bg-navy-900 text-slate-300 border-white/10 hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Sin TACC
              </button>

              <button
                onClick={() => setFilterVegan(!filterVegan)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  filterVegan
                    ? 'bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-600/20'
                    : 'bg-navy-900 text-slate-300 border-white/10 hover:bg-white/5'
                }`}
              >
                <Leaf className="w-4 h-4" />
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
            <Loader2 className="w-8 h-8 animate-spin text-faro-500 mx-auto" />
            <p className="text-slate-400 text-sm">Cargando carta gastronómica...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="py-16 text-center space-y-2 bg-navy-900/40 rounded-3xl border border-white/5">
            <p className="text-white font-bold text-base">No se encontraron platos con los filtros seleccionados</p>
            <p className="text-slate-400 text-xs">Intenta buscar otro término o restablecer los filtros dietarios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onAddToCart={cart.addToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.itemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-lg animate-fadeIn">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-faro-600 via-faro-500 to-amber-500 text-white font-bold text-sm shadow-2xl shadow-faro-600/40 flex items-center justify-between hover:scale-102 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                {cart.itemCount}
              </div>
              <div className="text-left">
                <div className="text-xs font-medium text-amber-100">Mesa {tableNumber}</div>
                <div className="text-sm font-bold">Ver Pedido de la Mesa</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-amber-100">Total</div>
              <div className="text-base font-black">${cart.total.toLocaleString('es-AR')}</div>
            </div>
          </button>
        </div>
      )}

      {/* Cart Drawer */}
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

      {/* Floating AI Sommelier Assistant */}
      <AiChatAssistant
        restaurantId={restaurantId}
        tableNumber={tableNumber}
        onAddToCart={cart.addToCart}
        dishes={dishes}
      />
    </div>
  );
}
