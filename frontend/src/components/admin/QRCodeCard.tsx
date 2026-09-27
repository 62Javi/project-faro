'use client';

import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink, Printer } from 'lucide-react';
import Link from 'next/link';

interface QRCodeCardProps {
  tableNumber: number;
  restaurantId: string;
}

export function QRCodeCard({ tableNumber, restaurantId }: QRCodeCardProps) {
  const tableMenuUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/menu/${restaurantId}?mesa=${tableNumber}`
    : `http://localhost:3000/menu/${restaurantId}?mesa=${tableNumber}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-navy-900 border border-white/10 rounded-2xl p-5 flex flex-col items-center justify-between text-center group hover:border-faro-500/50 transition-all">
      <div className="w-full flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 rounded-lg bg-faro-500/20 text-faro-400 text-xs font-bold border border-faro-500/30">
          Mesa #{tableNumber}
        </span>
        <Link
          href={`/menu/${restaurantId}?mesa=${tableNumber}`}
          target="_blank"
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          title="Abrir menú de comensal"
        >
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {/* QR Render */}
      <div className="p-4 bg-white rounded-2xl shadow-inner mb-4">
        <QRCodeSVG
          value={tableMenuUrl}
          size={140}
          fgColor="#0a0f1d"
          bgColor="#ffffff"
          level="H"
          includeMargin={false}
        />
      </div>

      <p className="text-xs text-slate-400 mb-4 max-w-[180px]">
        Escanea con la cámara del celular para ver la carta y pedir
      </p>

      <div className="w-full pt-3 border-t border-white/10 flex gap-2">
        <Link
          href={`/menu/${restaurantId}?mesa=${tableNumber}`}
          target="_blank"
          className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1"
        >
          Probar Mesa
        </Link>
      </div>
    </div>
  );
}
