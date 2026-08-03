import { GoogleGenAI } from '@google/genai';
import { SkinDiagnosticInput, AIRoutineRecommendation, ChatMessage, Product, SkinType } from '../types';
import { INITIAL_PRODUCTS } from './mockData';
import { GeminiRecommendationOutputSchema } from '../validators';
import { safeJsonParse } from './utils';
import { sanitizePrompt } from './sanitizer';
import { AI_CONFIG } from '../config/ai';
import { rankProductsForUser } from './ai/productRanker';
import { extractProfileFromText } from './ai/profileExtractor';
import { buildRecommendationPrompt, buildChatPrompt } from './prompts/promptBuilder';
import { retryWithBackoff } from './ai/retry';
import { aiCache } from './ai/cache';
import {
  generatePersonalizedFallbackRecommendation,
  generatePersonalizedFallbackChat,
} from './ai/fallbackEngine';
import { logger } from './logger';

// Server-only Gemini API Key initialization
const apiKey = process.env.GEMINI_API_KEY || '';
export const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateSkinRecommendation(
  input: SkinDiagnosticInput,
  catalogProducts: Product[] = INITIAL_PRODUCTS
): Promise<AIRoutineRecommendation> {
  const startTime = Date.now();
  const cacheKey = JSON.stringify(input);

  // Check cache first
  const cached = aiCache.get<AIRoutineRecommendation>(cacheKey);
  if (cached) {
    logger.info('Returning cached AI skin recommendation');
    return cached;
  }

  // Pre-filter catalog to top 5 products
  const rankedCatalog = rankProductsForUser(
    catalogProducts,
    {
      skinType: input.skinType,
      primaryConcerns: input.primaryConcerns,
      secondaryConcerns: input.secondaryConcerns,
      isSensitive: input.isSensitive,
      maxBudget: input.budget,
    },
    5
  );

  if (aiClient) {
    try {
      const prompt = buildRecommendationPrompt(input, rankedCatalog);

      const result = await retryWithBackoff(async () => {
        // AbortController timeout (15s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);

        try {
          const res = await aiClient.models.generateContent({
            model: AI_CONFIG.model,
            contents: prompt,
            config: {
              temperature: AI_CONFIG.temperature,
              topP: AI_CONFIG.topP,
              topK: AI_CONFIG.topK,
              maxOutputTokens: AI_CONFIG.maxOutputTokens,
              responseMimeType: AI_CONFIG.responseMimeType,
            },
          });
          return res;
        } finally {
          clearTimeout(timeoutId);
        }
      });

      const responseText = result.text || '';
      const cleaned = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsedRaw = safeJsonParse<unknown>(cleaned, null);

      if (parsedRaw) {
        const validated = GeminiRecommendationOutputSchema.safeParse(parsedRaw);
        if (validated.success) {
          const data = validated.data;

          const recommendation: AIRoutineRecommendation = {
            summary: data.summary,
            skinAnalysis: data.skinAnalysis,
            morningRoutine: data.morningRoutine.map((step) => {
              const matchedProduct =
                catalogProducts.find((p) => p.id === (step.productId || step.recommendedProductId)) ||
                rankedCatalog.find((p) => p.category === step.productCategory) ||
                catalogProducts[0];
              return {
                step: step.step,
                title: step.title || `Morning Step ${step.step}`,
                productCategory: matchedProduct.category,
                productId: matchedProduct.id,
                productName: matchedProduct.name,
                recommendedProduct: matchedProduct,
                explanation: step.reason || step.explanation || `Selected for ${input.skinType} skin.`,
                reason: step.reason || step.explanation || `Selected for ${input.skinType} skin.`,
                estimatedTime: step.estimatedTime || '1-2 minutes',
              };
            }),
            eveningRoutine: (data.nightRoutine || data.eveningRoutine || []).map((step) => {
              const matchedProduct =
                catalogProducts.find((p) => p.id === (step.productId || step.recommendedProductId)) ||
                rankedCatalog.find((p) => p.category === step.productCategory) ||
                catalogProducts[1];
              return {
                step: step.step,
                title: step.title || `Evening Step ${step.step}`,
                productCategory: matchedProduct.category,
                productId: matchedProduct.id,
                productName: matchedProduct.name,
                recommendedProduct: matchedProduct,
                explanation: step.reason || step.explanation || `Selected for ${input.skinType} night repair.`,
                reason: step.reason || step.explanation || `Selected for ${input.skinType} night repair.`,
                estimatedTime: step.estimatedTime || '1-2 minutes',
              };
            }),
            recommendedIngredients: data.recommendedIngredients,
            whyTheseProducts: data.whyTheseProducts,
            expertAdvice: data.expertAdvice || 'Prioritize daily broad-spectrum SPF 50 application.',
            lifestyleTips: data.lifestyleTips || [
              'Drink 2.5L water daily to maintain barrier moisture.',
              'Change pillowcases twice weekly to minimize acne bacterial transfer.',
            ],
            ingredientInteractionNotes: data.ingredientInteractionNotes,
            expectedTimeline: data.expectedTimeline,
            recommendationConfidence: data.recommendationConfidence,
            clarifyingQuestion: data.clarifyingQuestion || undefined,
            suggestedIngredients: Array.isArray(data.recommendedIngredients)
              ? data.recommendedIngredients.map((i) => (typeof i === 'string' ? i : i.name))
              : ['Niacinamide', 'Ceramides', 'Salicylic Acid'],
          };

          aiCache.set(cacheKey, recommendation);
          logger.info(`Generated clinical AI recommendation in ${Date.now() - startTime}ms`);
          return recommendation;
        } else {
          logger.warn('Gemini recommendation JSON schema validation failed', validated.error.format());
        }
      }
    } catch (err) {
      logger.error('Gemini API call failed after retries, invoking personalized fallback engine:', err);
    }
  } else {
    logger.warn('GEMINI_API_KEY missing, using personalized fallback engine');
  }

  // Personalized Fallback Engine
  const fallback = generatePersonalizedFallbackRecommendation(input, catalogProducts);
  aiCache.set(cacheKey, fallback);
  return fallback;
}

