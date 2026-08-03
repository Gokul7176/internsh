import { NextRequest } from 'next/server';
import { askGeminiChatbot } from '@/lib/gemini';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { AIChatRequestSchema } from '@/validators';
import { checkRateLimit } from '@/lib/rateLimit';
import { apiSuccess, apiError } from '@/lib/apiResponse';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon-client';
    const rateLimit = checkRateLimit(`chat-${ip}`, { maxRequests: 30, intervalMs: 60_000 });

    if (!rateLimit.isAllowed) {
      return apiError('Rate limit exceeded. Please wait a moment before sending another query.', 429);
    }

    const body: unknown = await req.json();
    const validation = AIChatRequestSchema.safeParse(body);

    if (!validation.success) {
      return apiError('Invalid request payload', 400, validation.error.format());
    }

    const { query, history } = validation.data;
    const result = await askGeminiChatbot(query, history || [], INITIAL_PRODUCTS);

    return apiSuccess(result);
  } catch (error: unknown) {
    logger.error('Failed to process AI chat query', error);
    const message = error instanceof Error ? error.message : 'Failed to process AI chat query';
    return apiError(message, 500);
  }
}
