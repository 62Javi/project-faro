'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RestaurantMetrics } from '@/lib/types';
import { api } from '@/lib/api';
import { MetricsOverview } from '@/components/admin/MetricsOverview';
import { LayoutDashboard, Utensils, QrCode, Sparkles, TrendingUp, ArrowUpRight, FileUp, Store } from 'lucide-react';

export default function AdminDashboardPage() {
  const restaurantId = 'rest_faro_demo';
  const [metrics, setMetrics] = useState<RestaurantMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getMetrics(restaurantId);
        setMetrics(data);
      } catch (e) {
        console.error('Error loading metrics:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [restaurantId]);

  return (
    <div className="flex-1 bg-navy-950 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">
              <Store className="w-3.5 h-3.5" />
              Gestión para el Dueño
            </span>
            <span className="text-xs text-slate-400">Multi-tenant (Clerk Auth)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Panel de Control & Métricas</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Analítica en tiempo real de ventas, rotación de platos y control de salón.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/admin/menu"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-faro-600 to-faro-500 hover:from-faro-500 hover:to-faro-400 text-white text-xs font-bold shadow-lg shadow-faro-600/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Carga de Menú con IA
          </Link>

          <Link
            href="/admin/tables"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Códigos QR de Mesas
          </Link>
        </div>
      </div>

      {/* Main Metrics Content */}
      <div className="mt-8">
        {metrics ? (
          <MetricsOverview metrics={metrics} />
        ) : (
          <div className="py-20 text-center text-slate-400 text-sm">
            Cargando indicadores de negocio...
          </div>
        )}
      </div>
    </div>
  );
}
