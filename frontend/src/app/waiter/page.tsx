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
  const displayedOrders = activeTab === 'pending' ? pendingOrders : orders;

  return (
    <div className="flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <Users className="w-3.5 h-3.5" />
              Personal de Salón & Mozos
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full border ${
                isConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isConnected ? 'WebSocket Conectado' : 'Reconectando...'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Comandas de Salón</h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Verifica pedidos generados por comensales en sus mesas y despáchalos a cocina.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-colors"
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
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pendientes de Confirmación</span>
          {pendingOrders.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-amber-600 text-xs flex items-center justify-center font-black shadow-xs">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-faro-600 text-white shadow-md shadow-faro-600/25'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Todas las Comandas ({orders.length})</span>
        </button>
      </div>

      {/* Orders Grid */}
      {displayedOrders.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">¡No hay pedidos pendientes en este momento!</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
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
