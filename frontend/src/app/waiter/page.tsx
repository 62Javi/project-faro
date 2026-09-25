'use client';

import { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { api } from '@/lib/api';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WaiterOrderCard } from '@/components/waiter/WaiterOrderCard';
import { playNotificationSound } from '@/components/common/AudioAlert';
import { Bell, Wifi, WifiOff, RefreshCw, CheckCircle2, Clock, Users } from 'lucide-react';

export default function WaiterPage() {
  const restaurantId = 'rest_faro_demo';
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, lastMessage } = useWebSocket('waiter', restaurantId);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getOrders(restaurantId);
      setOrders(data);
    } catch (e) {
      console.error('Error fetching waiter orders:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [restaurantId]);

  // Handle live WebSocket incoming events
  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.event === 'ORDER_CREATED') {
        playNotificationSound();
        setOrders((prev) => [lastMessage.data, ...prev.filter((o) => o.id !== lastMessage.data.id)]);
      } else if (lastMessage.event === 'ORDER_STATUS_CHANGED' || lastMessage.event === 'ORDER_CONFIRMED') {
        setOrders((prev) =>
          prev.map((o) => (o.id === lastMessage.data.id ? lastMessage.data : o))
        );
      }
    }
  }, [lastMessage]);

  const handleConfirmOrder = async (orderId: string) => {
    try {
      const updated = await api.updateOrderStatus(restaurantId, orderId, 'en_cocina' as OrderStatus, 'Carlos (Mozo Salón)');
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (e) {
      console.error('Error confirming order:', e);
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'pendiente_mozo');
  const activeKitchenOrders = orders.filter((o) => o.status !== 'pendiente_mozo' && o.status !== 'entregado' && o.status !== 'cancelado');
  const displayedOrders = activeTab === 'pending' ? pendingOrders : orders;

  return (
    <div className="flex-1 bg-navy-950 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">
              <Users className="w-3.5 h-3.5" />
              Personal de Salón & Mozos
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'WebSocket Conectado' : 'Reconectando...'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Comandas de Salón</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Verifica pedidos generados por comensales en sus mesas y despáchalos a cocina.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
            title="Refrescar comandas"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 my-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-navy-950 shadow-lg shadow-amber-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pendientes de Confirmación</span>
          {pendingOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-navy-950 text-amber-400 text-xs flex items-center justify-center font-black">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-faro-600 text-white shadow-lg shadow-faro-600/20'
              : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Todas las Comandas ({orders.length})</span>
        </button>
      </div>

      {/* Orders Grid */}
      {displayedOrders.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-navy-900/40 rounded-3xl border border-white/5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">¡No hay pedidos pendientes en este momento!</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Cuando los comensales agreguen platos y confirmen desde el QR de su mesa, las alertas sonarán aquí al instante.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedOrders.map((order) => (
            <WaiterOrderCard
              key={order.id}
              order={order}
              onConfirmOrder={handleConfirmOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
