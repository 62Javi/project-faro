'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, User, Palette } from 'lucide-react';
import { FaroLogo } from '@/components/common/FaroLogo';

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // No mostrar la Navbar global en pantallas completas de autenticación (Login/Registro)
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
            <FaroLogo size={18} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-neutral-900">FARO</span>
            <span className="hidden sm:inline-block text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
              SaaS Gastronómico
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        {isHome ? (
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-500 tracking-normal">
            <a href="#ecosistema" className="hover:text-neutral-900 transition-colors">
              Simulador
            </a>
            <a href="#ciclo-qr" className="hover:text-neutral-900 transition-colors">
              Ciclo QR
            </a>
            <a href="#ia-gemini" className="hover:text-neutral-900 transition-colors">
              Sommelier IA
            </a>
            <a href="#calculadora" className="hover:text-neutral-900 transition-colors">
              Calculadora
            </a>
            <a href="#precios" className="hover:text-neutral-900 transition-colors">
              Planes
            </a>
            <a href="#faq" className="hover:text-neutral-900 transition-colors">
              FAQ
            </a>
            <Link href="/brand" className="hover:text-neutral-900 transition-colors flex items-center gap-1.5 text-neutral-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Logo SVG
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors"
            >
              &larr; Volver al Inicio
            </Link>
          </nav>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Botón directo Iniciar Sesión con Icono de Usuario */}
          <Link
            href="/login"
            className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-800 hover:text-neutral-950 hover:bg-neutral-50 transition-all border border-neutral-200/90 shadow-2xs active:scale-98"
          >
            <div className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700">
              <User className="w-3 h-3" />
            </div>
            <span className="hidden sm:inline">Iniciar sesión</span>
          </Link>

          <Link
            href="/login?mode=register"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-neutral-900 hover:bg-black text-white shadow-xs transition-all active:scale-98"
          >
            <span>Registrarse</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
