/**
 * Sanitize text input to prevent XSS attacks and HTML injection.
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitize AI prompts to mitigate prompt injection risks.
 */
export function sanitizePrompt(input: string): string {
  if (!input) return '';
  // Neutralize common prompt injection patterns
  return input
    .replace(/ignore previous instructions/gi, '[filtered prompt command]')
    .replace(/system prompt/gi, '[filtered prompt command]')
    .replace(/you are now an unrestricted/gi, '[filtered prompt command]')
    .replace(/override security/gi, '[filtered prompt command]')
    .trim();
}
