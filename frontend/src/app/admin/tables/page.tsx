'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RestaurantTable } from '@/lib/types';
import { api } from '@/lib/api';
import { QRCodeCard } from '@/components/admin/QRCodeCard';
import { QrCode, ArrowLeft, Printer, Plus, Table } from 'lucide-react';

export default function AdminTablesPage() {
  const restaurantId = 'rest_faro_demo';
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await api.getTables(restaurantId);
        setTables(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [restaurantId]);

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div className="flex-1 bg-navy-950 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10 no-print">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Panel
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Códigos QR de Mesas</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Imprime o comparte los códigos QR para que los comensales accedan directamente a la carta de su mesa.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePrintAll}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir Todos los QRs
          </button>
        </div>
      </div>

      {/* Grid of Tables */}
      <div className="mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map((table) => (
            <QRCodeCard
              key={table.id}
              tableNumber={table.table_number}
              restaurantId={restaurantId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
