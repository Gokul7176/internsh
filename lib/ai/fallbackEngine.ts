import { SkinDiagnosticInput, AIRoutineRecommendation, Product, SkinType } from '../../types';
import { rankProductsForUser } from './productRanker';
import { extractProfileFromText } from './profileExtractor';
import { formatPrice } from '../../utils/currency';

export function generatePersonalizedFallbackRecommendation(
  input: SkinDiagnosticInput,
  catalog: Product[]
): AIRoutineRecommendation {
  const ranked = rankProductsForUser(catalog, {
    skinType: input.skinType,
    primaryConcerns: input.primaryConcerns,
    secondaryConcerns: input.secondaryConcerns,
    isSensitive: input.isSensitive,
    maxBudget: input.budget,
  });

  const cleanser = ranked.find((p) => p.category === 'cleanser') || catalog[0];
  const serum = ranked.find((p) => p.category === 'serum') || catalog[1];
  const moisturizer = ranked.find((p) => p.category === 'moisturizer') || catalog[2];
  const sunscreen = ranked.find((p) => p.category === 'sunscreen') || catalog[3];
  const nightTreatment =
    ranked.find((p) => p.category === 'exfoliant' || p.category === 'mask' || (p.category === 'serum' && p.id !== serum.id)) ||
    catalog[4] ||
    serum;

  const concernsText = input.primaryConcerns.join(' and ');
  const ageStr = input.ageGroup || '25-34';

  let physiologicalAnalysis = `At your age (${ageStr}) with ${input.skinType} skin, your primary concern of ${concernsText} is driven by specific follicular dynamics. `;
  if (input.skinType === 'oily') {
    physiologicalAnalysis += `Elevated sebum secretion by active sebaceous glands mixes with desquamated keratinocytes, creating micro-comedones that block pores and foster inflammatory breakouts.`;
  } else if (input.skinType === 'dry') {
    physiologicalAnalysis += `Deficient epidermal lipid synthesis leads to compromised stratum corneum integrity, allowing trans-epidermal water loss (TEWL) and microscopic flaking.`;
  } else if (input.skinType === 'sensitive') {
    physiologicalAnalysis += `Compromised cutaneous barrier function allows environmental irritants to trigger histamine release and neurogenic redness.`;
  } else {
    physiologicalAnalysis += `Fluctuating T-zone sebum production paired with localized moisture loss requires balanced active regulation.`;
  }

  return {
    summary: `Clinical Skincare Advisor routine for ${ageStr} ${input.skinType} skin targeting ${concernsText}.`,
    skinAnalysis: physiologicalAnalysis,
    morningRoutine: [
      {
        step: 1,
        title: `Purifying Cleanse`,
        productCategory: 'cleanser',
        productId: cleanser.id,
        productName: cleanser.name,
        recommendedProduct: cleanser,
        explanation: `Formulated specifically for ${input.skinType} skin, ${cleanser.name} removes overnight sebum without stripping essential lipids.`,
        reason: `Lifts overnight surface sebum and cellular debris while preserving lipid barrier moisture.`,
        estimatedTime: '1 minute',
      },
      {
        step: 2,
        title: `Targeted Active Serum`,
        productCategory: 'serum',
        productId: serum.id,
        productName: serum.name,
        recommendedProduct: serum,
        explanation: `${serum.name} delivers concentrated active ingredients targeting ${concernsText}.`,
        reason: `Delivers bioactive concentrates to regulate cellular function and address ${concernsText}.`,
        estimatedTime: '2 minutes',
      },
      {
        step: 3,
        title: `Moisture Lock`,
        productCategory: 'moisturizer',
        productId: moisturizer.id,
        productName: moisturizer.name,
        recommendedProduct: moisturizer,
        explanation: `${moisturizer.name} seals in moisture and repairs barrier health.`,
        reason: `Restores lipid balance and seals in hydration for 24-hour barrier protection.`,
        estimatedTime: '1 minute',
      },
      {
        step: 4,
        title: `UV Shield`,
        productCategory: 'sunscreen',
        productId: sunscreen.id,
        productName: sunscreen.name,
        recommendedProduct: sunscreen,
        explanation: `${sunscreen.name} shields against broad-spectrum UVA/UVB photo-aging.`,
        reason: `Prevents UV-induced photo-damage and guards against post-inflammatory hyperpigmentation.`,
        estimatedTime: '1 minute',
      },
    ],
    eveningRoutine: [
      {
        step: 1,
        title: 'Deep Evening Cleanse',
        productCategory: 'cleanser',
        productId: cleanser.id,
        productName: cleanser.name,
        recommendedProduct: cleanser,
        explanation: `Rinses away daily pollutants, sunscreen, and excess oil.`,
        reason: `Clears accumulated environmental particulate matter and daily SPF.`,
        estimatedTime: '1 minute',
      },
      {
        step: 2,
        title: 'Night Repair Treatment',
        productCategory: nightTreatment.category,
        productId: nightTreatment.id,
        productName: nightTreatment.name,
        recommendedProduct: nightTreatment,
        explanation: `Stimulates cellular renewal and targets ${concernsText} overnight.`,
        reason: `Accelerates cellular turnover and clears pore impactions during nightly repair cycles.`,
        estimatedTime: '2 minutes',
      },
      {
        step: 3,
        title: 'Overnight Barrier Recovery',
        productCategory: 'moisturizer',
        productId: moisturizer.id,
        productName: moisturizer.name,
        recommendedProduct: moisturizer,
        explanation: `Restores barrier ceramides while resting.`,
        reason: `Prevents nocturnal Trans-Epidermal Water Loss and reinforces lipid barrier matrix.`,
        estimatedTime: '1 minute',
      },
    ],
    recommendedIngredients: [
      {
        name: serum.ingredients[0] || 'Niacinamide',
        mechanism: 'Inhibits melanosome transfer and regulates sebaceous lipid synthesis.',
        benefits: 'Controls oil secretion, brightens tone, and calms redness.',
        compatibility: 'Highly compatible with Hyaluronic Acid and Ceramides.',
        possibleIrritationNotes: 'Well tolerated by all skin types.',
      },
      {
        name: nightTreatment.ingredients[1] || 'Salicylic Acid (BHA 2%)',
        mechanism: 'Lipophilic exfoliant that penetrates lipid-filled pores to dissolve micro-comedones.',
        benefits: 'Unclogs blackheads and clarifies skin texture.',
        compatibility: 'Avoid combining with strong retinoids on the same evening.',
        possibleIrritationNotes: 'Introduce 2-3 nights per week initially.',
      },
    ],
    whyTheseProducts: `Selected specifically because your ${input.skinType} skin needs target ingredient delivery without stripping lipid barrier moisture. ${cleanser.name} and ${serum.name} provide optimal synergy.`,
    expertAdvice: `Priority focus: Maintain daily morning application of ${sunscreen.name} SPF 50. ${
      input.isSensitive ? 'Since your skin is reactive, introduce active serums gradually.' : 'Pair active treatments with barrier moisturizers.'
    }`,
    lifestyleTips: [
      'Hydration: Drink 2.5L water daily to prevent dehydration-induced sebum overproduction.',
      'Pillow Hygiene: Change pillowcases twice weekly to prevent bacterial transfer.',
      'Dietary Balance: Reduce high-glycemic foods and refined sugars.',
      'Stress Control: Practice nightly relaxation to minimize cortisol sebum spikes.',
      'Sun Protection: Apply broad-spectrum SPF 50 daily.',
    ],
    ingredientInteractionNotes: 'Do not use Retinol and Salicylic Acid (BHA) on the exact same evening to prevent barrier over-exfoliation.',
    expectedTimeline: {
      week1: 'Initial skin feel improvement and refreshed surface barrier.',
      week2: 'Reduced daytime T-zone shine and softening of pore impactions.',
      week4: 'Noticeable decrease in active breakouts and smoother texture.',
      week8: 'Significant fading of post-acne marks and refined skin tone.',
      maintenance: 'Sustained barrier resilience and clear complexion with daily SPF maintenance.',
    },
    recommendationConfidence: {
      confidenceScore: 95,
      matchReasons: [
        `✓ Matched ${input.skinType.toUpperCase()} Skin Type`,
        `✓ Addressed ${input.primaryConcerns[0] || 'Primary Concerns'}`,
        `✓ Budget Matched (${input.budget ? formatPrice(input.budget) : 'Flexible'})`,
        `✓ Formulated for ${ageStr} Age Profile`,
      ],
    },
    suggestedIngredients: ['Niacinamide', 'Ceramides', 'Salicylic Acid (BHA)', 'Hyaluronic Acid'],
  };
}

