'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  Flame,
  Sparkles,
  QrCode,
  Bell,
  ChefHat,
  LayoutDashboard,
  Bot,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  CheckCircle2,
  Clock,
  HelpCircle,
  FileUp,
  Check,
  ChevronDown,
  Store,
  Plus,
  ShoppingBag,
  ExternalLink,
  Volume2,
  Send,
  Eye,
  Layers,
  Award,
  Sliders,
  DollarSign,
  Utensils,
  Wine,
  Printer,
  RefreshCw,
  Cpu,
  ArrowUpRight,
  User
} from 'lucide-react';

export default function HomePage() {
  // ================= STATE: UNIFIED LIVE SIMULATOR =================
  const [pipelineStep, setPipelineStep] = useState<1 | 2 | 3 | 4>(1);
  const [liveTicket, setLiveTicket] = useState<{
    id: string;
    mesa: number;
    plato: string;
    precio: number;
    tiempo: string;
    estado: 'comensal_enviando' | 'mozo_espera' | 'cocina_marchando' | 'plato_servido';
  }>({
    id: 'CMD-408',
    mesa: 4,
    plato: 'Ojo de Bife con Papas Trufadas + Malbec Reserva',
    precio: 38500,
    tiempo: '00:08',
    estado: 'mozo_espera'
  });
  const [simulatedFeedback, setSimulatedFeedback] = useState<string>('');

  // ================= STATE: AI SCANNER DEMO =================
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);

  // ================= STATE: AI SOMMELIER =================
  const [activeSommelierTab, setActiveSommelierTab] = useState(0);

  // ================= STATE: ROI CALCULATOR =================
  const [tableCount, setTableCount] = useState<number>(24);

  // ================= STATE: PRICING =================
  const [annualBilling, setAnnualBilling] = useState<boolean>(true);

  // ================= STATE: QR GENERATOR =================
  const [previewMesaNumber, setPreviewMesaNumber] = useState<number>(4);

  // ================= STATE: FAQ =================
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // --- Handlers: Interactive Live Pipeline ---
  const handleDinerOrder = () => {
    setPipelineStep(2);
    setLiveTicket({
      id: 'CMD-' + Math.floor(100 + Math.random() * 900),
      mesa: previewMesaNumber,
      plato: 'Bife de Chorizo a las Brasas + Ensalada Rúcula',
      precio: 29500,
      tiempo: '00:02',
      estado: 'mozo_espera'
    });
    setSimulatedFeedback('¡Comanda enviada desde el celular de Mesa #' + previewMesaNumber + '!');
  };

  const handleWaiterApprove = () => {
    setPipelineStep(3);
    setLiveTicket(prev => ({ ...prev, estado: 'cocina_marchando', tiempo: '00:15' }));
    setSimulatedFeedback('Mozo validó la comanda. Despachada a monitor KDS de cocina.');
  };

  const handleKitchenReady = () => {
    setPipelineStep(4);
    setLiveTicket(prev => ({ ...prev, estado: 'plato_servido', tiempo: 'Listo' }));
    setSimulatedFeedback('¡Plato listo para entrega! El mozo recibió aviso sonoro.');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 }
    });
  };

  const handleResetPipeline = () => {
    setPipelineStep(1);
    setLiveTicket({
      id: 'CMD-409',
      mesa: previewMesaNumber,
      plato: 'Ojo de Bife con Papas Trufadas',
      precio: 24500,
      tiempo: '00:00',
      estado: 'mozo_espera'
    });
    setSimulatedFeedback('');
  };

  // --- Handlers: AI OCR Scanner ---
  const handleTriggerScan = () => {
    setIsScanning(true);
    setScanCompleted(false);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);
    }, 1800);
  };

  // Sommelier Presets
  const sommelierPresets = [
    {
      title: 'Maridaje de Carnes',
      question: '¿Qué vino me recomiendas para el Bife de Chorizo a las brasas?',
      answer:
        'Para el Bife de Chorizo te sugiero nuestro Malbec Reserva Valle de Uco ($14.500). Su crianza en roble y taninos redondos equilibran la untuosidad y el ahumado de la carne.',
      highlightDish: 'Malbec Reserva Valle de Uco',
      price: '$ 14.500',
      tag: 'Maridaje Óptimo'
    },
    {
      title: 'Apto Celíacos (Sin TACC)',
      question: '¿Qué platos de la carta son 100% libres de gluten?',
      answer:
        'Contamos con Salmón Rosado con Puré de Coliflor ($28.000) y Risotto de Hongos Portobello ($19.200), ambos elaborados en cocina aislada bajo certificación Sin TACC.',
      highlightDish: 'Salmón Rosado con Puré de Coliflor',
      price: '$ 28.000',
      tag: 'Certificado Sin TACC'
    },
    {
      title: 'Opciones Veganas',
      question: '¿Tienen opciones vegetarianas o veganas para cenar?',
      answer:
        'Te recomiendo la Cazuela de Vegetales Asados y Quinoa Real ($16.800) servida con crema de palta y hierbas frescas.',
      highlightDish: 'Cazuela de Vegetales Asados & Quinoa',
      price: '$ 16.800',
      tag: '100% Plant-Based'
    }
  ];

  // FAQs
  const faqs = [
    {
      q: '¿Cómo funciona el código QR en un restaurante real? ¿Está hardcodeado?',
      a: 'No. En producción, cada restaurante genera desde su panel administrativo códigos QR vectoriales con la URL firmada de su salón (ejemplo: faro.app/menu/don-julio?mesa=14). Cuando el comensal escanea el QR con su cámara nativa, el sistema reconoce la mesa y el local de inmediato sin necesidad de descargas, logins ni formularios.'
    },
    {
      q: '¿El comensal tiene que instalar una aplicación en su smartphone?',
      a: 'Nunca. Faro es 100% web progresiva (PWA ultra liviana). Carga en menos de 400 milisegundos en cualquier navegador móvil (iOS Safari, Android Chrome). Los clientes tienen aversión a instalar aplicaciones solo para comer; con Faro acceden instantáneamente.'
    },
    {
      q: '¿Cómo digitalizo una carta física si tengo un menú impreso en papel?',
      a: 'Solo le tomas una foto a la hoja con el celular o subes un archivo PDF. Nuestro motor de IA con Google Gemini 3.8 Flash analiza la imagen con Structured Outputs, identificando platos, categorías, precios y alérgenos en menos de 10 segundos, listos para editar.'
    },
    {
      q: '¿El pedido va directo a la cocina o el mozo lo supervisa?',
      a: 'Tú decides la política de tu restaurante. El modo recomendado cuenta con doble validación: la comanda llega al teléfono del mozo responsable del sector, quien la confirma con un toque o agrega aclaraciones antes de despacharla a la pantalla KDS de cocina.'
    },
    {
      q: '¿Qué ocurre si se corta la conexión a internet en el restaurante?',
      a: 'La arquitectura es Local-First y de degradación elegante: los carritos se almacenan localmente en los dispositivos y el backend en Google Cloud Run mantiene sincronización transaccional continua. Si hay microcortes, las órdenes se reintentan sin pérdida de información.'
    }
  ];

  // Estimated ROI Calculations
  const monthlyPaperExpense = tableCount * 12000; // impresión y roturas
  const hoursSavedPerWeek = Math.round(tableCount * 0.75);
  const extraRevenuePerMonth = tableCount * 32000;

  return (
    <div className="flex-1 flex flex-col bg-[#FAFAFA] text-neutral-900 overflow-x-hidden selection:bg-neutral-900 selection:text-white">
      {/* =========================================================================
          HERO SECTION: MOBBIN-INSPIRED EDITORIAL
      ========================================================================= */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden border-b border-neutral-200/70 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 shadow-xs text-xs font-medium text-neutral-800 mb-8 transition-all hover:border-neutral-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900"></span>
            </span>
            <span>Faro &middot; Plataforma de Operación Gastronómica</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 tracking-tight max-w-5xl mx-auto leading-[1.08]">
            El sistema operativo gastronómico que sincroniza{' '}
            <span className="underline decoration-neutral-300 decoration-wavy decoration-2 underline-offset-8">
              mesas, mozos y cocina
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed font-normal">
            Digitalizá tu carta gastronómica con estética cuidada. Menús QR dinámicos, sommelier con Inteligencia Artificial multimodal y comandas en tiempo real vía WebSockets sin descargas para los comensales.
          </p>

          {/* Action CTAs: Registrarse & Iniciar Sesión */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
            <Link
              href="/login?mode=register"
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-neutral-900 hover:bg-black text-white font-medium text-sm shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-98"
            >
              <span>Registrarse gratis</span>
              <ArrowRight className="w-4 h-4 text-neutral-300" />
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/90 font-medium text-sm transition-all hover:border-neutral-300 active:scale-98 shadow-2xs"
            >
              <User className="w-4 h-4 text-neutral-500" />
              <span>Iniciar sesión</span>
            </Link>
          </div>

          {/* Real Benefits Metrics */}
          <div className="mt-14 pt-8 border-t border-neutral-200/70 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">+28%</p>
              <p className="text-xs text-neutral-500 mt-1 font-normal">Rotación en horas pico</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">&lt; 400ms</p>
              <p className="text-xs text-neutral-500 mt-1 font-normal">Carga sin instalar apps</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">0%</p>
              <p className="text-xs text-neutral-500 mt-1 font-normal">Comisiones por comanda</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">100%</p>
              <p className="text-xs text-neutral-500 mt-1 font-normal">Sincronización en vivo</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 1: UNIFIED LIVE RESTAURANT ECOSYSTEM (MOBBIN SIMULATOR)
      ========================================================================= */}
      <section id="ecosistema" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-medium tracking-wide uppercase text-neutral-600 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80">
            Laboratorio Interactivo en Vivo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mt-3 tracking-tight">
            Mirá cómo viaja la orden en tiempo real
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-2">
            Hacé clic en los botones de acción para avanzar el pedido desde la mesa del cliente hasta la cocina.
          </p>
        </div>

        {/* Unified Canvas Board */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden p-6 lg:p-8 transition-all duration-300">
          {/* Pipeline Progress Indicator */}
          <div className="mb-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  pipelineStep === 1
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                    : pipelineStep > 1
                    ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                    : 'bg-white border-neutral-200/70 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1 font-semibold">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>1. Comensal en Mesa</span>
                </div>
                <span className={`text-[10px] ${pipelineStep === 1 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Escaneo QR & Selección
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  pipelineStep === 2
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                    : pipelineStep > 2
                    ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                    : 'bg-white border-neutral-200/70 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1 font-semibold">
                  <Bell className="w-3.5 h-3.5" />
                  <span>2. Mozo en Salón</span>
                </div>
                <span className={`text-[10px] ${pipelineStep === 2 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Validación & Control
                </span>
              </div>

              <div
                className={`p-3 rounded-xl border transition-all duration-300 ${
                  pipelineStep === 3
                    ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                    : pipelineStep > 3
                    ? 'bg-neutral-100 border-neutral-200 text-neutral-800'
                    : 'bg-white border-neutral-200/70 text-neutral-400'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1 font-semibold">
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>3. Cocina KDS</span>
                </div>
                <span className={`text-[10px] ${pipelineStep === 3 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  Despacho en Marcha
                </span>
              </div>
            </div>

            {simulatedFeedback && (
              <div className="mt-4 p-2.5 rounded-full bg-neutral-100/90 border border-neutral-200/80 text-neutral-800 text-xs font-medium text-center animate-fadeIn flex items-center justify-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
                <span>{simulatedFeedback}</span>
              </div>
            )}
          </div>

          {/* Interactive 3-Panel Split Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
            {/* PANEL 1: DINER PHONE */}
            <div
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                pipelineStep === 1
                  ? 'border-neutral-900 ring-1 ring-neutral-900/10 bg-white shadow-md'
                  : 'border-neutral-200/80 bg-neutral-50/40 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-60"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900"></span>
                    </span>
                    <span className="text-xs font-semibold text-neutral-800">Mesa #{previewMesaNumber}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-100 font-medium text-neutral-600 border border-neutral-200/60 uppercase">
                    Móvil
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="p-3 bg-white rounded-xl border border-neutral-200/70 shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">Bife de Chorizo a las Brasas</p>
                      <p className="text-[11px] text-neutral-400">Punto: A punto &middot; Con papas</p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 tabular-nums">$24.500</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-neutral-200/70 shadow-xs flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">Malbec Reserva 750ml</p>
                      <p className="text-[11px] text-neutral-400">Valle de Uco</p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-900 tabular-nums">$14.000</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                <div className="flex justify-between text-xs font-medium text-neutral-600 mb-3">
                  <span>Total Comanda:</span>
                  <span className="text-sm font-bold text-neutral-900 tabular-nums">$38.500</span>
                </div>

                <button
                  onClick={handleDinerOrder}
                  disabled={pipelineStep !== 1}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    pipelineStep === 1
                      ? 'bg-neutral-900 hover:bg-black text-white shadow-xs active:scale-98'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200/60 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Pedido a Cocina</span>
                </button>
              </div>
            </div>

            {/* PANEL 2: WAITER TABLET */}
            <div
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                pipelineStep === 2
                  ? 'border-neutral-900 ring-1 ring-neutral-900/10 bg-white shadow-md'
                  : 'border-neutral-200/80 bg-neutral-50/40 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-neutral-700" />
                    <span className="text-xs font-semibold text-neutral-800">Terminal Mozo Salón</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-100 font-medium text-neutral-600 border border-neutral-200/60 uppercase">
                    Salón
                  </span>
                </div>

                <div className="mt-4">
                  {pipelineStep >= 2 ? (
                    <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-xs space-y-2 animate-ticket">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-neutral-900">{liveTicket.id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-medium border border-neutral-200/60">
                          {pipelineStep === 2 ? 'Revisión Requerida' : 'Aprobado'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-800">Mesa #{liveTicket.mesa}</p>
                      <p className="text-xs text-neutral-600 leading-snug">{liveTicket.plato}</p>
                      <p className="text-[11px] text-neutral-400 tabular-nums">Total: ${liveTicket.precio.toLocaleString('es-AR')}</p>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-neutral-400 text-xs border border-dashed border-neutral-200 rounded-xl">
                      Esperando que el comensal envíe un pedido...
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                <button
                  onClick={handleWaiterApprove}
                  disabled={pipelineStep !== 2}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    pipelineStep === 2
                      ? 'bg-neutral-900 hover:bg-black text-white shadow-xs active:scale-98'
                      : 'bg-neutral-100 text-neutral-400 border border-neutral-200/60 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Validar y Despachar a Cocina</span>
                </button>
              </div>
            </div>

            {/* PANEL 3: KITCHEN KDS */}
            <div
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                pipelineStep === 3
                  ? 'border-neutral-900 ring-1 ring-neutral-900/10 bg-white shadow-md'
                  : 'border-neutral-200/80 bg-neutral-50/40 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <ChefHat className="w-3.5 h-3.5 text-neutral-700" />
                    <span className="text-xs font-semibold text-neutral-800">Monitor KDS Cocina</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-neutral-100 font-medium text-neutral-600 border border-neutral-200/60 uppercase">
                    Cocina Caliente
                  </span>
                </div>

                <div className="mt-4">
                  {pipelineStep >= 3 ? (
                    <div className="p-3.5 bg-white rounded-xl border border-neutral-200/80 shadow-xs space-y-2 animate-ticket">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-neutral-900">{liveTicket.id}</span>
                        <span className="text-[11px] font-mono font-medium text-neutral-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" /> {liveTicket.tiempo}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-800">Mesa #{liveTicket.mesa}</p>
                      <p className="text-xs text-neutral-600 leading-snug">{liveTicket.plato}</p>
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                          {pipelineStep === 4 ? 'Plato Listo' : 'Marchando a Fuego'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-neutral-400 text-xs border border-dashed border-neutral-200 rounded-xl">
                      Comanda en espera de validación de salón...
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                {pipelineStep === 4 ? (
                  <button
                    onClick={handleResetPipeline}
                    className="w-full py-2.5 px-4 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center gap-2 transition-all border border-neutral-200/70"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reiniciar Simulación</span>
                  </button>
                ) : (
                  <button
                    onClick={handleKitchenReady}
                    disabled={pipelineStep !== 3}
                    className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      pipelineStep === 3
                        ? 'bg-neutral-900 hover:bg-black text-white shadow-xs active:scale-98'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200/60 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Marcar Plato Listo para Servir</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CÓMO FUNCIONA EL SISTEMA QR (REAL SAAS WORKFLOW)
      ========================================================================= */}
      <section id="ciclo-qr" className="py-20 bg-white border-y border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Explanation */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-medium tracking-wide uppercase text-neutral-600 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80">
                Arquitectura de Código QR Dinámico
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                ¿Cómo funciona el QR en tu restaurante?
              </h2>
              <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed">
                A diferencia de los PDFs estáticos que obligan a hacer zoom incómodo, cada mesa de tu restaurante tiene un código QR vectorial único generado automáticamente por Faro.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-xs shrink-0 mt-0.5 shadow-xs">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">El dueño genera e imprime el QR de cada mesa</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Desde el Panel Dueño podés descargar un PDF listo para imprimir en madera, acrílico o calcos con el logo de tu local.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-xs shrink-0 mt-0.5 shadow-xs">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">El comensal escanea con la cámara nativa</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Sin logins ni aplicaciones. La URL contiene la clave de mesa cifrada: <code>faro.app/menu/resto?mesa=4</code>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-xs shrink-0 mt-0.5 shadow-xs">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">Comanda directa a mozo y cocina por WebSockets</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      El pedido viaja con latencia inferior a 10ms y se imprime o muestra en la estación de cocina correspondiente.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Live Interactive QR Test Card */}
            <div className="lg:col-span-6 bg-neutral-50/60 p-8 rounded-2xl border border-neutral-200/80 shadow-xs text-center">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                Generador de Mesa en Tiempo Real
              </p>
              <h3 className="text-xl font-bold text-neutral-900 tracking-tight">
                Seleccioná una mesa para generar su QR:
              </h3>

              {/* Table Buttons */}
              <div className="flex flex-wrap justify-center gap-2 my-5">
                {[1, 2, 4, 7, 12, 18].map(mesa => (
                  <button
                    key={mesa}
                    onClick={() => setPreviewMesaNumber(mesa)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      previewMesaNumber === mesa
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    Mesa #{mesa}
                  </button>
                ))}
              </div>

              {/* QR Display Card */}
              <div className="inline-block p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-xs relative group">
                <div className="w-44 h-44 flex items-center justify-center mx-auto">
                  <QRCodeSVG
                    value={`http://localhost:3000/menu/rest_faro_demo?mesa=${previewMesaNumber}`}
                    size={170}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-400 font-mono">
                  URL: /menu/rest_faro_demo?mesa={previewMesaNumber}
                </div>
              </div>

              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href={`/menu/rest_faro_demo?mesa=${previewMesaNumber}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Carta de Mesa #{previewMesaNumber}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: AI DEMO (GEMINI 3.8 FLASH VISION OCR + SOMMELIER)
      ========================================================================= */}
      <section id="ia-gemini" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-medium tracking-wide uppercase text-neutral-600 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80">
            Inteligencia Artificial Multimodal
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mt-3 tracking-tight">
            Google Gemini 3.8 Flash al servicio de tu salón
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-2">
            Digitalización de cartas físicas en segundos y asesoramiento en mesa mediante Function Calling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* AI TOOL 1: OCR Scanner Simulator */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200/60 flex items-center justify-center">
                    <FileUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">Digitalizador OCR con Gemini</h3>
                    <p className="text-[11px] text-neutral-400">Structured Outputs directo a base de datos</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  Modelo 3.8 Flash
                </span>
              </div>

              {/* Scanner Screen Box */}
              <div className="mt-5 relative h-48 rounded-xl bg-[#09090b] border border-neutral-800 overflow-hidden flex items-center justify-center p-4">
                {/* Laser scan line */}
                {isScanning && (
                  <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-scan z-20" />
                )}

                {!scanCompleted ? (
                  <div className="text-center text-neutral-300 space-y-1.5 z-10">
                    <p className="text-xs font-mono font-medium text-neutral-200">Carta_Fisica_Salon_2026.jpg</p>
                    <p className="text-[11px] text-neutral-400">
                      {isScanning ? 'Procesando visión multimodal...' : 'Presioná para simular escaneo de carta'}
                    </p>
                  </div>
                ) : (
                  <div className="w-full text-left font-mono text-[11px] text-neutral-300 space-y-1 z-10 animate-fadeIn">
                    <p className="text-neutral-100 font-semibold">✓ Menú extraído con éxito (Structured Output):</p>
                    <p className="text-neutral-400">&bull; Bife de Chorizo &mdash; $24.500 [Carnes]</p>
                    <p className="text-neutral-400">&bull; Trucha Patagónica &mdash; $28.000 [Pescados]</p>
                    <p className="text-neutral-400">&bull; Ensalada Faro Sin TACC &mdash; $12.500 [Entradas]</p>
                    <p className="text-neutral-200 font-semibold mt-1">3 categorías &middot; 14 platos creados</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-xs text-neutral-400">Tiempo de extracción: ~2.1 seg</span>
              <button
                onClick={handleTriggerScan}
                disabled={isScanning}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-black text-white shadow-xs transition-all active:scale-95"
              >
                {isScanning ? 'Extrayendo...' : 'Simular Foto y Escaneo'}
              </button>
            </div>
          </div>

          {/* AI TOOL 2: Virtual Sommelier Simulator */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-7 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-200/60 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">Sommelier Virtual en Mesa</h3>
                    <p className="text-[11px] text-neutral-400">Responde dudas de clientes con precios reales</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                  Function Calling
                </span>
              </div>

              {/* Preset Chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {sommelierPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSommelierTab(index)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                      activeSommelierTab === index
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100/80 hover:bg-neutral-200/70 text-neutral-600'
                    }`}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>

              {/* Chat Bubble simulation */}
              <div className="mt-4 p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/70 space-y-2.5">
                <div className="text-xs text-neutral-800 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                  <span>Comensal pregunta:</span>
                </div>
                <p className="text-xs text-neutral-500 italic">
                  &ldquo;{sommelierPresets[activeSommelierTab].question}&rdquo;
                </p>

                <div className="pt-2 border-t border-neutral-200/60">
                  <span className="text-[10px] font-semibold uppercase text-neutral-700 px-2 py-0.5 rounded-full bg-neutral-200/70 inline-block">
                    Faro AI Sommelier
                  </span>
                  <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed">
                    {sommelierPresets[activeSommelierTab].answer}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Validación de stock: En servidor</span>
              <span className="font-semibold text-neutral-800">
                {sommelierPresets[activeSommelierTab].tag}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: ROI CALCULATOR (TANGIBLE FINANCIAL BENEFIT FOR OWNERS)
      ========================================================================= */}
      <section id="calculadora" className="py-20 bg-neutral-50/50 border-t border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-neutral-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-medium tracking-wide uppercase text-neutral-600 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80">
                Calculadora de Impacto Financiero
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-3 tracking-tight">
                ¿Cuánto dinero y tiempo ahorrás con Faro?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Ajustá el control deslizante con la cantidad de mesas de tu local.
              </p>
            </div>

            {/* Slider Control */}
            <div className="mb-8 max-w-xl mx-auto text-center">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-semibold text-neutral-700">Capacidad del Salón:</span>
                <span className="text-lg font-bold text-neutral-900 tabular-nums">{tableCount} Mesas</span>
              </div>
              <input
                type="range"
                min="5"
                max="80"
                step="1"
                value={tableCount}
                onChange={e => setTableCount(Number(e.target.value))}
                className="slider-mobbin w-full h-2 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-1.5 font-mono">
                <span>5 mesas (Café)</span>
                <span>40 mesas (Restó medio)</span>
                <span>80 mesas (Gran salón)</span>
              </div>
            </div>

            {/* Dynamic Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-neutral-100 text-center">
              <div className="p-5 rounded-2xl bg-neutral-50/60 border border-neutral-200/70 hover:border-neutral-300 hover:bg-white hover:shadow-md transition-all duration-300 group">
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Ahorro en Cartas</p>
                <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums mt-1 tracking-tight">
                  ${monthlyPaperExpense.toLocaleString('es-AR')}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">por mes en impresión y mermas</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50/60 border border-neutral-200/70 hover:border-neutral-300 hover:bg-white hover:shadow-md transition-all duration-300 group">
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Horas Mozos Ahorradas</p>
                <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums mt-1 tracking-tight">
                  {hoursSavedPerWeek} hs
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">por semana en idas a la caja</p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50/60 border border-neutral-200/70 hover:border-neutral-300 hover:bg-white hover:shadow-md transition-all duration-300 group">
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Facturación Extra</p>
                <p className="text-2xl sm:text-3xl font-bold text-neutral-900 tabular-nums mt-1 tracking-tight">
                  +${extraRevenuePerMonth.toLocaleString('es-AR')}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">por mayor rotación de mesas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PLANES Y PRECIOS
      ========================================================================= */}
      <section id="precios" className="py-20 bg-white border-t border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-medium tracking-wide uppercase text-neutral-600 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80">
              Inversión Transparente
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mt-3 tracking-tight">
              Planes a medida de tu operación gastronómica
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-2">
              Sin comisiones por comanda ni costos ocultos. Todos los planes incluyen 14 días de prueba sin cargo.
            </p>

            {/* Billing switch */}
            <div className="mt-8 inline-flex items-center gap-1.5 p-1 rounded-full bg-neutral-100 border border-neutral-200/70">
              <button
                onClick={() => setAnnualBilling(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !annualBilling ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setAnnualBilling(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  annualBilling ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>Anual</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                  -20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
            {/* PLAN 1: CAFETERIA */}
            <div className="rounded-2xl border border-neutral-200/80 p-8 bg-white hover:border-neutral-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Cafetería & Bar</h3>
                <p className="text-xs text-neutral-500 mt-1">Ideal para locales de café, barras y comida rápida.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-neutral-900 tabular-nums">
                      {annualBilling ? '$ 23.200' : '$ 29.000'}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">/mes</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Facturado {annualBilling ? 'anualmente' : 'mensualmente'}</p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Hasta 15 mesas con códigos QR únicos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Carta digital interactiva con fotos en HD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Digitalización con IA (3 cartas/mes)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Terminal de mozos en salón</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Comenzar Prueba Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* PLAN 2: RESTAURANTE PRO (RECOMMENDED) */}
            <div className="rounded-2xl border-2 border-neutral-900 p-8 bg-white relative shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                Más Elegido por Restaurantes
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900">Restaurante Pro</h3>
                <p className="text-xs text-neutral-500 mt-1">Para salones completos con servicio de mesa y cocina caliente.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-neutral-900 tabular-nums">
                      {annualBilling ? '$ 47.200' : '$ 59.000'}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">/mes</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Facturado {annualBilling ? 'anualmente' : 'mensualmente'}</p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-xs text-neutral-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Mesas ilimitadas con QR descargable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Monitor de cocina KDS con aviso en vivo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Sommelier Virtual Faro AI en cada mesa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Digitalización ilimitada con Gemini 3.8 Flash</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Reportes de comanda y rotación diaria</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-full text-xs font-semibold bg-neutral-900 hover:bg-black text-white flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
                >
                  <span>Probar 14 Días Gratis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* PLAN 3: FRANQUICIAS */}
            <div className="rounded-2xl border border-neutral-200/80 p-8 bg-white hover:border-neutral-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between shadow-xs">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Franquicias & Cadenas</h3>
                <p className="text-xs text-neutral-500 mt-1">Para grupos con múltiples sucursales y gestión centralizada.</p>

                <div className="mt-6 mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-neutral-900">A Medida</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">Planes corporativos personalizados</p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Multi-sucursal con aislamiento estricto</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Integración con sistemas POS / Facturación</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>Capacitación y onboarding prioritario</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                    <span>SLA de disponibilidad garantizado 99.9%</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <Link
                  href="/admin"
                  className="w-full py-2.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-800 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Contactar Asesor Comercial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FAQ ACCORDION
      ========================================================================= */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-medium tracking-wide uppercase text-neutral-600 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80">
            Dudas Frecuentes
          </span>
          <h2 className="text-3xl font-bold text-neutral-900 mt-3 tracking-tight">
            Todo lo que necesitás saber antes de empezar
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center gap-4 hover:bg-neutral-50/50"
                >
                  <span className="text-xs sm:text-sm font-semibold text-neutral-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-neutral-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: BOTTOM CTA & FOOTER
      ========================================================================= */}
      <section className="py-16 bg-neutral-950 text-white relative overflow-hidden border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Empezá a transformar tu restaurante hoy mismo
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Configuración en 10 minutos. Sin contratos ni letra chica.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/admin"
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-98"
            >
              Crear Cuenta y Probar Gratis
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white border-t border-neutral-200/70 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-neutral-900" />
            <span className="font-semibold text-neutral-900">Faro SaaS Gastronómico</span>
            <span className="text-neutral-400">&middot; Operación gastronómica en tiempo real</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <Link href="/menu/rest_faro_demo?mesa=1" className="hover:text-neutral-900">
              Demo Comensal
            </Link>
            <Link href="/waiter" className="hover:text-neutral-900">
              App Mozos
            </Link>
            <Link href="/kitchen" className="hover:text-neutral-900">
              Cocina KDS
            </Link>
            <Link href="/admin" className="hover:text-neutral-900">
              Panel Dueño
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
