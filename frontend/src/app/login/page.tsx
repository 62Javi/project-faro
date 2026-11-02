'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Flame, ArrowRight, Loader2, Lock, Mail, Eye, EyeOff, Store, Bell, ChefHat, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'dueño' | 'mozo' | 'cocina' | null>(null);

  const handleLogin = (e?: React.FormEvent, directRole?: 'dueño' | 'mozo' | 'cocina') => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const targetRole = directRole || selectedRole || (
      email.toLowerCase().includes('mozo') ? 'mozo' :
      email.toLowerCase().includes('cocina') ? 'cocina' : 'dueño'
    );

    setTimeout(() => {
      if (targetRole === 'mozo') {
        router.push('/waiter');
      } else if (targetRole === 'cocina') {
        router.push('/kitchen');
      } else {
        router.push('/admin');
      }
    }, 700);
  };

  const handleQuickRole = (role: 'dueño' | 'mozo' | 'cocina', demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('••••••••••••');
    handleLogin(undefined, role);
  };

  return (
    <div className="flex-1 bg-white min-h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden">
      {/* =========================================================================
          LEFT PANEL: INCREASE-INSPIRED ISOMETRIC 3D SCULPTURE
      ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#F6F7F9] border-r border-neutral-200/70 p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Ambient subtle light glow */}
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-neutral-200/50 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-neutral-900">FARO</span>
          </Link>
          <span className="text-[11px] font-mono text-neutral-400">
            build.2026.04
          </span>
        </div>

        {/* Center: The Isometric Faro 3D Beacon Sculpture */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center py-10">
          <div className="w-72 h-72 sm:w-80 sm:h-80 relative flex items-center justify-center perspective-[1200px]">
            {/* 3D Geometric Ribbon Assembly */}
            <div className="w-full h-full relative animate-isometric flex items-center justify-center">
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full filter drop-shadow-[0_24px_36px_rgba(0,0,0,0.12)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle Monochrome & Platinum Gradients with minimal specular reflection */}
                  <linearGradient id="facet1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#18181B" />
                    <stop offset="100%" stopColor="#27272A" />
                  </linearGradient>
                  <linearGradient id="facet2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#27272A" />
                    <stop offset="100%" stopColor="#3F3F46" />
                  </linearGradient>
                  <linearGradient id="facet3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3F3F46" />
                    <stop offset="100%" stopColor="#52525B" />
                  </linearGradient>
                  <linearGradient id="facet4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#52525B" />
                    <stop offset="100%" stopColor="#71717A" />
                  </linearGradient>
                  <linearGradient id="facetHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A1A1AA" />
                    <stop offset="100%" stopColor="#E4E4E7" />
                  </linearGradient>
                  <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#09090B" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#27272A" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                {/* Isometric Zigzag Ribbon Faces (Increase-Style Geometric Prism) */}
                {/* Segment 1: Base Pillar */}
                <polygon points="50,230 110,260 110,170 50,140" fill="url(#facet1)" />
                <polygon points="110,260 170,230 170,140 110,170" fill="url(#facet2)" />
                <polygon points="50,140 110,170 170,140 110,110" fill="url(#facetHighlight)" opacity="0.9" />

                {/* Segment 2: Ascending Ribbon Step */}
                <polygon points="110,170 170,140 230,170 170,200" fill="url(#facet2)" />
                <polygon points="170,200 230,170 230,80 170,110" fill="url(#facet3)" />
                <polygon points="110,170 170,200 170,110 110,80" fill="url(#facet1)" />

                {/* Segment 3: Crown Beacon Prism */}
                <polygon points="170,110 230,80 290,110 230,140" fill="url(#facetHighlight)" />
                <polygon points="230,140 290,110 290,200 230,230" fill="url(#facet4)" />
                <polygon points="170,110 230,140 230,230 170,200" fill="url(#facet2)" />

                {/* Dynamic Light Accent Line (Increase Laser Precision) */}
                <line x1="50" y1="140" x2="290" y2="110" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.75" />
              </svg>
            </div>
          </div>

          <div className="mt-8 text-center max-w-sm">
            <h3 className="text-xl font-bold tracking-tight text-neutral-900">
              Operación sincronizada en vivo
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Comandas, auditoría de salón y monitor KDS de cocina coordinados con latencia inferior a 10ms.
            </p>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>UTN FRLP &middot; Software Cloud</span>
          <span>FastAPI + WebSockets + Next.js</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: SLEEK MOBBIN FORM (WITH SLIDE-IN CHOREOGRAPHY)
      ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white animate-slideRight">
        {/* Top bar back link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5"
          >
            &larr; Volver al inicio
          </Link>

          <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
            Faro ID &middot; SSO
          </span>
        </div>

        {/* Center Form Card */}
        <div className="my-auto max-w-sm w-full mx-auto py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Iniciar sesión
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
              Ingresá con tu cuenta para acceder a tu estación de trabajo.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@restaurante.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100/70 border border-transparent focus:border-neutral-300 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-700">
                  Contraseña
                </label>
                <a href="#" className="text-[11px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors">
                  ¿Olvidaste tu clave?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-full bg-neutral-100/70 border border-transparent focus:border-neutral-300 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-full bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Hairline Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-100" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold">
              <span className="bg-white px-3 text-neutral-400 tracking-wider">
                Acceso Rápido Demo (Cátedra UTN)
              </span>
            </div>
          </div>

          {/* Quick Role Tester Pills */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickRole('dueño', 'dueño@faro.app')}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-neutral-50/80 hover:bg-neutral-100 border border-neutral-200/60 hover:border-neutral-300 transition-all text-center group active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200/80 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-800 transition-colors shadow-2xs">
                <Store className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-neutral-800 leading-none">Dueño</span>
              <span className="text-[9px] text-neutral-400">/admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('mozo', 'mozo1@faro.app')}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-neutral-50/80 hover:bg-neutral-100 border border-neutral-200/60 hover:border-neutral-300 transition-all text-center group active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200/80 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-800 transition-colors shadow-2xs">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-neutral-800 leading-none">Mozo</span>
              <span className="text-[9px] text-neutral-400">/waiter</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('cocina', 'cocina@faro.app')}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-neutral-50/80 hover:bg-neutral-100 border border-neutral-200/60 hover:border-neutral-300 transition-all text-center group active:scale-95"
            >
              <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200/80 group-hover:bg-neutral-900 group-hover:text-white flex items-center justify-center text-neutral-800 transition-colors shadow-2xs">
                <ChefHat className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-semibold text-neutral-800 leading-none">Cocina</span>
              <span className="text-[9px] text-neutral-400">/kitchen</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6 border-t border-neutral-100 text-xs text-neutral-400">
          <span>¿Aún no tenés cuenta? </span>
          <Link href="/#precios" className="text-neutral-900 font-semibold hover:underline">
            Ver planes disponibles
          </Link>
        </div>
      </div>
    </div>
  );
}
