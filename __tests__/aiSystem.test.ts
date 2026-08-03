import { describe, it, expect } from 'vitest';
import { generateSkinRecommendation, askGeminiChatbot } from '../lib/gemini';
import { INITIAL_PRODUCTS } from '../lib/mockData';
import { SkinDiagnosticInput } from '../types';
import { rankProductsForUser } from '../lib/ai/productRanker';
import { extractProfileFromText } from '../lib/ai/profileExtractor';

describe('AI System & Personalization Engine', () => {
  it('extracts user profile attributes from natural language queries', () => {
    const query = 'I am 20 years old with oily skin and pimples under ₹1500';
    const extracted = extractProfileFromText(query);

    expect(extracted.age).toBe(20);
    expect(extracted.ageGroup).toBe('18-24');
    expect(extracted.skinType).toBe('oily');
    expect(extracted.primaryConcerns).toContain('Acne & Clogged Pores');
    expect(extracted.budget).toBe(1500);
  });

  it('ranks top 5 products accurately for acne-prone oily skin', () => {
    const ranked = rankProductsForUser(INITIAL_PRODUCTS, {
      skinType: 'oily',
      primaryConcerns: ['Acne & Clogged Pores', 'Excess T-Zone Oil'],
      maxBudget: 2000,
    });

    expect(ranked.length).toBeLessThanOrEqual(5);
    const topCategories = ranked.map((p) => p.category);
    expect(topCategories).toContain('cleanser');
    expect(topCategories).toContain('serum');
    
    const topProductNames = ranked.map((p) => p.name.toLowerCase()).join(' ');
    expect(topProductNames).toMatch(/(salicylic|bha|niacinamide|cleanser)/);
  });

  it('generates 10-part clinical recommendations with skin analysis, reasons, timeline, and confidence score', async () => {
    const teenAcneInput: SkinDiagnosticInput = {
      skinType: 'oily',
      ageGroup: '18-24',
      primaryConcerns: ['Acne & Clogged Pores'],
      isSensitive: false,
      preferredTexture: 'Lightweight Gel',
      budget: 1500,
    };

    const adultAntiAgingInput: SkinDiagnosticInput = {
      skinType: 'dry',
      ageGroup: '35-44',
      primaryConcerns: ['Fine Lines & Wrinkles'],
      isSensitive: false,
      preferredTexture: 'Rich Velvet Cream',
      budget: 3500,
    };

    const teenResult = await generateSkinRecommendation(teenAcneInput, INITIAL_PRODUCTS);
    const adultResult = await generateSkinRecommendation(adultAntiAgingInput, INITIAL_PRODUCTS);

    expect(teenResult.skinAnalysis).toBeTruthy();
    expect(adultResult.skinAnalysis).toBeTruthy();
    expect(teenResult.skinAnalysis).not.toBe(adultResult.skinAnalysis);

    expect(teenResult.expectedTimeline).toBeDefined();
    expect(teenResult.expectedTimeline?.week4).toBeTruthy();

    expect(teenResult.recommendationConfidence).toBeDefined();
    expect(teenResult.recommendationConfidence?.confidenceScore).toBeGreaterThanOrEqual(80);

    expect(teenResult.morningRoutine[0].reason).toBeTruthy();
    expect(teenResult.morningRoutine[0].estimatedTime).toBeTruthy();
  });

  it('handles sensitive skin safely by avoiding harsh irritants', async () => {
    const sensitiveInput: SkinDiagnosticInput = {
      skinType: 'sensitive',
      ageGroup: '25-34',
      primaryConcerns: ['Redness & Rosacea'],
      isSensitive: true,
      preferredTexture: 'Soothing Cream',
      budget: 2500,
    };

    const result = await generateSkinRecommendation(sensitiveInput, INITIAL_PRODUCTS);
    expect(result.expertAdvice.toLowerCase()).toMatch(/(sensitive|patch|gentle|sooth|reactive)/);
  });

  it('answers ingredient queries with scientific accuracy and suggests matching products', async () => {
    const userQuery = 'Can I mix Niacinamide with Vitamin C?';
    const userProfile = { skinType: 'combination', primaryConcerns: ['Hyperpigmentation'] };

    const response = await askGeminiChatbot(userQuery, [], INITIAL_PRODUCTS, userProfile);
    expect(response.text.length).toBeGreaterThan(20);
    expect(response.text.toLowerCase()).toMatch(/(vitamin c|niacinamide|synergistic|together|morning)/);
    expect(response.suggestedProducts).toBeDefined();
    expect(response.suggestedProducts!.length).toBeGreaterThan(0);
  });

  it('returns distinct relevant products for different chatbot query topics', async () => {
    const sunscreenRes = await askGeminiChatbot('Can you recommend a good sunscreen?', [], INITIAL_PRODUCTS);
    expect(sunscreenRes.suggestedProducts?.[0]?.category).toBe('sunscreen');

    const moisturizerRes = await askGeminiChatbot('I need a rich cream for dry skin', [], INITIAL_PRODUCTS);
    expect(moisturizerRes.suggestedProducts?.[0]?.category).toBe('moisturizer');

    const retinolRes = await askGeminiChatbot('Best retinol product for fine lines and anti-aging', [], INITIAL_PRODUCTS);
    expect(retinolRes.suggestedProducts?.[0]?.ingredients.join(' ').toLowerCase()).toMatch(/(retinol|bakuchiol)/);

    expect(sunscreenRes.suggestedProducts?.[0]?.id).not.toBe(moisturizerRes.suggestedProducts?.[0]?.id);
    expect(sunscreenRes.suggestedProducts?.[0]?.id).not.toBe(retinolRes.suggestedProducts?.[0]?.id);
  });

  it('handles friendly greetings without forcing a product recommendation text', async () => {
    const greetingRes = await askGeminiChatbot('hi', [], INITIAL_PRODUCTS);
    expect(greetingRes.text.toLowerCase()).toMatch(/(hello|how can i assist|skincare advisor)/);
    expect(greetingRes.text.toLowerCase()).not.toMatch(/based on your skin query and combination profile/);
  });

  it('handles typos in user concerns like "i have piple"', async () => {
    const typoRes = await askGeminiChatbot('i have piple', [], INITIAL_PRODUCTS);
    expect(typoRes.text.toLowerCase()).toMatch(/(acne|sebum|salicylic|bha|pores|pimple|breakout)/);
    expect(typoRes.suggestedProducts?.[0]?.name.toLowerCase()).toMatch(/(salicylic|bha|niacinamide|exfoliant)/);
  });
});
