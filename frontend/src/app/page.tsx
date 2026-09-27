import Link from 'next/link';
import { Flame, Sparkles, QrCode, Bell, ChefHat, LayoutDashboard, Bot, Zap, Database, Lock, ArrowRight, ShieldCheck, FileText } from 'lucide-react';

export default function HomePage() {
  const roles = [
    {
      title: 'Menú Interactivo Comensal',
      subtitle: 'Acceso QR desde la mesa • Sin descargas ni registro',
      description: 'Carta digital con fotos en alta definición, filtros Sin TACC/Vegano, carrito de mesa y asistente sommelier Faro AI con Function Calling.',
      icon: QrCode,
      href: '/menu/rest_faro_demo?mesa=3',
      badge: 'Cliente en Mesa 3',
      color: 'from-amber-500/20 to-faro-600/20 border-faro-500/40 text-faro-400',
      btnText: 'Abrir Menú de Comensal',
    },
    {
      title: 'Panel del Mozo en Salón',
      subtitle: 'Validación y confirmación en tiempo real',
      description: 'El mozo recibe las alertas de los comensales, revisa pedidos, valida aclaraciones especiales en la mesa y confirma el despacho inmediato a cocina.',
      icon: Bell,
      href: '/waiter',
      badge: 'Personal de Salón',
      color: 'from-blue-500/20 to-indigo-600/20 border-blue-500/40 text-blue-400',
      btnText: 'Abrir App de Mozos',
    },
    {
      title: 'Cocina en Vivo (KDS)',
      subtitle: 'Kitchen Display System con WebSockets',
      description: 'Pantalla de cocina que recibe los pedidos aprobados instantáneamente con sonido de comanda, control de tiempos de cocción y cambio de estados.',
      icon: ChefHat,
      href: '/kitchen',
      badge: 'Pantalla de Cocina',
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-400',
      btnText: 'Abrir Monitor KDS',
    },
    {
      title: 'Panel de Gestión del Dueño',
      subtitle: 'IA Multimodal • Métricas • Gestión Multi-tenant',
      description: 'Digitalización de cartas físicas subiendo foto o PDF con Google Gemini (Structured Outputs), métricas de ventas y generación de códigos QR por mesa.',
      icon: LayoutDashboard,
      href: '/admin',
      badge: 'Administración',
      color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-400',
      btnText: 'Ingresar al Dashboard',
    },
  ];

  const techStack = [
    { name: 'Google Gemini', detail: 'IA Multimodal OCR + Function Calling', icon: Bot, color: 'text-amber-400' },
    { name: 'FastAPI (Python)', detail: 'API Contenerizada + WebSockets en vivo', icon: Zap, color: 'text-emerald-400' },
    { name: 'Next.js 14 & Tailwind', detail: 'Frontend interactivo optimizado para Cloud', icon: Sparkles, color: 'text-cyan-400' },
    { name: 'Supabase (PostgreSQL)', detail: 'Base de datos relacional y storage de fotos', icon: Database, color: 'text-teal-400' },
    { name: 'Clerk Auth', detail: 'Gestión Multi-tenant y roles dueño/mozo', icon: Lock, color: 'text-purple-400' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-navy-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-faro-600/15 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-faro-400 mb-6">
            <Flame className="w-4 h-4 text-faro-500" />
            <span>UTN FRLP • Desarrollo de Software Cloud 2026</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            La plataforma inteligente que conecta{' '}
            <span className="bg-gradient-to-r from-faro-400 via-amber-300 to-faro-500 bg-clip-text text-transparent">
              Comensales, Mozos y Cocina
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Faro transforma la experiencia gastronómica: digitaliza cartas físicas en segundos con <strong>IA Multimodal (Gemini)</strong>, asesora a los comensales mediante <strong>Function Calling</strong> y sincroniza comandas en tiempo real con <strong>WebSockets</strong>.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/menu/rest_faro_demo?mesa=3"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-faro-600 to-faro-500 hover:from-faro-500 hover:to-faro-400 text-white font-bold text-sm shadow-xl shadow-faro-600/30 transition-all hover:scale-105"
            >
              <QrCode className="w-5 h-5" />
              Probar Menú Comensal (Mesa 3)
            </Link>

            <Link
              href="/admin/menu"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-sm transition-all hover:border-faro-500/50"
            >
              <FileText className="w-5 h-5 text-faro-400" />
              Subir Carta PDF/Foto con IA
            </Link>
          </div>
        </div>
      </section>

      {/* Role Navigation Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Explora los 4 Módulos de la Plataforma Faro
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Cada rol diseñado a medida para optimizar los tiempos y eliminar fricciones en el restaurante.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl p-6 sm:p-8 bg-navy-900/60 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br border ${role.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-faro-400 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-xs font-semibold text-faro-400/90 mt-0.5">{role.subtitle}</p>

                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <Link
                    href={role.href}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-faro-600 text-white text-sm font-bold transition-all group-hover:bg-faro-600 shadow-md"
                  >
                    <span>{role.btnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cloud Tech Stack Section */}
      <section className="py-16 bg-navy-900/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-white">Arquitectura Cloud y Tecnologías</h3>
            <p className="text-slate-400 text-xs mt-1">Cumplimiento de los requisitos técnicos del Hito 1</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-navy-950 border border-white/10 flex flex-col items-center text-center space-y-2"
                >
                  <Icon className={`w-8 h-8 ${tech.color}`} />
                  <h4 className="font-bold text-sm text-white">{tech.name}</h4>
                  <p className="text-xs text-slate-400 leading-snug">{tech.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-navy-950 text-center text-xs text-slate-500">
        <p>Faro - Plataforma Gastronómica Cloud • UTN FRLP 2026</p>
        <p className="mt-1">Sixto Javier Castro Cope (Legajo 32797) • Esteban Suarez (Legajo 28077)</p>
      </footer>
    </div>
  );
}
