'use client';

import React, { useState } from 'react';
import { Sparkles, Sun, Moon, ArrowRight, CheckCircle2, RefreshCw, ShoppingBag, ShieldAlert, Clock, Activity, Check } from 'lucide-react';
import { SkinType, AIRoutineRecommendation, SkinDiagnosticInput } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { SafeImage } from '@/components/ui/SafeImage';

export default function RecommendationsPage() {
  const { addToCart } = useCart();
  const { success, error } = useToast();

  const [step, setStep] = useState<number>(1);
  const [skinType, setSkinType] = useState<SkinType>('combination');
  const [ageGroup, setAgeGroup] = useState<string>('25-34');
  const [concerns, setConcerns] = useState<string[]>(['Hyperpigmentation', 'Uneven Texture']);
  const [isSensitive, setIsSensitive] = useState<boolean>(false);
  const [preferredTexture] = useState<string>('Lightweight Serum & Cream');

  const [loading, setLoading] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<AIRoutineRecommendation | null>(null);

  const availableConcerns = [
    'Hyperpigmentation & Dark Spots',
    'Fine Lines & Wrinkles',
    'Acne & Clogged Pores',
    'Dehydration & Dry Flaking',
    'Redness & Rosacea',
    'Uneven Texture',
    'Excess T-Zone Oil',
  ];

  const toggleConcern = (item: string) => {
    if (concerns.includes(item)) {
      setConcerns(concerns.filter((c) => c !== item));
    } else {
      setConcerns([...concerns, item]);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    const input: SkinDiagnosticInput = {
      skinType,
      ageGroup,
      primaryConcerns: concerns,
      isSensitive,
      preferredTexture,
    };

    try {
      const res = await fetch('/api/gemini/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const payload = await res.json();
      if (payload.success) {
        setRecommendation(payload.data);
        setStep(3); // Result view
      } else {
        error(payload.error || 'Failed to generate skin recommendation', 'Diagnostic Error');
      }
    } catch (e: unknown) {
      console.error('Recommendation API fetch error:', e);
      error('Failed to generate recommendation. Please check network connectivity.', 'Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFullRoutineToCart = () => {
    if (!recommendation) return;
    let count = 0;
    recommendation.morningRoutine.forEach((stepItem) => {
      if (stepItem.recommendedProduct) {
        addToCart(stepItem.recommendedProduct, 1);
        count++;
      }
    });
    recommendation.eveningRoutine.forEach((stepItem) => {
      if (stepItem.recommendedProduct) {
        addToCart(stepItem.recommendedProduct, 1);
        count++;
      }
    });
    if (count > 0) {
      success(`Added ${count} routine items to your shopping bag!`, 'Routine Added');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12 animate-fade-in">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          AI DERMATOLOGICAL DIAGNOSTIC
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 dark:text-cream-50">
          Personalized Clinical Routine Builder
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Answer a 60-second diagnostic analysis. Gemini AI matches clinical catalog formulations to your exact skin profile.
        </p>
      </div>

      {/* Step 1 & Step 2 Questionnaire */}
      {step < 3 && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-xl space-y-8 max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 pb-4 border-b border-stone-200 dark:border-[#2A2A2A]">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? 'Skin Profile & Type' : 'Concerns & Sensitivity'}</span>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              {/* Skin Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5]">
                  What is your primary skin type?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(['dry', 'oily', 'combination', 'sensitive', 'normal'] as SkinType[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSkinType(st)}
                      className={`p-3 rounded-2xl border text-xs font-bold uppercase transition-all ${
                        skinType === st
                          ? 'border-[#D4AF37] bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-[#D4AF37] shadow-sm'
                          : 'border-stone-200 dark:border-[#2A2A2A] text-stone-600 dark:text-[#A0A0A0] hover:bg-stone-50 dark:hover:bg-[#1B1B1B]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div className="space-y-3 pt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5]">
                  What is your age bracket?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Under 18', '18-24', '25-34', '35-44', '45+'].map((ag) => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => setAgeGroup(ag)}
                      className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                        ageGroup === ag
                          ? 'border-[#D4AF37] bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-[#D4AF37] shadow-sm'
                          : 'border-stone-200 dark:border-[#2A2A2A] text-stone-600 dark:text-[#A0A0A0] hover:bg-stone-50 dark:hover:bg-[#1B1B1B]'
                      }`}
                    >
                      {ag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-200 dark:border-[#2A2A2A]">
                <Button onClick={() => setStep(2)} variant="gold" size="md" className="gap-2">
                  Next Step: Concerns <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Concerns Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-[#F5F5F5]">
                  Select your primary skin concerns (pick 1-3):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableConcerns.map((c) => {
                    const isSelected = concerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleConcern(c)}
                        className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-[#D4AF37] bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-[#D4AF37]'
                            : 'border-stone-200 dark:border-[#2A2A2A] text-stone-600 dark:text-[#A0A0A0] hover:bg-stone-50 dark:hover:bg-[#1B1B1B]'
                        }`}
                      >
                        <span>{c}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sensitive Skin Toggle */}
              <div className="pt-4 border-t border-stone-200 dark:border-[#2A2A2A]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSensitive}
                    onChange={(e) => setIsSensitive(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-[#D4AF37]"
                  />
                  <span className="text-xs font-semibold text-stone-800 dark:text-[#F5F5F5]">
                    I have sensitive skin (prone to redness, stinging, or allergic reactivity)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-stone-200 dark:border-[#2A2A2A]">
                <Button onClick={() => setStep(1)} variant="outline" size="md">
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  isLoading={loading}
                  disabled={concerns.length === 0}
                  variant="gold"
                  size="md"
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Generate AI Skincare Routine
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Recommendation Output View */}
      {step === 3 && recommendation && (
        <div className="space-y-12 animate-fade-in">
          {/* Diagnostic Summary & AI Expert Advice */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">Clinical Consultant Analysis</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#F5F5F5]">
                  Tailored Routine for {skinType.toUpperCase()} Skin ({ageGroup})
                </h2>
              </div>
              <Button onClick={() => setStep(1)} variant="outline" size="sm" className="text-white border-[#2A2A2A] hover:bg-[#1B1B1B]">
                <RefreshCw className="w-3.5 h-3.5" /> Retake Diagnostic Quiz
              </Button>
            </div>

            {/* Recommendation Confidence Score */}
            {recommendation.recommendationConfidence && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-bold text-sm flex items-center justify-center border border-[#D4AF37]/40">
                    {recommendation.recommendationConfidence.confidenceScore}%
                  </div>
                  <div>
                    <p className="font-bold text-[#F5F5F5]">Clinical Match Confidence Score</p>
                    <p className="text-[#A0A0A0]">High match alignment based on your exact skin profile</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recommendation.recommendationConfidence.matchReasons.map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-[#1B1B1B] text-[#D4AF37] border border-[#2A2A2A] text-[10px] font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Physiological Skin Analysis */}
            {recommendation.skinAnalysis && (
              <div className="space-y-2 p-5 rounded-2xl bg-[#151515] border border-[#2A2A2A]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> Physiological Skin Analysis
                </h4>
                <p className="text-xs text-[#F5F5F5] leading-relaxed">{recommendation.skinAnalysis}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 text-xs">
              <span className="text-[#A0A0A0] font-bold uppercase tracking-wider text-[10px]">Active Ingredients to Focus On:</span>
              {recommendation.suggestedIngredients.map((ing, i) => (
                <Badge key={i} variant="gold" size="sm">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>

          {/* Morning Routine */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2A2A2A] pb-3">
              <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-[#F5F5F5] flex items-center gap-2">
                <Sun className="w-6 h-6 text-amber-500" /> Morning Routine Sequence
              </h3>
              <Badge variant="cream">Daytime Shield</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendation.morningRoutine.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-[#D4AF37] font-bold text-xs flex items-center justify-center">
                        {stepItem.step}
                      </span>
                      {stepItem.estimatedTime && (
                        <span className="text-[10px] text-stone-500 dark:text-[#777777] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {stepItem.estimatedTime}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5]">{stepItem.title}</h4>
                    <p className="text-xs text-stone-600 dark:text-[#A0A0A0] leading-relaxed">{stepItem.reason || stepItem.explanation}</p>
                  </div>

                  {stepItem.recommendedProduct && (
                    <div className="pt-3 border-t border-stone-100 dark:border-[#2A2A2A] flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <SafeImage src={stepItem.recommendedProduct.images[0]} alt={stepItem.recommendedProduct.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-stone-900 dark:text-[#F5F5F5] truncate">{stepItem.recommendedProduct.name}</h5>
                        <p className="text-[10px] font-bold text-amber-700 dark:text-[#D4AF37]">{formatPrice(stepItem.recommendedProduct.price)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evening Routine */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-[#2A2A2A] pb-3">
              <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-[#F5F5F5] flex items-center gap-2">
                <Moon className="w-6 h-6 text-amber-400" /> Evening Routine Sequence
              </h3>
              <Badge variant="stone">Nighttime Renewal</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendation.eveningRoutine.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] backdrop-blur-md shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-7 h-7 rounded-full bg-stone-900 text-white dark:bg-[#F5F5F5] dark:text-stone-950 font-bold text-xs flex items-center justify-center">
                        {stepItem.step}
                      </span>
                      {stepItem.estimatedTime && (
                        <span className="text-[10px] text-stone-500 dark:text-[#777777] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {stepItem.estimatedTime}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5]">{stepItem.title}</h4>
                    <p className="text-xs text-stone-600 dark:text-[#A0A0A0] leading-relaxed">{stepItem.reason || stepItem.explanation}</p>
                  </div>

                  {stepItem.recommendedProduct && (
                    <div className="pt-3 border-t border-stone-100 dark:border-[#2A2A2A] flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <SafeImage src={stepItem.recommendedProduct.images[0]} alt={stepItem.recommendedProduct.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-stone-900 dark:text-[#F5F5F5] truncate">{stepItem.recommendedProduct.name}</h5>
                        <p className="text-[10px] font-bold text-amber-700 dark:text-[#D4AF37]">{formatPrice(stepItem.recommendedProduct.price)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Expected Results Timeline */}
          {recommendation.expectedTimeline && (
            <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] space-y-6">
              <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-[#F5F5F5] flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#D4AF37]" /> Expected Clinical Results Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(recommendation.expectedTimeline).map(([stage, text]) => (
                  <div key={stage} className="p-4 rounded-2xl bg-stone-50 dark:bg-[#1B1B1B] border border-stone-200/60 dark:border-[#2A2A2A] space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                      {stage.toUpperCase()}
                    </span>
                    <p className="text-xs text-stone-700 dark:text-[#A0A0A0] leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle Tips & Interaction Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendation.lifestyleTips && recommendation.lifestyleTips.length > 0 && (
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#151515] border border-stone-200/80 dark:border-[#2A2A2A] space-y-4">
                <h4 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5] flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" /> Lifestyle & Habit Checklist
                </h4>
                <ul className="space-y-2 text-xs text-stone-600 dark:text-[#A0A0A0]">
                  {recommendation.lifestyleTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendation.ingredientInteractionNotes && (
              <div className="p-6 rounded-3xl bg-amber-500/10 border border-[#F59E0B]/30 space-y-3">
                <h4 className="font-serif text-lg font-semibold text-stone-900 dark:text-[#F5F5F5] flex items-center gap-2 text-[#F59E0B]">
                  <ShieldAlert className="w-5 h-5" /> Active Ingredient Caution
                </h4>
                <p className="text-xs text-stone-700 dark:text-[#A0A0A0] leading-relaxed">
                  {recommendation.ingredientInteractionNotes}
                </p>
              </div>
            )}
          </div>

          {/* Add Full Routine CTA */}
          <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="font-serif text-2xl text-stone-900 dark:text-white">Ready to Transform Your Skin?</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Add all recommended morning & evening products directly to your bag with 1 click.</p>
            </div>
            <Button onClick={handleAddFullRoutineToCart} variant="gold" size="lg" className="shrink-0 shadow-lg shadow-amber-600/20">
              <ShoppingBag className="w-5 h-5" /> Add Entire Routine to Bag
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
