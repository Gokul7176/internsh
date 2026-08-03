'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Sun, Moon, ArrowRight, CheckCircle2, RefreshCw, ShoppingBag } from 'lucide-react';
import { SkinType, AIRoutineRecommendation, SkinDiagnosticInput } from '@/types';
import { generateSkinRecommendation } from '@/lib/gemini';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function RecommendationsPage() {
  const { allProducts } = useProducts();
  const { addToCart } = useCart();
  const { success } = useToast();

  const [step, setStep] = useState<number>(1);
  const [skinType, setSkinType] = useState<SkinType>('combination');
  const [ageGroup, setAgeGroup] = useState<string>('25-34');
  const [concerns, setConcerns] = useState<string[]>(['Hyperpigmentation', 'Uneven Texture']);
  const [isSensitive, setIsSensitive] = useState<boolean>(false);
  const [preferredTexture, setPreferredTexture] = useState<string>('Lightweight Serum & Cream');

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
      const res = await generateSkinRecommendation(input, allProducts);
      setRecommendation(res);
      setStep(3); // Result view
    } catch (e) {
      console.error(e);
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
    success(`Added routine items to your shopping bag!`, 'Routine Added');
  };

  return (
    <div className="pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Page Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          AI DERMATOLOGICAL DIAGNOSTIC
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 dark:text-cream-50">
          Personalized Routine Builder
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Answer a 60-second diagnostic analysis. Gemini AI matches clinical catalog formulations to your exact skin profile.
        </p>
      </div>

      {/* Step 1 & Step 2 Questionnaire */}
      {step < 3 && (
        <div className="p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-xl space-y-8 max-w-3xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 pb-4 border-b border-stone-200 dark:border-stone-800">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? 'Skin Profile & Type' : 'Concerns & Sensitivity'}</span>
          </div>

          {step === 1 ? (
            <div className="space-y-6">
              {/* Skin Type */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
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
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Select your age group:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Under 20', '20-34', '35-49', '50+'].map((ag) => (
                    <button
                      key={ag}
                      type="button"
                      onClick={() => setAgeGroup(ag)}
                      className={`p-3 rounded-2xl border text-xs font-semibold transition-all ${
                        ageGroup === ag
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {ag}
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={() => setStep(2)} variant="gold" size="lg" className="w-full">
                Next: Skin Concerns <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Concerns Checkboxes */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Select your main skincare concerns (multiple allowed):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {availableConcerns.map((c) => {
                    const isSelected = concerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleConcern(c)}
                        className={`p-3 rounded-2xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-semibold'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{c}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sensitivity Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-white">Reactive / Sensitive Skin?</h4>
                  <p className="text-[10px] text-stone-500">Prone to redness, burning, or stinging from active acids.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSensitive(!isSensitive)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isSensitive ? 'bg-rose-600 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600'
                  }`}
                >
                  {isSensitive ? 'Sensitive' : 'Normal'}
                </button>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={() => setStep(1)} variant="outline" size="lg" className="w-1/3">
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  variant="gold"
                  size="lg"
                  className="flex-1 shadow-lg shadow-amber-600/20"
                  isLoading={loading}
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
          <div className="p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Diagnostic Summary</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-light">
                  Tailored Routine for {skinType.toUpperCase()} Skin
                </h2>
              </div>
              <Button onClick={() => setStep(1)} variant="outline" size="sm" className="text-white border-stone-700">
                <RefreshCw className="w-3.5 h-3.5" /> Retake Diagnostic Quiz
              </Button>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60">
              "{recommendation.expertAdvice}"
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs">
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Key Ingredients to Focus On:</span>
              {recommendation.suggestedIngredients.map((ing, i) => (
                <Badge key={i} variant="gold" size="sm">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>

          {/* Morning Routine */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-cream-50 flex items-center gap-2">
                <Sun className="w-6 h-6 text-amber-500" /> Morning Routine Sequence
              </h3>
              <Badge variant="cream">Daytime Shield</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendation.morningRoutine.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                      {stepItem.step}
                    </span>
                    <h4 className="font-serif text-lg font-semibold text-stone-900 dark:text-white">{stepItem.title}</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{stepItem.explanation}</p>
                  </div>

                  {stepItem.recommendedProduct && (
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                      <img src={stepItem.recommendedProduct.images[0]} alt={stepItem.recommendedProduct.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{stepItem.recommendedProduct.name}</h5>
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{formatPrice(stepItem.recommendedProduct.price)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evening Routine */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="font-serif text-2xl font-normal text-stone-900 dark:text-cream-50 flex items-center gap-2">
                <Moon className="w-6 h-6 text-amber-400" /> Evening Routine Sequence
              </h3>
              <Badge variant="stone">Nighttime Renewal</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendation.eveningRoutine.map((stepItem) => (
                <div
                  key={stepItem.step}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 backdrop-blur-md shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="w-7 h-7 rounded-full bg-stone-900 text-white dark:bg-white dark:text-stone-950 font-bold text-xs flex items-center justify-center">
                      {stepItem.step}
                    </span>
                    <h4 className="font-serif text-lg font-semibold text-stone-900 dark:text-white">{stepItem.title}</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{stepItem.explanation}</p>
                  </div>

                  {stepItem.recommendedProduct && (
                    <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center gap-3">
                      <img src={stepItem.recommendedProduct.images[0]} alt={stepItem.recommendedProduct.name} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">{stepItem.recommendedProduct.name}</h5>
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{formatPrice(stepItem.recommendedProduct.price)}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
