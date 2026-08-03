export const AI_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
  responseMimeType: 'application/json',
  maxRetries: 2,
  retryInitialDelayMs: 500,
  cacheTtlMs: 3600000, // 1 hour
  timeoutMs: 15000, // 15 seconds AbortController timeout
} as const;

export type AIConfig = typeof AI_CONFIG;
