'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, Utensils, Bell, ChefHat, LayoutDashboard, QrCode } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Inicio', icon: Flame },
    { href: '/menu/rest_faro_demo?mesa=3', label: 'Menú Comensal (QR)', icon: Utensils },
    { href: '/waiter', label: 'Mozo (Salón)', icon: Bell },
    { href: '/kitchen', label: 'Cocina (KDS)', icon: ChefHat },
    { href: '/admin', label: 'Panel Dueño', icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-faro-500 to-faro-700 flex items-center justify-center text-white shadow-lg shadow-faro-600/30 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider text-white">FARO</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-faro-500/20 text-faro-400 border border-faro-500/30">
              Cloud & AI 2026
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href.includes('menu') && pathname.startsWith('/menu'));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-faro-600 text-white shadow-md shadow-faro-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
