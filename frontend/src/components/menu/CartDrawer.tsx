'use client';

import { useState } from 'react';
import { CartItem } from '@/lib/types';
import { api } from '@/lib/api';
import { ShoppingBag, X, Plus, Minus, Trash2, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  tableNumber: number;
  restaurantId: string;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
  total: number;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  tableNumber,
  restaurantId,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  total,
}: CartDrawerProps) {
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        restaurant_id: restaurantId,
        table_number: tableNumber,
        items: items.map((i) => ({
          dish_id: i.dish.id,
          dish_name: i.dish.name,
          unit_price: i.dish.price,
          quantity: i.quantity,
          notes: i.notes || '',
        })),
        customer_notes: customerNotes,
      };

      const result = await api.createOrder(orderPayload);
      setSubmittedOrder(result);
      onClearCart();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setError(err.message || 'Error al enviar pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-navy-950 border-l border-white/10 h-full flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-faro-500/20 text-faro-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Tu Pedido</h2>
              <p className="text-xs text-slate-400">Mesa N° {tableNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {submittedOrder ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">¡Pedido Notificado al Mozo!</h3>
              <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
                El mozo de tu sector ha recibido la notificación en su dispositivo y se acercará a la <strong>Mesa {tableNumber}</strong> para verificar tu pedido antes de enviarlo a la cocina.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-xs space-y-1">
                <div className="text-slate-400">ID de Comanda: <span className="text-white font-mono">{submittedOrder.id}</span></div>
                <div className="text-slate-400">Estado: <span className="text-faro-400 font-semibold">Pendiente de Confirmación</span></div>
              </div>
              <button
                onClick={() => {
                  setSubmittedOrder(null);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-faro-600 hover:bg-faro-500 text-white font-semibold transition-all shadow-lg"
              >
                Volver a la Carta
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-white/5 text-slate-500 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm">Tu carrito está vacío</p>
              <p className="text-slate-500 text-xs">
                Selecciona platos de la carta o pídele a <strong>Faro AI</strong> que los agregue por ti.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.dish.id}
                  className="p-3.5 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.dish.name}</h4>
                    <p className="text-xs text-faro-400 font-bold mt-0.5">
                      ${(item.dish.price * item.quantity).toLocaleString('es-AR')}
                    </p>
                    {item.notes && (
                      <p className="text-[11px] text-slate-400 italic mt-1 bg-white/5 px-2 py-0.5 rounded">
                        Nota: {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-1.5 bg-navy-950 rounded-lg p-1 border border-white/10">
                    <button
                      onClick={() => onUpdateQuantity(item.dish.id, -1)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-white px-1.5 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.dish.id, 1)}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.dish.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Customer Notes */}
              <div className="pt-2">
                <label className="text-xs font-medium text-slate-400 block mb-1.5">
                  Aclaraciones generales para la mesa:
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Ej: Traer hielo extra, somos 4 personas..."
                  className="w-full text-xs p-2.5 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-faro-500"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!submittedOrder && items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-navy-900/50 space-y-4">
            <div className="flex items-center justify-between text-slate-300 text-sm">
              <span>Subtotal mesa:</span>
              <span className="text-xl font-bold text-white">${total.toLocaleString('es-AR')}</span>
            </div>

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-faro-600 to-faro-500 hover:from-faro-500 hover:to-faro-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-faro-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando al Mozo...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Confirmar Pedido con Mozo
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
