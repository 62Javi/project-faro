'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { api } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { OrderTicket } from '@/components/kitchen/OrderTicket';
import { playNotificationSound } from '@/components/common/AudioAlert';
import { ChefHat, Wifi, WifiOff, RefreshCw, Flame, CheckCircle, Volume2 } from 'lucide-react';

export default function KitchenPage() {
  const restaurantId = 'rest_faro_demo';
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, lastMessage } = useWebSocket('kitchen', restaurantId);

  const loadKitchenOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getOrders(restaurantId);
      // Filter orders relevant for kitchen
      const activeKitchen = data.filter((o) =>
        ['en_cocina', 'en_preparacion', 'listo'].includes(o.status)
      );
      setOrders(activeKitchen);
    } catch (e) {
      console.error('Error fetching kitchen orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadKitchenOrders();
  }, [restaurantId]);

  // Handle live WebSocket incoming events
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.event === 'ORDER_SENT_TO_KITCHEN' || lastMessage.event === 'ORDER_CREATED') {
        playNotificationSound();
        const incoming = lastMessage.data;
        setOrders((prev) => [incoming, ...prev.filter((o) => o.id !== incoming.id)]);
      } else if (lastMessage.event === 'ORDER_STATUS_CHANGED') {
        const updated = lastMessage.data;
        if (updated.status === 'entregado' || updated.status === 'cancelado') {
          setOrders((prev) => prev.filter((o) => o.id !== updated.id));
        } else {
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o))
          );
        }
      }
    }
  }, [lastMessage]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(restaurantId, orderId, nextStatus);
      if (nextStatus === 'entregado') {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const activeCount = orders.filter((o) => o.status === 'en_cocina' || o.status === 'en_preparacion').length;
  const readyCount = orders.filter((o) => o.status === 'listo').length;

  return (
    <div className="flex-1 bg-navy-950 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <ChefHat className="w-3.5 h-3.5" />
              Kitchen Display System (KDS)
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'En Vivo (WebSockets)' : 'Reconectando...'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Monitor de Cocina & Fuegos</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Comandas aprobadas por mozos listas para cocción y despacho.
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-2">
            <Flame className="w-4 h-4" />
            <span>En Marcha: {activeCount}</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Listos: {readyCount}</span>
          </div>

          <button
            onClick={() => playNotificationSound()}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            title="Probar sonido de timbre"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="mt-6">
        {orders.length === 0 ? (
          <div className="py-24 text-center space-y-3 bg-navy-900/40 rounded-3xl border border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
              <ChefHat className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Cocina al Día • No hay comandas pendientes</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Cuando el personal de salón confirme una orden, aparecerá instantáneamente en esta pantalla con alerta sonora.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
