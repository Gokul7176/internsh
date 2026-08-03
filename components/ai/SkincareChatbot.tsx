'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageCircle, X, Send, Bot, User, RefreshCw } from 'lucide-react';
import { ChatMessage, Product } from '@/types';
import { askGeminiChatbot } from '@/lib/gemini';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { ProductCard } from '@/components/catalog/ProductCard';

export function SkincareChatbot() {
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
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const response = await askGeminiChatbot(textToSend, messages, INITIAL_PRODUCTS);
      const aiMsg: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: response.suggestedProducts,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-stone-900 dark:bg-amber-500 text-white dark:text-stone-950 shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 group border border-amber-400/40"
        aria-label="Open AI Skincare Assistant"
      >
        <Sparkles className="w-5 h-5 text-amber-400 dark:text-stone-950 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Ask Lumina AI</span>
      </button>

      {/* Chatbot modal container */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[550px] bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-stone-200/80 dark:border-stone-800/80 flex flex-col overflow-hidden animate-slide-up">
          {/* Chat Header */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold flex items-center gap-1.5">
                  Lumina AI Advisor <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h4>
                <p className="text-[10px] text-stone-400">Powered by Gemini 2.5 • Skincare Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    AI
                  </div>
                )}
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-medium'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-stone-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Product Recommendations inside Chat */}
                  {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                        Recommended Catalog Items:
                      </p>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.suggestedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800"
                          >
                            <img src={prod.images[0]} alt={prod.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                            <div className="min-w-0 flex-1">
                              <h5 className="font-semibold truncate text-[11px] text-stone-900 dark:text-white">{prod.name}</h5>
                              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">${prod.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-[9px] text-stone-400 text-right px-1">{msg.timestamp}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-stone-400 text-xs italic">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Lumina AI is formulating response...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-stone-50/50 dark:bg-stone-950/50">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 text-[10px] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-500 shrink-0 transition-colors"
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
            className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about ingredients or routine..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-xs rounded-full bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-2.5 rounded-full bg-amber-600 text-white disabled:opacity-50 hover:bg-amber-700 transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
