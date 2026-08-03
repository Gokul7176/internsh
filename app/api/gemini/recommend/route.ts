import { NextRequest } from 'next/server';
import { generateSkinRecommendation } from '@/lib/gemini';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { SkinDiagnosticInputSchema } from '@/validators';
import { checkRateLimit } from '@/lib/rateLimit';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon-client';
    const rateLimit = checkRateLimit(`recommend-${ip}`, { maxRequests: 15, intervalMs: 60_000 });

    if (!rateLimit.isAllowed) {
      return apiError('Rate limit exceeded. Please wait a moment before generating another recommendation.', 429);
    }

    const body: unknown = await req.json();
    const validation = SkinDiagnosticInputSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Invalid diagnostic input payload', 400, validation.error.format());
    }

    const recommendation = await generateSkinRecommendation(validation.data, INITIAL_PRODUCTS);
    return apiSuccess(recommendation);
  } catch (error: unknown) {
    logger.error('Failed to generate skin recommendation', error);
    const message = error instanceof Error ? error.message : 'Failed to generate skin recommendation';
    return apiError(message, 500);
  }
}
