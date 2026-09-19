'use client';

import { Category } from '@/lib/types';
import { Utensils, Flame, IceCream, GlassWater, Sparkles } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-4 h-4" />;
      case 'IceCream':
        return <IceCream className="w-4 h-4" />;
      case 'GlassWater':
        return <GlassWater className="w-4 h-4" />;
      default:
        return <Utensils className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
          selectedCategory === null
            ? 'bg-faro-600 text-white shadow-lg shadow-faro-600/30 ring-2 ring-faro-400/50'
            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
        }`}
      >
        <Sparkles className="w-4 h-4 text-faro-400" />
        Todo el Menú
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === cat.id
              ? 'bg-faro-600 text-white shadow-lg shadow-faro-600/30 ring-2 ring-faro-400/50'
              : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
          }`}
        >
          {getIcon(cat.icon)}
          {cat.name}
        </button>
      ))}
    </div>
  );
}
