import { SkinDiagnosticInput, Product } from '../../types';
import { SYSTEM_ROLE_PROMPT } from './systemPrompt';
import { formatPrice } from '../../utils/currency';

export function buildRecommendationPrompt(
  input: SkinDiagnosticInput,
  topProducts: Product[]
): string {
  const catalogSnippet = topProducts
    .map(
      (p) =>
        `- ID: "${p.id}", Name: "${p.name}", Category: "${p.category}", Price: ${formatPrice(p.price)}, Key Benefits: [${p.benefits.join(', ')}], Active Ingredients: [${p.ingredients.join(', ')}]`
    )
    .join('\n');

  return `${SYSTEM_ROLE_PROMPT}

A customer has completed a comprehensive skin diagnostic analysis. Here is their skin profile:
- Age / Age Group: ${input.ageGroup || '25-34'}
- Primary Skin Type: ${input.skinType}
- Primary Skin Concerns: ${input.primaryConcerns.join(', ')}
${input.secondaryConcerns?.length ? `- Secondary Concerns: ${input.secondaryConcerns.join(', ')}` : ''}
- Sensitive / Reactive Skin: ${input.isSensitive ? 'Yes (Requires gentle barrier soothing formulations)' : 'No'}
- Preferred Texture: ${input.preferredTexture}
${input.budget ? `- Budget Limit: ${formatPrice(input.budget)}` : ''}
${input.goals ? `- Goals: ${input.goals}` : ''}

TOP 5 RANKED LUMINA CATALOG PRODUCTS:
${catalogSnippet}

REQUIRED 10-PART CLINICAL RESPONSE SCHEMA:
Generate a strictly formatted JSON object matching this exact structure:
{
  "summary": "Tailored routine summary string for ${input.ageGroup} ${input.skinType} skin focusing on ${input.primaryConcerns.join(' & ')}.",
  "skinAnalysis": "Detailed 2-3 sentence physiological explanation of why their ${input.skinType} skin produces excess oil/dryness/pigmentation.",
  "morningRoutine": [
    {
      "step": 1,
      "productId": "id-from-catalog",
      "productName": "Exact Product Name",
      "reason": "Specific clinical reason why this product fits their skin type and concern.",
      "estimatedTime": "1 minute"
    }
  ],
  "nightRoutine": [
    {
      "step": 1,
      "productId": "id-from-catalog",
      "productName": "Exact Product Name",
      "reason": "Specific clinical reason why this product repairs their skin overnight.",
      "estimatedTime": "2 minutes"
    }
  ],
  "recommendedIngredients": [
    {
      "name": "Active Ingredient Name",
      "mechanism": "Biological mechanism of action on the skin.",
      "benefits": "Key skin benefits.",
      "compatibility": "Pairing compatibility advice.",
      "possibleIrritationNotes": "Usage frequency or patch testing warning."
    }
  ],
  "whyTheseProducts": "Clear explanation of product selection logic.",
  "lifestyleTips": [
    "Hydration tip...",
    "Sleep tip...",
    "Dietary tip...",
    "Stress tip...",
    "Pillow hygiene & Sun protection tip..."
  ],
  "ingredientInteractionNotes": "Explicit warnings on active ingredient combinations (e.g. BHA + Retinol).",
  "expectedTimeline": {
    "week1": "Initial skin feel and moisture barrier adjustment.",
    "week2": "Reduced T-zone shine or initial hydration improvement.",
    "week4": "Noticeable reduction in breakouts/fine lines.",
    "week8": "Significant improvement in dark marks and overall skin clarity.",
    "maintenance": "Sustained barrier resilience with daily SPF."
  },
  "recommendationConfidence": {
    "confidenceScore": 96,
    "matchReasons": [
      "✓ Matched ${input.skinType} Skin Type",
      "✓ Addressed ${input.primaryConcerns[0] || 'Concerns'}",
      "✓ Budget Compatible"
    ]
  },
  "clarifyingQuestion": null
}

STRICT RULES:
1. "productId" MUST be chosen ONLY from the 5 Lumina IDs provided above.
2. Explanations MUST be specific, non-generic, and reference their ${input.skinType} skin and ${input.primaryConcerns.join(', ')}.
3. Output ONLY valid JSON matching this schema with no extra commentary or markdown.`;
}
