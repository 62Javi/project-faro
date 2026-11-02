'use client';

import { useState } from 'react';
import { Dish } from '@/lib/types';
import { Plus, Check, ShieldCheck, Leaf, Clock } from 'lucide-react';

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
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl border border-neutral-200/80 p-2.5 transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
      {/* Dish Image Frame */}
      {dish.image_url && (
        <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200/50">
          <img
            src={dish.image_url}
            alt={dish.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
          
          {/* Frosted Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
            {isCeliac && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-emerald-800 text-[10px] font-semibold border border-emerald-200/60 shadow-xs">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Sin TACC
              </span>
            )}
            {isVegan && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-teal-800 text-[10px] font-semibold border border-teal-200/60 shadow-xs">
                <Leaf className="w-3 h-3 text-teal-600" />
                Vegano
              </span>
            )}
            {isVegetarian && !isVegan && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-lime-800 text-[10px] font-semibold border border-lime-200/60 shadow-xs">
                <Leaf className="w-3 h-3 text-lime-600" />
                Vegetariano
              </span>
            )}
          </div>

          {/* Quick Add floating circle (Mobbin hover style) */}
          <button
            onClick={handleAdd}
            disabled={!dish.is_available || added}
            title="Agregar rápido a la mesa"
            aria-label="Agregar rápido"
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/80 text-neutral-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            {added ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
          </button>

          {/* Price Tag pill */}
          <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-neutral-900/90 text-white backdrop-blur-md text-xs font-semibold tabular-nums shadow-sm">
            ${dish.price.toLocaleString('es-AR')}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm text-neutral-900 tracking-tight group-hover:text-black line-clamp-1">
              {dish.name}
            </h3>
            {!dish.image_url && (
              <span className="text-xs font-semibold text-neutral-900 tabular-nums">
                ${dish.price.toLocaleString('es-AR')}
              </span>
            )}
          </div>
          
          <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
            {dish.description}
          </p>

          {/* Allergens & Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {dish.allergens.map((alg) => (
              <span key={alg} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100/80 text-neutral-600 border border-neutral-200/60">
                {alg.replace('_', ' ')}
              </span>
            ))}
            {dish.preparation_time_minutes && (
              <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
                <Clock className="w-3 h-3" />
                {dish.preparation_time_minutes} min
              </span>
            )}
          </div>
        </div>

        {/* Add Actions */}
        <div className="pt-2 border-t border-neutral-100">
          {showNotes ? (
            <div className="space-y-2 mb-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Aclaración (ej: término medio, sin cebolla...)"
                className="w-full text-xs px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 focus:bg-white"
              />
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            {!showNotes && (
              <button
                onClick={() => setShowNotes(true)}
                className="text-[11px] text-neutral-400 hover:text-neutral-900 px-2 py-1 font-medium transition-colors"
              >
                + Nota
              </button>
            )}

            <button
              onClick={handleAdd}
              disabled={!dish.is_available || added}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold transition-all shadow-xs ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-black text-white active:scale-98'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>En tu mesa</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
