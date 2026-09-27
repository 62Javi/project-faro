'use client';

import { RestaurantMetrics } from '@/lib/types';
import { DollarSign, ShoppingBag, TrendingUp, Users, Clock, Award } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: RestaurantMetrics;
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  const kpis = [
    {
      title: 'Facturación Hoy',
      value: `$${metrics.total_sales_today.toLocaleString('es-AR')}`,
      change: '+18.4% vs ayer',
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Comandas Totales',
      value: metrics.total_orders_today.toString(),
      change: '89 comensales atendidos',
      icon: ShoppingBag,
      color: 'text-faro-400 bg-faro-500/10 border-faro-500/20',
    },
    {
      title: 'Ticket Promedio',
      value: `$${Math.round(metrics.average_ticket).toLocaleString('es-AR')}`,
      change: 'Optimizado con IA Sommelier',
      icon: TrendingUp,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Pedidos en Cocina',
      value: metrics.pending_orders.toString(),
      change: 'Tiempo prom: 14 min',
      icon: Clock,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-navy-900/80 border border-white/10 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">{kpi.value}</div>
                <div className="text-xs text-slate-400 mt-1">{kpi.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Breakdown Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Dishes */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Platos Estrella con Mayor Rotación</h3>
          </div>
          <div className="space-y-3">
            {metrics.top_dishes.map((dish, idx) => (
              <div
                key={dish.dish_id || idx}
                className="p-3 rounded-xl bg-navy-950/60 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-white/5 text-slate-400 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{dish.dish_name}</h4>
                    <span className="text-[11px] text-slate-400">{dish.units_sold} unidades vendidas</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-faro-400">
                  ${dish.revenue.toLocaleString('es-AR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-faro-400" />
            <h3 className="font-bold text-base text-white">Facturación por Categoría</h3>
          </div>
          <div className="space-y-4">
            {metrics.revenue_by_category.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">{cat.category_name}</span>
                  <span className="text-slate-400 font-mono">
                    ${cat.total.toLocaleString('es-AR')} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-navy-950 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-faro-600 to-faro-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