export async function askGeminiChatbot(
  userQuery: string,
  history: ChatMessage[] = [],
  catalogProducts: Product[] = INITIAL_PRODUCTS,
  userProfile?: { skinType?: string; primaryConcerns?: string[]; ageGroup?: string; isSensitive?: boolean; budget?: number }
): Promise<{ text: string; suggestedProducts?: Product[]; structuredAnalysis?: AIRoutineRecommendation }> {
  const startTime = Date.now();
  const sanitizedQuery = sanitizePrompt(userQuery);

  // Extract natural language user profile attributes from prompt if query contains profile info
  const extracted = extractProfileFromText(sanitizedQuery);
  const queryConcerns = extracted.primaryConcerns.length ? extracted.primaryConcerns : [];
  const profileConcerns = userProfile?.primaryConcerns || [];
  const combinedConcerns = Array.from(
    new Set([
      ...queryConcerns,
      ...profileConcerns,
      ...(queryConcerns.length === 0 && profileConcerns.length === 0 ? [sanitizedQuery] : [])
    ])
  );

  const effectiveProfile = {
    skinType: extracted.skinType || userProfile?.skinType || 'combination',
    primaryConcerns: combinedConcerns,
    ageGroup: userProfile?.ageGroup || extracted.ageGroup || '25-34',
    isSensitive: extracted.isSensitive || userProfile?.isSensitive || false,
    budget: extracted.budget || userProfile?.budget,
  };

  const cacheKey = `chat_${sanitizedQuery.toLowerCase().trim()}_${JSON.stringify(effectiveProfile)}_${history.length}`;

  const cached = aiCache.get<{ text: string; suggestedProducts?: Product[]; structuredAnalysis?: AIRoutineRecommendation }>(cacheKey);
  if (cached) {
    logger.info('Returning cached AI chat response');
    return cached;
  }

  const rankedCatalog = rankProductsForUser(
    catalogProducts,
    {
      skinType: effectiveProfile.skinType as SkinType,
      primaryConcerns: effectiveProfile.primaryConcerns,
      isSensitive: effectiveProfile.isSensitive,
      maxBudget: effectiveProfile.budget,
    },
    5
  );

  if (aiClient) {
    try {
      const prompt = buildChatPrompt(sanitizedQuery, history, rankedCatalog, effectiveProfile);

      const result = await retryWithBackoff(async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);
        try {
          return await aiClient.models.generateContent({
            model: AI_CONFIG.model,
            contents: prompt,
            config: {
              temperature: AI_CONFIG.temperature,
              topP: AI_CONFIG.topP,
              topK: AI_CONFIG.topK,
              maxOutputTokens: AI_CONFIG.maxOutputTokens,
            },
          });
        } finally {
          clearTimeout(timeoutId);
        }
      });

      const responseText = result.text || '';
      const cleaned = responseText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      const parsedRaw = safeJsonParse<{ text?: string; recommendedProductIds?: string[] } | null>(cleaned, null);

      if (parsedRaw && typeof parsedRaw.text === 'string' && parsedRaw.text.length > 0) {
        let suggestedProducts: Product[] = [];

        if (Array.isArray(parsedRaw.recommendedProductIds)) {
          suggestedProducts = catalogProducts.filter((p) =>
            parsedRaw.recommendedProductIds?.includes(p.id)
          );
        }

        if (suggestedProducts.length === 0) {
          suggestedProducts = catalogProducts.filter((p) =>
            parsedRaw.text?.toLowerCase().includes(p.name.toLowerCase()) ||
            parsedRaw.text?.toLowerCase().includes(p.category.toLowerCase())
          );
        }

        if (suggestedProducts.length === 0) {
          suggestedProducts = rankedCatalog.slice(0, 2);
        }

        const chatResponse = {
          text: parsedRaw.text,
          suggestedProducts: suggestedProducts.slice(0, 2),
        };

        aiCache.set(cacheKey, chatResponse);
        logger.info(`Generated AI chat response in ${Date.now() - startTime}ms`);
        return chatResponse;
      } else {
        const matched = catalogProducts.filter((p) => responseText.toLowerCase().includes(p.name.toLowerCase()));
        const chatResponse = {
          text: responseText,
          suggestedProducts: matched.length > 0 ? matched.slice(0, 2) : rankedCatalog.slice(0, 2),
        };
        aiCache.set(cacheKey, chatResponse);
        return chatResponse;
      }
    } catch (err) {
      logger.error('Gemini chat API call error, invoking personalized fallback engine:', err);
    }
  }

  const fallback = generatePersonalizedFallbackChat(sanitizedQuery, catalogProducts, effectiveProfile);
  aiCache.set(cacheKey, fallback);
  return fallback;
}
