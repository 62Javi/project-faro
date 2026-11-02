'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  Flame,
  ArrowRight,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Store,
  Bell,
  ChefHat,
  User,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const initialMode = searchParams.get('mode') === 'register' || pathname === '/register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'dueño' | 'mozo' | 'cocina' | null>(null);

  // Synchronize mode if searchParams or route change
  useEffect(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'register' || pathname === '/register') {
      setMode('register');
    } else if (urlMode === 'login') {
      setMode('login');
    }
  }, [searchParams, pathname]);

  const handleLogin = (e?: React.FormEvent, directRole?: 'dueño' | 'mozo' | 'cocina') => {
    if (e) e.preventDefault();
    setIsLoading(true);

    const targetRole =
      directRole ||
      selectedRole ||
      (email.toLowerCase().includes('mozo')
        ? 'mozo'
        : email.toLowerCase().includes('cocina')
        ? 'cocina'
        : 'dueño');

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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Registro simulado exitoso: el dueño entra directamente al panel administrativo
      router.push('/admin');
    }, 800);
  };

  const handleQuickRole = (role: 'dueño' | 'mozo' | 'cocina', demoEmail: string) => {
    setSelectedRole(role);
    setEmail(demoEmail);
    setPassword('••••••••••••');
    handleLogin(undefined, role);
  };

  return (
    <div className="flex-1 bg-white min-h-screen flex flex-col lg:flex-row overflow-hidden">
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

                {/* Dynamic Light Accent Line */}
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
        <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-400 font-normal">
          <span>&copy; {new Date().getFullYear()} Faro Technologies</span>
          <span>Privacidad &middot; Términos</span>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: SLEEK MOBBIN FORM (WITH SLIDE-IN CHOREOGRAPHY)
      ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white animate-slideRight overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-1.5 rounded-full hover:bg-neutral-100"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al inicio</span>
          </Link>

          <span className="text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200/60">
            Faro ID &middot; SSO
          </span>
        </div>

        {/* Center Form Card */}
        <div className="my-auto max-w-sm w-full mx-auto py-8">
          {/* Segmented Mode Selector Capsule */}
          <div className="flex p-1 bg-neutral-100/90 rounded-full mb-8 border border-neutral-200/60">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 font-medium'
              }`}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 font-medium'
              }`}
            >
              Registrar restaurante
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              {mode === 'login' ? 'Iniciar sesión' : 'Crear restaurante'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
              {mode === 'login'
                ? 'Ingresá con tu cuenta para acceder a tu estación de trabajo.'
                : 'Empezá a operar con cartas QR, mozos y cocina en tiempo real sin tarjeta de crédito.'}
            </p>
          </div>

          {/* MODE 1: LOGIN FORM */}
          {mode === 'login' ? (
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
          ) : (
            /* MODE 2: REGISTER FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Nombre del restaurante
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Ej: Parrilla Don Julio"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100/70 border border-transparent focus:border-neutral-300 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Tu nombre y apellido
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Javier López"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100/70 border border-transparent focus:border-neutral-300 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dueño@tu-restaurante.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-neutral-100/70 border border-transparent focus:border-neutral-300 focus:bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Contraseña segura
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-full bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-xs active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-neutral-300" />
                      <span>Creando tu espacio...</span>
                    </>
                  ) : (
                    <>
                      <span>Registrar restaurante gratis</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Guarantees pill */}
              <div className="flex items-center justify-center gap-2 pt-3 text-[11px] text-neutral-500 font-normal">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
                <span>14 días de prueba gratis &middot; Sin tarjeta de crédito</span>
              </div>
            </form>
          )}
        </div>

        {/* Footer switch prompt */}
        <div className="text-center pt-6 border-t border-neutral-100 text-xs text-neutral-400">
          {mode === 'login' ? (
            <>
              <span>¿Aún no tenés cuenta? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-neutral-900 font-semibold hover:underline"
              >
                Registrar restaurante gratis
              </button>
            </>
          ) : (
            <>
              <span>¿Ya tenés cuenta creada? </span>
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-neutral-900 font-semibold hover:underline"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