export function generatePersonalizedFallbackChat(
  userQuery: string,
  catalog: Product[],
  userProfile?: { skinType?: string; primaryConcerns?: string[]; ageGroup?: string; isSensitive?: boolean; budget?: number }
): { text: string; suggestedProducts: Product[] } {
  const queryLower = userQuery.toLowerCase();

  const extracted = extractProfileFromText(userQuery);
  const skinType = (userProfile?.skinType as SkinType) || extracted.skinType || 'combination';
  const primaryConcerns = Array.from(
    new Set([...(userProfile?.primaryConcerns || []), ...extracted.primaryConcerns])
  );

  const ranked = rankProductsForUser(catalog, {
    skinType,
    primaryConcerns,
    isSensitive: userProfile?.isSensitive || extracted.isSensitive,
    maxBudget: userProfile?.budget || extracted.budget,
  });

  // 0. Greetings & Casual Inquiries
  const trimmed = queryLower.trim().replace(/[!.,?]/g, '');
  const greetings = ['hi', 'hello', 'hey', 'heyy', 'hii', 'hiii', 'greetings', 'good morning', 'good evening', 'good afternoon', 'who are you', 'what can you do', 'help'];
  if (greetings.includes(trimmed) || trimmed.startsWith('hi ') || trimmed.startsWith('hello ') || trimmed.startsWith('hey ')) {
    return {
      text: "Hello! I'm Lumina AI, your personal dermatological skincare advisor. How can I assist you today? Feel free to ask about product recommendations for your skin type, ingredient safety (like Vitamin C + Niacinamide), or building a custom skincare routine!",
      suggestedProducts: catalog.slice(0, 2),
    };
  }

  // 1. Niacinamide + Vitamin C combination
  if (queryLower.includes('niacinamide') && queryLower.includes('vitamin c')) {
    const vitC = catalog.find((p) => p.name.includes('Vitamin C')) || ranked[0];
    const niac = catalog.find((p) => p.name.includes('Niacinamide')) || ranked[1];
    return {
      text: `Based on dermatological research, Niacinamide and Vitamin C can be used together safely! Vitamin C provides potent morning antioxidant defense against free radicals, while Niacinamide strengthens your lipid barrier and regulates sebum. Apply **${vitC.name}** (${formatPrice(vitC.price)}) in the morning followed by **${niac.name}** (${formatPrice(niac.price)}).`,
      suggestedProducts: [vitC, niac].filter(Boolean),
    };
  }

  // 2. Sunscreen / SPF queries
  if (queryLower.includes('sunscreen') || queryLower.includes('spf') || queryLower.includes('sun protection')) {
    const sunscreens = catalog.filter((p) => p.category === 'sunscreen');
    const selected = sunscreens.length ? sunscreens : ranked;
    const topSunscreen = selected[0];
    return {
      text: `Daily broad-spectrum sun protection is essential for preserving skin barrier health and preventing photo-aging. We recommend **${topSunscreen.name}** (${formatPrice(topSunscreen.price)}). ${topSunscreen.description}`,
      suggestedProducts: selected.slice(0, 2),
    };
  }

  // 3. Cleanser queries
  if (queryLower.includes('cleanser') || queryLower.includes('face wash') || queryLower.includes('cleanse')) {
    const cleansers = catalog.filter((p) => p.category === 'cleanser');
    const selected = cleansers.length ? cleansers : ranked;
    const topCleanser = selected[0];
    return {
      text: `A pH-balanced cleanser is the foundation of every effective routine. **${topCleanser.name}** (${formatPrice(topCleanser.price)}) gently lifts impurities without stripping your skin's natural lipid barrier.`,
      suggestedProducts: selected.slice(0, 2),
    };
  }

  // 4. Moisturizer / Cream queries
  if (queryLower.includes('moisturizer') || queryLower.includes('cream') || queryLower.includes('lotion')) {
    const moisturizers = catalog.filter((p) => p.category === 'moisturizer');
    const selected = moisturizers.length ? moisturizers : ranked;
    const topMoisturizer = selected[0];
    return {
      text: `To seal in hydration and strengthen your skin barrier, **${topMoisturizer.name}** (${formatPrice(topMoisturizer.price)}) is an ideal fit for ${skinType} skin. ${topMoisturizer.description}`,
      suggestedProducts: selected.slice(0, 2),
    };
  }

  // 5. Retinol / Aging / Fine lines queries
  if (queryLower.includes('retinol') || queryLower.includes('aging') || queryLower.includes('wrinkle') || queryLower.includes('fine line')) {
    const retinolProducts = catalog.filter(
      (p) => p.ingredients.some((i) => i.toLowerCase().includes('retinol') || i.toLowerCase().includes('bakuchiol')) || p.description.toLowerCase().includes('retinol')
    );
    const selected = retinolProducts.length ? retinolProducts : ranked;
    const topRetinol = selected[0];
    return {
      text: `For accelerating cellular turnover and targeting fine lines, **${topRetinol.name}** (${formatPrice(topRetinol.price)}) is specifically formulated with encapsulated actives to deliver results with minimal irritation.`,
      suggestedProducts: selected.slice(0, 2),
    };
  }

  // 6. Vitamin C / Brightening / Hyperpigmentation queries
  if (queryLower.includes('vitamin c') || queryLower.includes('bright') || queryLower.includes('dark spot') || queryLower.includes('pigmentation')) {
    const vitCProducts = catalog.filter(
      (p) => p.ingredients.some((i) => i.toLowerCase().includes('ascorbic') || i.toLowerCase().includes('vitamin c')) || p.name.includes('Vitamin C')
    );
    const selected = vitCProducts.length ? vitCProducts : ranked;
    const topVitC = selected[0];
    return {
      text: `To fade hyperpigmentation and protect against oxidative environmental damage, **${topVitC.name}** (${formatPrice(topVitC.price)}) provides potent antioxidant brightening.`,
      suggestedProducts: selected.slice(0, 2),
    };
  }

  // 7. Hyaluronic Acid / Hydration queries
  if (queryLower.includes('hyaluronic') || queryLower.includes('dehydrat') || queryLower.includes('dry') || queryLower.includes('flak')) {
    const haProducts = catalog.filter(
      (p) => p.ingredients.some((i) => i.toLowerCase().includes('hyaluron')) || p.description.toLowerCase().includes('hydrat')
    );
    const selected = haProducts.length ? haProducts : ranked;
    const topHA = selected[0];
    return {
      text: `Hyaluronic acid binds up to 1,000 times its weight in water for multi-depth cellular hydration. We recommend **${topHA.name}** (${formatPrice(topHA.price)}) to plump dehydration lines and restore bounce.`,
      suggestedProducts: selected.slice(0, 2),
    };
  }

  // 8. Acne / Pimples / BHA queries
  if (queryLower.includes('acne') || queryLower.includes('pimple') || queryLower.includes('breakout') || queryLower.includes('spot') || queryLower.includes('bha')) {
    const acneProducts = ranked.filter(
      (p) => p.category === 'exfoliant' || p.ingredients.some((i) => i.toLowerCase().includes('salicylic') || i.toLowerCase().includes('bha') || i.toLowerCase().includes('zinc'))
    );
    const selected = acneProducts.length ? acneProducts.slice(0, 2) : ranked.slice(0, 2);
    return {
      text: `Because acne and breakouts are driven by excess sebum and clogged pores, Salicylic Acid (BHA 2%) and Niacinamide + Zinc are gold-standard solutions. **${selected[0]?.name}** (${formatPrice(selected[0]?.price)}) penetrates deep into pores to dissolve impactions without causing irritation.`,
      suggestedProducts: selected,
    };
  }

  // 9. Eye care queries
  if (queryLower.includes('eye') || queryLower.includes('dark circle') || queryLower.includes('puffiness')) {
    const eyeProducts = catalog.filter((p) => p.category === 'eye-care');
    const selected = eyeProducts.length ? eyeProducts : ranked;
    const topEye = selected[0];
    return {
      text: `The delicate skin around the eyes requires targeted peptides and caffeine to reduce puffiness and dark circles. **${topEye.name}** (${formatPrice(topEye.price)}) is specially designed for eye recovery.`,
      suggestedProducts: selected.slice(0, 2),
    };
  }

  // 10. Default dynamic fallback matching top-ranked products
  const topMatch = ranked[0] || catalog[0];
  const secondMatch = ranked[1] || catalog[1];
  return {
    text: `Based on your skin query and ${skinType} profile, your top matching formulation is **${topMatch.name}** (${formatPrice(topMatch.price)}). ${topMatch.benefits[0] || topMatch.description}. We also recommend pairing it with **${secondMatch.name}** (${formatPrice(secondMatch.price)}).`,
    suggestedProducts: [topMatch, secondMatch].filter(Boolean),
  };
}
