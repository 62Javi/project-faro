'use client';

import { useState, useEffect } from 'react';
import { Dish, Category, Restaurant } from '@/lib/types';
import { api } from '@/lib/api';
import { MenuUploadModal } from '@/components/ai/MenuUploadModal';
import { Sparkles, Plus, Trash2, Edit3, ShieldCheck, Leaf, Loader2, ArrowLeft, Check, Search } from 'lucide-react';
import Link from 'next/link';

export default function AdminMenuPage() {
  const restaurantId = 'rest_faro_demo';
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Manual dish modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCat, setNewDishCat] = useState('');
  const [newDishCeliac, setNewDishCeliac] = useState(false);
  const [newDishVegan, setNewDishVegan] = useState(false);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const data = await api.getRestaurantMenu(restaurantId);
      setCategories(data.categories);
      setDishes(data.dishes);
      if (data.categories.length > 0) {
        setNewDishCat(data.categories[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, [restaurantId]);

  const handleDeleteDish = async (dishId: string) => {
    if (confirm('¿Deseas eliminar este plato de la carta?')) {
      await api.deleteDish(restaurantId, dishId);
      setDishes((prev) => prev.filter((d) => d.id !== dishId));
    }
  };

  const handleToggleAvailability = async (dish: Dish) => {
    const updated = await api.updateDish(restaurantId, dish.id, {
      is_available: !dish.is_available,
    });
    setDishes((prev) => prev.map((d) => (d.id === dish.id ? updated : d)));
  };

  const handleCreateManualDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName || !newDishPrice) return;

    const allergens: string[] = [];
    if (newDishCeliac) allergens.push('apto_celiaco');
    if (newDishVegan) allergens.push('vegano');

    const catObj = categories.find((c) => c.id === newDishCat);

    const created = await api.createDish(restaurantId, {
      name: newDishName,
      description: newDishDesc,
      price: parseFloat(newDishPrice),
      category_id: newDishCat,
      category_name: catObj?.name || 'General',
      is_available: true,
      allergens: allergens,
      tags: newDishCeliac ? ['sin_tacc'] : [],
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    });

    setDishes((prev) => [...prev, created]);
    setShowAddModal(false);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('');
  };

  const filteredDishes = dishes.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-navy-950 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a Métricas
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Gestión de Carta y Precios</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Actualiza platos, activa/desactiva stock o digitaliza una nueva carta física con Gemini.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-faro-500 to-faro-600 hover:from-amber-400 hover:to-faro-500 text-white text-xs font-bold shadow-lg shadow-faro-600/30 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
            Cargar Foto / PDF con IA
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors border border-white/10"
          >
            <Plus className="w-4 h-4" />
            Nuevo Plato Manual
          </button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <div className="my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar por nombre o categoría..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-faro-500"
          />
        </div>

        <div className="text-xs text-slate-400">
          Total de platos activos: <span className="text-white font-bold">{dishes.length}</span>
        </div>
      </div>

      {/* Dishes Table / Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-faro-500 mx-auto" />
          <p className="text-slate-400 text-sm">Cargando catálogo...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map((dish) => (
            <div
              key={dish.id}
              className={`p-4 rounded-2xl border transition-all ${
                dish.is_available
                  ? 'bg-navy-900/80 border-white/10'
                  : 'bg-navy-950 border-white/5 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[11px] font-semibold text-faro-400 px-2 py-0.5 rounded bg-faro-500/10 border border-faro-500/20">
                    {dish.category_name}
                  </span>
                  <h3 className="font-bold text-white text-base mt-1">{dish.name}</h3>
                </div>
                <span className="font-bold text-white text-base whitespace-nowrap">
                  ${dish.price.toLocaleString('es-AR')}
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{dish.description}</p>

              {/* Allergens */}
              <div className="flex flex-wrap gap-1 mb-4">
                {dish.allergens.map((alg) => (
                  <span
                    key={alg}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                  >
                    {alg.replace('_', ' ')}
                  </span>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAvailability(dish)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    dish.is_available
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {dish.is_available ? '● Disponible' : '○ Agotado (Sin Stock)'}
                </button>

                <button
                  onClick={() => handleDeleteDish(dish.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                  title="Eliminar plato"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-navy-950 border border-white/15 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Agregar Nuevo Plato a la Carta</h3>
            <form onSubmit={handleCreateManualDish} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nombre del Plato / Bebida</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="Ej: Ojo de Bife con Papas"
                  className="w-full text-xs p-2.5 rounded-xl bg-navy-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Descripción e Ingredientes</label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Detalles del plato..."
                  className="w-full text-xs p-2.5 rounded-xl bg-navy-900 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Precio (ARS)</label>
                  <input
                    type="number"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(e.target.value)}
                    placeholder="15000"
                    className="w-full text-xs p-2.5 rounded-xl bg-navy-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Categoría</label>
                  <select
                    value={newDishCat}
                    onChange={(e) => setNewDishCat(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-navy-900 border border-white/10 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishCeliac}
                    onChange={(e) => setNewDishCeliac(e.target.checked)}
                    className="rounded bg-navy-900 border-white/20 text-faro-500"
                  />
                  <span>Apto Celíaco (Sin TACC)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDishVegan}
                    onChange={(e) => setNewDishVegan(e.target.checked)}
                    className="rounded bg-navy-900 border-white/20 text-faro-500"
                  />
                  <span>Vegano</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-faro-600 hover:bg-faro-500 text-white text-xs font-bold"
                >
                  Guardar Plato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Multimodal Gemini AI OCR Modal */}
      <MenuUploadModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        restaurantId={restaurantId}
        onMenuUpdated={loadMenu}
      />
    </div>
  );
}
