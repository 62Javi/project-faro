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
        return <Flame className="w-3.5 h-3.5" />;
      case 'IceCream':
        return <IceCream className="w-3.5 h-3.5" />;
      case 'GlassWater':
        return <GlassWater className="w-3.5 h-3.5" />;
      default:
        return <Utensils className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
          selectedCategory === null
            ? 'bg-neutral-900 text-white shadow-sm border border-neutral-900'
            : 'bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-600 hover:text-neutral-900 border border-transparent'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 opacity-80" />
        <span>Todo el Menú</span>
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-neutral-900 text-white shadow-sm border border-neutral-900'
                : 'bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-600 hover:text-neutral-900 border border-transparent'
            }`}
          >
            {getIcon(cat.icon)}
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
