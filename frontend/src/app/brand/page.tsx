'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Eye, 
  Layers, 
  Smartphone, 
  QrCode, 
  Receipt, 
  ArrowLeft,
  Sparkles,
  Compass
} from 'lucide-react';

type LogoStyle = 'minimal' | 'architectural' | 'solid';

export default function BrandPage() {
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('minimal');
  const [bgMode, setBgMode] = useState<'light' | 'dark' | 'grid'>('light');
  const [copied, setCopied] = useState(false);

  // SVGs definitions
  const svgCodes: Record<LogoStyle, string> = {
    minimal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="currentColor">
  <!-- Faro Minimalista Suizo (Linear / Swiss High Precision) -->
  <path d="M50 14 V20 M42 28 C42 22 58 22 58 28 Z" fill="currentColor" stroke="none" />
  <rect x="42.5" y="28" width="15" height="10" rx="1.5" stroke="currentColor" stroke-width="2.5" fill="none" />
  <circle cx="50" cy="33" r="2.5" fill="currentColor" stroke="none" />
  <line x1="36" y1="38" x2="64" y2="38" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
  <path d="M41 40 L34 82 H66 L59 40 Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" fill="none" />
  <line x1="39" y1="54" x2="61" y2="54" stroke="currentColor" stroke-width="2.5" />
  <line x1="36.5" y1="68" x2="63.5" y2="68" stroke="currentColor" stroke-width="2.5" />
  <line x1="26" y1="84" x2="74" y2="84" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
  <path d="M58 31 L88 20 M58 35 L92 37 M58 37 L88 48" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.85" />
</svg>`,

    architectural: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="100%" height="100%" fill="none">
  <!-- Faro Arquitectónico Bicolor -->
  <defs>
    <linearGradient id="beamGradPage" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="currentColor" stop-opacity="0.3"/>
      <stop offset="60%" stop-color="currentColor" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="currentColor" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <polygon points="60,34 116,14 116,56" fill="url(#beamGradPage)" />
  <polygon points="60,34 4,14 4,56" fill="url(#beamGradPage)" transform="rotate(180 60 34)" opacity="0.5"/>
  <rect x="26" y="98" width="68" height="6" rx="3" fill="currentColor"/>
  <rect x="32" y="92" width="56" height="6" rx="2" fill="currentColor" opacity="0.8"/>
  <path d="M 39 46 L 81 46 L 86 92 L 34 92 Z" fill="currentColor" opacity="0.9"/>
  <path d="M 37.4 60 L 82.6 60 L 83.9 72 L 36.1 72 Z" fill="#FFFFFF" opacity="0.95"/>
  <rect x="58" y="50" width="4" height="7" rx="2" fill="#FFFFFF" opacity="0.85"/>
  <rect x="58" y="78" width="4" height="9" rx="2" fill="#FFFFFF" opacity="0.85"/>
  <rect x="32" y="42" width="56" height="4" rx="2" fill="currentColor"/>
  <path d="M 36 38 L 84 38" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="42" y1="38" x2="42" y2="42" stroke="currentColor" stroke-width="1.5"/>
  <line x1="50" y1="38" x2="50" y2="42" stroke="currentColor" stroke-width="1.5"/>
  <line x1="60" y1="38" x2="60" y2="42" stroke="currentColor" stroke-width="1.5"/>
  <line x1="70" y1="38" x2="70" y2="42" stroke="currentColor" stroke-width="1.5"/>
  <line x1="78" y1="38" x2="78" y2="42" stroke="currentColor" stroke-width="1.5"/>
  <rect x="42" y="27" width="36" height="11" rx="1.5" fill="currentColor" opacity="0.9"/>
  <rect x="46" y="28.5" width="28" height="8" rx="1" fill="#FFFFFF"/>
  <circle cx="60" cy="32.5" r="3.5" fill="currentColor"/>
  <circle cx="60" cy="32.5" r="1.5" fill="#FFFFFF"/>
  <path d="M 40 27 C 40 27, 44 16, 60 16 C 76 16, 80 27, 80 27 Z" fill="currentColor"/>
  <path d="M 60 10 L 60 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="60" cy="9.5" r="2" fill="currentColor"/>
</svg>`,

    solid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <!-- Faro Sólido Emblemático (Negative Space + Amber Beam) -->
  <defs>
    <linearGradient id="solidBeamPage" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path d="M 22 84 C 22 82.3 23.3 81 25 81 L 75 81 C 76.7 81 78 82.3 78 84 C 78 85.7 76.7 87 75 87 L 25 87 C 23.3 87 22 85.7 22 84 Z" fill="currentColor"/>
  <path d="M 33 80 L 35 70 L 65 70 L 67 80 Z" fill="currentColor"/>
  <path d="M 36.5 66 L 39 54 L 61 54 L 63.5 66 Z" fill="currentColor"/>
  <path d="M 40.5 50 L 42.5 40 L 57.5 40 L 59.5 50 Z" fill="currentColor"/>
  <rect x="34" y="37" width="32" height="3" rx="1.5" fill="currentColor"/>
  <rect x="42" y="27" width="16" height="10" rx="1.5" fill="currentColor"/>
  <circle cx="50" cy="32" r="2.8" fill="#FFFFFF"/>
  <path d="M 40 27 C 40 21 60 21 60 27 Z" fill="currentColor"/>
  <line x1="50" y1="17" x2="50" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="50" cy="15.5" r="1.5" fill="currentColor"/>
  <polygon points="58,32 94,18 94,46" fill="url(#solidBeamPage)" opacity="0.85"/>
</svg>`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCodes[selectedStyle]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([svgCodes[selectedStyle]], { type: 'image/svg+xml' });
    element.href = URL.createObjectURL(file);
    element.download = `faro-logo-${selectedStyle}.svg`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 pb-24">
      {/* Top Banner / Navigation */}
      <div className="border-b border-neutral-200/80 bg-white/90 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/70 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Faro</span>
            </Link>
            <span className="text-neutral-300">/</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">Brand Identity</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-white font-medium">SVG Standard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 text-neutral-800 text-xs font-semibold hover:border-neutral-300 transition-all shadow-xs active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Código copiado' : 'Copiar SVG'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-black transition-all shadow-xs active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar .SVG</span>
            </button>
            <a
              href={`/logo-faro-${selectedStyle}.svg`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
              title="Ver archivo SVG crudo en pestaña nueva"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Intro Hero */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-700 text-xs font-medium mb-4 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-neutral-900" />
            <span>Identidad Vectorial Oficial &middot; Faro OS Gastronómico</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-3">
            El Logotipo Oficial de Faro
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 leading-relaxed">
            Diseñado bajo la estética <span className="text-neutral-900 font-medium">Swiss Minimalist</span>. 
            Geometría pura, líneas equilibradas y haz de proyección luminosa que simboliza la guía y sincronización para salones gastronómicos modernos.
          </p>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-neutral-200/70 border border-neutral-300/60 backdrop-blur-md">
            <button
              onClick={() => setSelectedStyle('minimal')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedStyle === 'minimal'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              1. Minimalista Suizo (Recomendado)
            </button>
            <button
              onClick={() => setSelectedStyle('architectural')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedStyle === 'architectural'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              2. Arquitectónico Bicolor
            </button>
            <button
              onClick={() => setSelectedStyle('solid')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedStyle === 'solid'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-700 hover:text-neutral-900'
              }`}
            >
              3. Sólido con Haz Ámbar
            </button>
          </div>
        </div>

        {/* Main Stage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Showcase Canvas (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-neutral-800">
                  {selectedStyle === 'minimal' && 'Faro Minimalista Suizo — Trazo Lineal 2.5px'}
                  {selectedStyle === 'architectural' && 'Faro Arquitectónico — Alta Fidelidad Vectorial'}
                  {selectedStyle === 'solid' && 'Faro Sólido — Geometría de Alto Contraste'}
                </span>
              </div>

              {/* Background canvas toggles */}
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full border border-neutral-200/60">
                <button
                  onClick={() => setBgMode('light')}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    bgMode === 'light' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Lienzo Blanco
                </button>
                <button
                  onClick={() => setBgMode('dark')}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    bgMode === 'dark' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Modo Oscuro
                </button>
                <button
                  onClick={() => setBgMode('grid')}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                    bgMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Blueprint / Retícula
                </button>
              </div>
            </div>

            {/* The SVG Canvas Box */}
            <div 
              className={`relative flex-1 min-h-[380px] rounded-2xl flex items-center justify-center p-8 transition-colors duration-300 ${
                bgMode === 'dark' 
                  ? 'bg-neutral-950 text-white' 
                  : bgMode === 'grid'
                    ? 'bg-neutral-50 text-neutral-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'
                    : 'bg-white text-neutral-900 border border-neutral-100'
              }`}
            >
              <div 
                className="w-56 h-56 sm:w-64 sm:h-64 transition-transform duration-300 hover:scale-105"
                dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
              />

              {/* Watermark coordinate indicator */}
              <div className="absolute bottom-3 right-4 font-mono text-[10px] text-neutral-400 opacity-70">
                viewBox 0 0 {selectedStyle === 'architectural' ? '120 120' : '100 100'} &middot; Scalable Vector
              </div>
            </div>

            {/* Size Scalability Test */}
            <div className="mt-6 pt-5 border-t border-neutral-100">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                Prueba de legibilidad en micro-escalas
              </div>
              <div className="flex items-end gap-6 flex-wrap">
                <div className="flex flex-col items-center gap-1.5">
                  <div 
                    className="w-4 h-4 text-neutral-900 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                  />
                  <span className="text-[10px] font-mono text-neutral-400">16px (Favicon)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div 
                    className="w-6 h-6 text-neutral-900 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                  />
                  <span className="text-[10px] font-mono text-neutral-400">24px (Móvil)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div 
                    className="w-8 h-8 text-neutral-900 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                  />
                  <span className="text-[10px] font-mono text-neutral-400">32px (Navbar)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div 
                    className="w-12 h-12 text-neutral-900 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                  />
                  <span className="text-[10px] font-mono text-neutral-400">48px (Badge)</span>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div 
                    className="w-16 h-16 text-neutral-900 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                  />
                  <span className="text-[10px] font-mono text-neutral-400">64px (Avatar)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Specs (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Wordmark lockups */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-900" />
                <span>Composición de Marca (Lockups)</span>
              </h2>

              {/* Horizontal Lockup Light */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60 mb-3 flex items-center gap-3">
                <div 
                  className="w-9 h-9 text-neutral-900 shrink-0"
                  dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                />
                <div>
                  <div className="text-base font-extrabold tracking-tight text-neutral-900">FARO</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">SaaS Gastronómico</div>
                </div>
              </div>

              {/* Horizontal Lockup Dark */}
              <div className="p-4 rounded-2xl bg-neutral-950 text-white border border-neutral-900 mb-3 flex items-center gap-3">
                <div 
                  className="w-9 h-9 text-white shrink-0"
                  dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                />
                <div>
                  <div className="text-base font-extrabold tracking-tight text-white">FARO</div>
                  <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Sistema Operativo</div>
                </div>
              </div>

              {/* Compact Pill Badge */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 text-neutral-900"
                    dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                  />
                  <span className="text-xs font-semibold text-neutral-900">Faro Standard Mark</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono">v1.0</span>
              </div>
            </div>

            {/* Design Specifications & Semiotics */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-sm flex-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-900" />
                <span>Semiótica y Fundamentos de Diseño</span>
              </h2>

              <ul className="space-y-3 text-xs text-neutral-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-neutral-900 font-semibold">Haz de Luz Angular:</strong> Representa la visión en tiempo real hacia las mesas y la cocina, guiando el flujo operativo sin fricciones.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-neutral-900 font-semibold">Cúpula y Linterna:</strong> Proporciones de arco suizo simétrico, asegurando legibilidad inmediata incluso a 16x16 píxeles.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-neutral-900 font-semibold">Base de Sustentación Plana:</strong> Transmite solidez, arquitectura robusta y resiliencia transaccional (criterio UTN FRLP).
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Real-World Context Mockups */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Simulación en Escenarios Reales</h2>
              <p className="text-xs text-neutral-500">Comprueba cómo convive el logo en los puntos de contacto del restaurante</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mockup 1: Mobile App Icon */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex flex-col items-center text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1">App Icon / PWA</h3>
              <p className="text-xs text-neutral-500 mb-5">Pantalla de inicio en smartphone del comensal</p>
              
              <div className="w-20 h-20 rounded-2xl bg-neutral-950 text-white flex items-center justify-center shadow-lg border border-neutral-800 p-4 transition-transform hover:scale-105">
                <div 
                  className="w-12 h-12 text-white"
                  dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                />
              </div>
              <span className="text-[11px] font-semibold text-neutral-800 mt-3">Faro PWA</span>
            </div>

            {/* Mockup 2: QR Table Standee */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex flex-col items-center text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 mb-4">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1">Acrílico QR de Mesa</h3>
              <p className="text-xs text-neutral-500 mb-5">Soporte físico sobre la mesa del restaurante</p>
              
              <div className="w-32 py-4 px-3 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col items-center shadow-sm">
                <div 
                  className="w-7 h-7 text-neutral-900 mb-2"
                  dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                />
                <div className="w-14 h-14 bg-neutral-900 rounded-lg flex items-center justify-center text-white mb-2">
                  <QrCode className="w-10 h-10 text-white" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-900">Mesa 14</span>
              </div>
            </div>

            {/* Mockup 3: Kitchen Ticket */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 flex flex-col items-center text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 mb-4">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mb-1">Comanda Térmica</h3>
              <p className="text-xs text-neutral-500 mb-5">Impresión monocromática de cocina</p>
              
              <div className="w-36 p-3 rounded-xl bg-white border border-neutral-300 font-mono text-[9px] shadow-sm text-left">
                <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-200 mb-2">
                  <div 
                    className="w-4 h-4 text-neutral-900"
                    dangerouslySetInnerHTML={{ __html: svgCodes[selectedStyle] }}
                  />
                  <span className="font-bold">FARO COCINA</span>
                </div>
                <div className="text-neutral-500">Mesa 08 &middot; 20:45 hs</div>
                <div className="font-bold text-neutral-900 mt-1">1x Bife de Chorizo</div>
                <div className="text-neutral-600">Punto: Jugoso</div>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Raw Links Card */}
        <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[11px] font-medium mb-2">
              <span>Archivos Vectoriales Públicos</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Enlaces directos a los archivos SVG generados
            </h3>
            <p className="text-xs text-neutral-400">
              Disponibles estáticamente en el servidor web de Next.js para incrustar o enlazar en cualquier parte.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/logo-faro-minimal.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-100 transition-colors inline-flex items-center gap-1.5"
            >
              <span>logo-faro-minimal.svg</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/logo-faro.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
            >
              <span>logo-faro.svg</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href="/logo-faro-solid.svg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors inline-flex items-center gap-1.5"
            >
              <span>logo-faro-solid.svg</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
