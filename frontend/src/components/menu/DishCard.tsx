'use client';

import { useState } from 'react';
import { Dish } from '@/lib/types';
import { Plus, Check, ShieldCheck, Leaf, Clock, Sparkles } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onAddToCart: (dish: Dish, quantity: number, notes: string) => void;
}

export function DishCard({ dish, onAddToCart }: DishCardProps) {
  const [added, setAdded] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleAdd = () => {
    onAddToCart(dish, 1, notes);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setShowNotes(false);
      setNotes('');
    }, 1500);
  };

  const isCeliac = dish.allergens.includes('apto_celiaco') || dish.tags.includes('sin_tacc');
  const isVegetarian = dish.allergens.includes('vegetariano');
  const isVegan = dish.allergens.includes('vegano');

  return (
    <div className="group relative bg-navy-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-faro-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-faro-900/20 flex flex-col justify-between">
      {/* Dish Image */}
      {dish.image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-800">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-black/20" />
          
          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {isCeliac && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-semibold backdrop-blur-sm shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sin TACC
              </span>
            )}
            {isVegan && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/90 text-white text-xs font-semibold backdrop-blur-sm shadow-md">
                <Leaf className="w-3.5 h-3.5" />
                Vegano
              </span>
            )}
            {isVegetarian && !isVegan && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lime-600/90 text-white text-xs font-semibold backdrop-blur-sm shadow-md">
                <Leaf className="w-3.5 h-3.5" />
                Vegetariano
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-navy-950/80 backdrop-blur-md border border-white/10 text-white font-bold text-base">
            ${dish.price.toLocaleString('es-AR')}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-lg text-white group-hover:text-faro-400 transition-colors">
              {dish.name}
            </h3>
          </div>
          
          <p className="text-slate-400 text-sm line-clamp-2 mb-3 leading-relaxed">
            {dish.description}
          </p>

          {/* Allergens & Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {dish.allergens.map((alg) => (
              <span key={alg} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                {alg.replace('_', ' ')}
              </span>
            ))}
            {dish.preparation_time_minutes && (
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-faro-500/10 text-faro-300 border border-faro-500/20">
                <Clock className="w-3 h-3" />
                ~{dish.preparation_time_minutes} min
              </span>
            )}
          </div>
        </div>

        {/* Add Actions */}
        <div className="pt-3 border-t border-white/5">
          {showNotes ? (
            <div className="space-y-2 mb-3">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aclaración (ej: punto de la carne, sin aderezo...)"
                className="w-full text-xs px-3 py-2 rounded-lg bg-navy-950 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:border-faro-500"
              />
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            {!showNotes && (
              <button
                onClick={() => setShowNotes(true)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                + Nota
              </button>
            )}

            <button
              onClick={handleAdd}
              disabled={!dish.is_available || added}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-md ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-faro-600 hover:bg-faro-500 text-white shadow-faro-600/20 active:scale-98'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  Agregado al Carrito
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Agregar a mi Mesa
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
