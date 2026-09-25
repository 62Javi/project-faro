'use client';

import { useState } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { Check, Clock, AlertTriangle, Send, UserCheck, Flame } from 'lucide-react';

interface WaiterOrderCardProps {
  order: Order;
  onConfirmOrder: (orderId: string) => Promise<void>;
}

export function WaiterOrderCard({ order, onConfirmOrder }: WaiterOrderCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirmOrder(order.id);
    } finally {
      setIsConfirming(false);
    }
  };

  const isPendingWaiter = order.status === 'pendiente_mozo';

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 ${
        isPendingWaiter
          ? 'bg-navy-900/90 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
          : 'bg-navy-950/60 border-white/10 opacity-75'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black text-lg border border-amber-500/30">
            {order.table_number}
          </span>
          <div>
            <h3 className="font-bold text-white text-base">Mesa #{order.table_number}</h3>
            <p className="text-[11px] text-slate-400">
              Comanda #{order.id.slice(-6)} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div>
          {isPendingWaiter ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Esperando Mozo
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
              Enviado a Cocina
            </span>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start justify-between text-xs">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-white/10 text-white font-bold flex items-center justify-center text-[11px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-slate-200">{item.dish_name}</span>
              </div>
              {item.notes && (
                <p className="text-[11px] text-amber-400/90 pl-7 italic mt-0.5">
                  Nota: {item.notes}
                </p>
              )}
            </div>
            <span className="font-medium text-slate-400">
              ${item.subtotal.toLocaleString('es-AR')}
            </span>
          </div>
        ))}
      </div>

      {/* Customer Notes */}
      {order.customer_notes && (
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>{order.customer_notes}</span>
        </div>
      )}

      {/* Total & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          <span className="text-xs text-slate-400 block">Total mesa:</span>
          <span className="text-lg font-bold text-white">${order.total.toLocaleString('es-AR')}</span>
        </div>

        {isPendingWaiter && (
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isConfirming ? 'Enviando...' : 'Confirmar y Pasar a Cocina'}
          </button>
        )}
      </div>
    </div>
  );
}
