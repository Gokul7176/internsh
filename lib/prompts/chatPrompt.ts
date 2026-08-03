import { ChatMessage, Product } from '../../types';
import { SYSTEM_ROLE_PROMPT } from './systemPrompt';
import { formatPrice } from '../../utils/currency';

export interface ChatUserProfile {
  ageGroup?: string;
  skinType?: string;
  primaryConcerns?: string[];
  secondaryConcerns?: string[];
  isSensitive?: boolean;
  budget?: number;
}

export function buildChatPrompt(
  userQuery: string,
  history: ChatMessage[] = [],
  topProducts: Product[] = [],
  userProfile?: ChatUserProfile
): string {
  const recentHistory = history.slice(-10);
  const historyText = recentHistory
    .map((msg) => `${msg.sender.toUpperCase()}: ${msg.text}`)
    .join('\n');

  const catalogSnippet = topProducts
    .map((p) => `- ID: "${p.id}", Name: "${p.name}", Category: "${p.category}", Price: ${formatPrice(p.price)}, Benefits: [${p.benefits.join(', ')}]`)
    .join('\n');

  let profileSnippet = '';
  if (userProfile && (userProfile.skinType || userProfile.primaryConcerns?.length || userProfile.ageGroup)) {
    profileSnippet = `EXTRACTED USER PROFILE CONTEXT:
- Age Group: ${userProfile.ageGroup || 'Not specified'}
- Skin Type: ${userProfile.skinType || 'Not specified'}
- Primary Concerns: ${userProfile.primaryConcerns?.join(', ') || 'Not specified'}
- Sensitive Skin: ${userProfile.isSensitive ? 'Yes' : 'No'}
${userProfile.budget ? `- Budget Limit: ${formatPrice(userProfile.budget)}` : ''}\n`;
  }

  return `${SYSTEM_ROLE_PROMPT}

${profileSnippet}TOP 5 Lumina Catalog Products:
${catalogSnippet}

${historyText ? `RECENT CONVERSATION HISTORY (Last 10 messages):\n${historyText}\n` : ''}
CURRENT USER QUERY: "${userQuery}"

RESPONSE INSTRUCTIONS:
1. Provide a warm, conversational, non-robotic expert answer (120-180 words). Rather than starting with generic boilerplate ("We recommend..."), say "Based on what you've told me, your biggest priority is..." or "Because of your skin profile..."
2. Address the user's specific skin query or concern directly with biological precision.
3. Reference 1-2 top matching products from the Lumina catalog list above by exact name.
4. Output JSON matching this schema:
{
  "text": "Your conversational expert answer text...",
  "recommendedProductIds": ["id1", "id2"]
}`;
}
