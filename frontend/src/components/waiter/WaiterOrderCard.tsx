'use client';

import { useState } from 'react';
import { Order } from '@/lib/types';
import { Check, Clock, AlertTriangle, Send } from 'lucide-react';

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
      className={`rounded-2xl border p-5 transition-all duration-300 bg-white ${
        isPendingWaiter
          ? 'border-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30'
          : 'border-slate-200/90 shadow-xs opacity-85'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-black text-lg border border-amber-200">
            {order.table_number}
          </span>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Mesa #{order.table_number}</h3>
            <p className="text-[11px] text-slate-500">
              Comanda #{order.id.slice(-6)} • {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        <div>
          {isPendingWaiter ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              Esperando Mozo
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
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
                <span className="w-5 h-5 rounded bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-[11px]">
                  {item.quantity}x
                </span>
                <span className="font-semibold text-slate-800">{item.dish_name}</span>
              </div>
              {item.notes && (
                <p className="text-[11px] text-amber-700 pl-7 italic mt-0.5">
                  Nota: {item.notes}
                </p>
              )}
            </div>
            <span className="font-semibold text-slate-600">
              ${item.subtotal.toLocaleString('es-AR')}
            </span>
          </div>
        ))}
      </div>

      {/* Customer Notes */}
      {order.customer_notes && (
        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 mb-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <span>{order.customer_notes}</span>
        </div>
      )}

      {/* Total & Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-500 block">Total mesa:</span>
          <span className="text-lg font-bold text-slate-900">${order.total.toLocaleString('es-AR')}</span>
        </div>

        {isPendingWaiter && (
          <button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {isConfirming ? 'Enviando...' : 'Confirmar y Pasar a Cocina'}
          </button>
        )}
      </div>
    </div>
  );
}
