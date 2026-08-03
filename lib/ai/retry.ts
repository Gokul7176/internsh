import { AI_CONFIG } from '../../config/ai';
import { logger } from '../logger';

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = AI_CONFIG.maxRetries,
  delayMs: number = AI_CONFIG.retryInitialDelayMs
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt > retries) {
        logger.error(`AI API call failed after ${retries} retries`, error);
        throw error;
      }
      const backoffDelay = delayMs * Math.pow(2, attempt - 1);
      logger.warn(`AI API call transient error on attempt ${attempt}. Retrying in ${backoffDelay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
  throw new Error('Retry loop ended unexpectedly');
}
