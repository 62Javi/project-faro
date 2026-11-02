'use client';

import { Order, OrderStatus } from '@/lib/types';
import { Clock } from 'lucide-react';

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
          color: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
          nextStatus: 'en_preparacion' as OrderStatus,
          nextLabel: 'Iniciar Marcha',
          buttonColor: 'bg-amber-600 hover:bg-amber-500 text-white shadow-sm shadow-amber-600/20',
        };
      case 'en_preparacion':
        return {
          label: 'En Preparación',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          nextStatus: 'listo' as OrderStatus,
          nextLabel: 'Marcar Listo',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/20',
        };
      case 'listo':
        return {
          label: 'Listo para Servir',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          nextStatus: 'entregado' as OrderStatus,
          nextLabel: 'Entregado a Mesa',
          buttonColor: 'bg-slate-800 hover:bg-slate-700 text-white shadow-sm',
        };
      default:
        return {
          label: order.status,
          color: 'bg-slate-100 text-slate-700 border-slate-200',
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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-faro-300 hover:shadow-md transition-all">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-orange-50 text-faro-700 font-black text-xl flex items-center justify-center border border-orange-200">
              {order.table_number}
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">MESA {order.table_number}</h3>
              <p className="text-[11px] text-slate-500">
                Mozo: {order.waiter_name || 'Confirmado'} • Comanda #{order.id.slice(-6)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.color}`}>
              {badge.label}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-500">
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
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-faro-600 text-white font-bold text-xs flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <span className="font-bold text-slate-800 text-sm">{item.dish_name}</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-amber-700 font-semibold pl-8 mt-1">
                    Nota: {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Customer notes */}
        {order.customer_notes && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 mb-4">
            <span className="font-bold">Aclaración cliente:</span> {order.customer_notes}
          </div>
        )}
      </div>

      {/* Action button */}
      {badge.nextStatus && (
        <div className="pt-3 border-t border-slate-100">
          <button
            onClick={() => onUpdateStatus(order.id, badge.nextStatus as OrderStatus)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all active:scale-98 ${badge.buttonColor}`}
          >
            {badge.nextLabel}
          </button>
        </div>
      )}
    </div>
  );
}
