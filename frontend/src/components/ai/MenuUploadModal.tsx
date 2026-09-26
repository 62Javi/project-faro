'use client';

import { useState, useRef } from 'react';
import { api } from '@/lib/api';
import { MenuExtractionResult } from '@/lib/types';
import { Sparkles, Upload, FileText, CheckCircle2, AlertCircle, Loader2, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MenuUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  onMenuUpdated: () => void;
}

export function MenuUploadModal({
  isOpen,
  onClose,
  restaurantId,
  onMenuUpdated,
}: MenuUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MenuExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleUploadAndExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const extracted = await api.extractMenuWithGemini(file, restaurantId);
      setResult(extracted);
      onMenuUpdated();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (err: any) {
      setError(err.message || 'Error procesando la carta');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-navy-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-faro-700 to-navy-900 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Digitalización de Menú con IA Multimodal</h3>
              <p className="text-xs text-faro-200">Google Gemini • Structured Outputs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {!result ? (
            <>
              {/* Drop Area */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-faro-500/60 rounded-2xl p-8 text-center cursor-pointer bg-navy-900/40 hover:bg-navy-900/70 transition-all duration-300"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,application/pdf"
                  className="hidden"
                />

                <div className="w-16 h-16 rounded-2xl bg-faro-500/10 text-faro-400 mx-auto flex items-center justify-center mb-4 border border-faro-500/20">
                  {file ? <FileText className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                </div>

                {file ? (
                  <div>
                    <p className="text-white font-semibold text-base">{file.name}</p>
                    <p className="text-slate-400 text-xs mt-1">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • Listo para procesar
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-white font-semibold text-base">Arrastra aquí la foto o PDF de tu carta física</p>
                    <p className="text-slate-400 text-xs mt-1">
                      Soporta JPG, PNG, WEBP o PDF de una o varias páginas
                    </p>
                  </div>
                )}
              </div>

              {/* Explanatory points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs font-bold text-faro-400 mb-1">1. Detección OCR</div>
                  <p className="text-[11px] text-slate-400">Lee nombres de platos, categorías y precios numéricos.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs font-bold text-faro-400 mb-1">2. Alérgenos por IA</div>
                  <p className="text-[11px] text-slate-400">Identifica automáticamente Sin TACC, Lactosa, Mariscos y Vegano.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-xs font-bold text-faro-400 mb-1">3. Carga Inmediata</div>
                  <p className="text-[11px] text-slate-400">Actualiza la carta interactiva y activa el asistente inteligente en segundos.</p>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </>
          ) : (
            /* Extraction Result View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">¡Menú Digitalizado con Éxito!</h4>
                  <p className="text-xs text-slate-300">
                    Se detectaron {result.categories.length} categorías y {result.dishes.length} platos/bebidas mediante Structured Outputs de Gemini.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Platos Agregados Automáticamente:
                </h5>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {result.dishes.map((d, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">{d.name}</span>
                        <span className="text-slate-400 ml-2">({d.category_name})</span>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{d.description}</p>
                      </div>
                      <span className="font-bold text-faro-400 ml-3 whitespace-nowrap">
                        ${d.price.toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-navy-900/70 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            {result ? 'Cerrar' : 'Cancelar'}
          </button>

          {!result ? (
            <button
              onClick={handleUploadAndExtract}
              disabled={!file || isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-faro-600 to-faro-500 hover:from-faro-500 hover:to-faro-400 text-white font-bold text-sm shadow-lg shadow-faro-600/30 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extrayendo datos con Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Procesar Carta con IA
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition-all"
            >
              Ver Menú Actualizado
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
