'use client';

import { Order, OrderStatus } from '@/lib/types';
import { Clock, ChefHat, CheckCircle2, Flame, AlertCircle } from 'lucide-react';

interface OrderTicketProps {
  order: Order;
  onUpdateStatus: (orderId: string, nextStatus: OrderStatus) => Promise<void>;
}

export function OrderTicket({ order, onUpdateStatus }: OrderTicketProps) {
  const getStatusBadge = () => {
    switch (order.status) {
      case 'en_cocina':
        return {
          label: 'Nuevo en Cocina',
          color: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse',
          nextStatus: 'en_preparacion' as OrderStatus,
          nextLabel: 'Iniciar Marcha',
          buttonColor: 'bg-amber-600 hover:bg-amber-500',
        };
      case 'en_preparacion':
        return {
          label: 'En Preparación',
          color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
          nextStatus: 'listo' as OrderStatus,
          nextLabel: 'Marcar Listo',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-500',
        };
      case 'listo':
        return {
          label: 'Listo para Servir',
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          nextStatus: 'entregado' as OrderStatus,
          nextLabel: 'Entregado a Mesa',
          buttonColor: 'bg-slate-700 hover:bg-slate-600',
        };
      default:
        return {
          label: order.status,
          color: 'bg-white/10 text-slate-400 border-white/10',
          nextStatus: null,
          nextLabel: '',
          buttonColor: '',
        };
    }
  };

  const badge = getStatusBadge();
  const elapsedMinutes = Math.floor(
    (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60)
  );

  return (
    <div className="bg-navy-900 border border-white/15 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-faro-500/50 transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-faro-500/20 text-faro-400 font-black text-xl flex items-center justify-center border border-faro-500/30">
              {order.table_number}
            </span>
            <div>
              <h3 className="font-bold text-white text-base">MESA {order.table_number}</h3>
              <p className="text-[11px] text-slate-400">
                Mozo: {order.waiter_name || 'Confirmado'} • Comanda #{order.id.slice(-6)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}>
              {badge.label}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {elapsedMinutes < 1 ? 'Hace un momento' : `${elapsedMinutes} min`}
            </span>
          </div>
        </div>

        {/* Dishes list */}
        <div className="space-y-3 mb-4">
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-navy-950/70 border border-white/5 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-faro-500 text-white font-bold text-xs flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <span className="font-bold text-white text-sm">{item.dish_name}</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-amber-300 font-medium pl-8 mt-1">
                    ⚠️ {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Global Notes */}
        {order.customer_notes && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>Nota: {order.customer_notes}</span>
          </div>
        )}
      </div>

      {/* Action button */}
      {badge.nextStatus && (
        <div className="pt-3 border-t border-white/10">
          <button
            onClick={() => onUpdateStatus(order.id, badge.nextStatus!)}
            className={`w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${badge.buttonColor}`}
          >
            <ChefHat className="w-4 h-4" />
            {badge.nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
