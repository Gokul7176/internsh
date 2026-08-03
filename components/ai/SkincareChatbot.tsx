'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, RefreshCw } from 'lucide-react';
import { ChatMessage, Product } from '@/types';
import { generateId, formatPrice } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import { useAuth } from '@/context/AuthContext';

export function SkincareChatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Hello! I am Lumina AI, your personal dermatological assistant. Ask me about ingredient compatibility (e.g. Vitamin C + Niacinamide), skin type routines, or product recommendations!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Can I mix Niacinamide with Vitamin C?',
    'Build a routine for Oily Skin & Acne',
    'Best products for Dry & Sensitive skin?',
    'Explain Hyaluronic Acid benefits',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-u-' + generateId(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const userProfile = user
        ? {
            skinType: user.skinType,
            primaryConcerns: user.primaryConcerns,
            ageGroup: '25-34',
            isSensitive: false,
          }
        : undefined;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          history: messages.slice(-10),
          userProfile,
        }),
      });
      const payload = await res.json();
      const result = payload.success ? payload.data : { text: payload.error || 'Unable to connect to AI assistant.' };

      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + generateId(),
        sender: 'ai',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: result.suggestedProducts,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: unknown) {
      console.error('Chatbot API fetch error:', e);
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + generateId(),
        sender: 'ai',
        text: 'Apologies, our AI skincare service is temporarily unavailable. Please try again shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-stone-900 dark:bg-[#D4AF37] text-white dark:text-[#0B0B0C] shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group border border-amber-400/40"
        aria-label="Open AI Skincare Assistant"
        aria-expanded={isOpen}
        aria-controls="skincare-chatbot-drawer"
      >
        <Sparkles className="w-5 h-5 text-amber-400 dark:text-[#0B0B0C] animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Ask Lumina AI</span>
      </button>

      {/* Chatbot modal container */}
      {isOpen && (
        <div
          id="skincare-chatbot-drawer"
          role="dialog"
          aria-label="Lumina AI Skincare Assistant"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-white/95 dark:bg-[#151515] backdrop-blur-xl rounded-3xl shadow-2xl border border-stone-200/80 dark:border-[#2A2A2A] flex flex-col overflow-hidden animate-slide-up"
        >
          {/* Chat Header */}
          <div className="p-4 bg-stone-900 dark:bg-[#0B0B0C] text-white flex items-center justify-between border-b border-stone-800 dark:border-[#2A2A2A]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#E7C765] flex items-center justify-center text-stone-950 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-1.5 text-white dark:text-[#F5F5F5]">
                  Lumina AI Advisor <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </h4>
                <p className="text-[10px] text-stone-400 dark:text-[#A0A0A0]">Powered by Gemini 2.5 • Skincare Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-[#1B1B1B] text-amber-800 dark:text-[#D4AF37] border dark:border-[#2A2A2A] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    AI
                  </div>
                )}
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-stone-900 text-white dark:bg-[#D4AF37] dark:text-[#0B0B0C] font-semibold'
                        : 'bg-stone-100 dark:bg-[#1B1B1B] text-stone-800 dark:text-[#F5F5F5] border border-stone-200/60 dark:border-[#2A2A2A]'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Product Recommendations inside Chat */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] font-bold text-amber-700 dark:text-[#D4AF37] uppercase tracking-wider">
                        Recommended Catalog Items:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.suggestedProducts.map((prod: Product) => (
                          <div
                            key={prod.id}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-[#1B1B1B] border border-stone-200 dark:border-[#2A2A2A]"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <SafeImage
                                src={prod.images?.[0]}
                                alt={prod.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-semibold truncate text-[11px] text-stone-900 dark:text-[#F5F5F5]">
                                {prod.name}
                              </h5>
                              <p className="text-[10px] font-bold text-amber-700 dark:text-[#D4AF37]">
                                {formatPrice(prod.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-[9px] text-stone-400 dark:text-[#777777] text-right px-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-stone-400 dark:text-[#A0A0A0] text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" /> Lumina AI is formulating response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-stone-200/60 dark:border-[#2A2A2A] flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-stone-50/50 dark:bg-[#0B0B0C]">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-[#1B1B1B] text-[10px] text-stone-700 dark:text-[#A0A0A0] border border-stone-200 dark:border-[#2A2A2A] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] dark:hover:text-[#F5F5F5] shrink-0 transition-colors"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#151515] border-t border-stone-200 dark:border-[#2A2A2A] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about ingredients or routine..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-xs rounded-full bg-stone-100 dark:bg-[#1B1B1B] text-stone-900 dark:text-[#F5F5F5] placeholder-stone-400 dark:placeholder-[#777777] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              aria-label="Skincare Question Input"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-2.5 rounded-full bg-[#D4AF37] text-stone-950 disabled:opacity-50 hover:bg-[#E7C765] transition-colors shrink-0 font-bold"
              aria-label="Send Question"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
