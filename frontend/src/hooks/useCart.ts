'use client';

import { useState, useEffect } from 'react';
import { Dish, CartItem } from '@/lib/types';

export function useCart(restaurantId: string = 'rest_faro_demo', tableNumber: number = 1) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`faro_cart_${restaurantId}_mesa_${tableNumber}`);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [restaurantId, tableNumber]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`faro_cart_${restaurantId}_mesa_${tableNumber}`, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items, restaurantId, tableNumber]);

  const addToCart = (dish: Dish, quantity: number = 1, dishNotes: string = '') => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.dish.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (dishNotes) {
          updated[existingIndex].notes = dishNotes;
        }
        return updated;
      }
      return [...prev, { dish, quantity, notes: dishNotes }];
    });
  };

  const updateQuantity = (dishId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (dishId: string) => {
    setItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  };

  const clearCart = () => {
    setItems([]);
    setNotes('');
    try {
      localStorage.removeItem(`faro_cart_${restaurantId}_mesa_${tableNumber}`);
    } catch (e) {
      console.error(e);
    }
  };

  const total = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    notes,
    setNotes,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
  };
}
