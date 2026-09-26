'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, Dish, ActionItem } from '@/lib/types';
import { api } from '@/lib/api';
import { Sparkles, MessageSquare, X, Send, Bot, User, Check, PlusCircle, ShieldAlert } from 'lucide-react';

interface AiChatAssistantProps {
  restaurantId: string;
  tableNumber: number;
  onAddToCart: (dish: Dish, quantity: number, notes?: string) => void;
  dishes: Dish[];
}

export function AiChatAssistant({
  restaurantId,
  tableNumber,
  onAddToCart,
  dishes,
}: AiChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy **Faro AI**, tu sommelier y asistente en la mesa. ¿Tienes alguna restricción alimentaria (ej: Sin TACC/celiaquía, vegetariano), o te gustaría que te recomiende un plato o maridaje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chatWithAi(updatedMessages, restaurantId, tableNumber);

      // Handle Function Calling Actions from Gemini
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach((action: ActionItem) => {
          if (action.action_type === 'ADD_TO_CART') {
            const payload = action.payload;
            const targetDish = dishes.find((d) => d.id === payload.dish_id || d.name.toLowerCase().includes(payload.dish_name?.toLowerCase()));
            if (targetDish) {
              onAddToCart(targetDish, payload.quantity || 1, payload.notes || 'Agregado por Faro AI');
            }
          }
        });
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Disculpa, tuve un inconveniente al consultar la carta. ¿Podrías consultarme nuevamente?',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    '🛡️ ¿Qué opciones Sin TACC tienen?',
    '🍷 Recomendame un plato y maridaje',
    '🌱 ¿Qué platos vegetarianos hay?',
    '🛒 Agregame un Ojo de Bife a la mesa',
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-faro-600 via-faro-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-faro-600/40 hover:scale-105 active:scale-95 transition-all animate-bounce duration-1000"
        >
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Faro AI Sommelier</span>
        </button>
      )}

      {/* Chat Modal / Popover */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-md h-[560px] bg-navy-950 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-faro-700/80 to-navy-900 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-faro-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  Faro AI • Sommelier en Mesa {tableNumber}
                </h3>
                <p className="text-[11px] text-faro-200">Google Gemini con Function Calling</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-faro-500/20 text-faro-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-faro-600 text-white rounded-br-none'
                      : 'bg-white/10 text-slate-200 border border-white/5 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-white/10 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs py-2">
                <div className="w-7 h-7 rounded-lg bg-faro-500/20 text-faro-400 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="animate-pulse">Faro AI está pensando y consultando la carta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-navy-900/40 border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                disabled={isLoading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-white/5 hover:bg-faro-600/30 text-slate-300 hover:text-white border border-white/10 transition-colors disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-navy-900/80 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pregúntale a Faro AI o pídele agregar platos..."
              disabled={isLoading}
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-navy-950 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-faro-500 disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-faro-600 hover:bg-faro-500 text-white disabled:opacity-40 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
