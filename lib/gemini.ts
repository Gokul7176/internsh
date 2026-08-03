import { GoogleGenAI } from '@google/genai';
import { SkinDiagnosticInput, AIRoutineRecommendation, ChatMessage, Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/mockData';
import { GeminiRecommendationOutputSchema } from '@/validators';
import { safeJsonParse } from '@/lib/utils';
import { sanitizePrompt } from '@/lib/sanitizer';

// Server-only Gemini API Key initialization
const apiKey = process.env.GEMINI_API_KEY || '';
export const aiClient = apiKey ? new GoogleGenAI({ apiKey }) : null;

export async function generateSkinRecommendation(
  input: SkinDiagnosticInput,
  catalogProducts: Product[] = INITIAL_PRODUCTS
): Promise<AIRoutineRecommendation> {
  if (aiClient) {
    try {
      const sanitizedConcerns = input.primaryConcerns.map(sanitizePrompt).join(', ');
      const prompt = `You are a world-class dermatological aesthetician for Lumina Skincare.
A customer has provided the following skin analysis:
- Skin Type: ${input.skinType}
- Age Group: ${sanitizePrompt(input.ageGroup)}
- Primary Concerns: ${sanitizedConcerns}
- Sensitive Skin: ${input.isSensitive ? 'Yes' : 'No'}
- Preferred Texture: ${sanitizePrompt(input.preferredTexture)}

Available Catalog Products:
${catalogProducts.map((p) => `- ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Benefits: ${p.benefits.join(', ')}`).join('\n')}

Generate a JSON object with:
1. "morningRoutine": Array of steps (step, title, productCategory, recommendedProductId, explanation)
2. "eveningRoutine": Array of steps (step, title, productCategory, recommendedProductId, explanation)
3. "expertAdvice": Summary string of tailored advice.
4. "suggestedIngredients": Array of 3 key ingredients they should look for.

Return ONLY valid JSON matching this exact structure with no markdown wrapping.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedRaw = safeJsonParse<unknown>(cleaned, null);

      if (parsedRaw) {
        const validated = GeminiRecommendationOutputSchema.safeParse(parsedRaw);
        if (validated.success) {
          const data = validated.data;
          return {
            morningRoutine: data.morningRoutine.map((step) => ({
              ...step,
              recommendedProduct: catalogProducts.find(
                (p) => p.id === step.recommendedProductId || p.category === step.productCategory
              ),
            })),
            eveningRoutine: data.eveningRoutine.map((step) => ({
              ...step,
              recommendedProduct: catalogProducts.find(
                (p) => p.id === step.recommendedProductId || p.category === step.productCategory
              ),
            })),
            expertAdvice: data.expertAdvice,
            suggestedIngredients: data.suggestedIngredients,
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call error, falling back to smart recommender engine:', err);
    }
  }

  // Smart local fallback response generator
  const cleanser = catalogProducts.find((p) => p.category === 'cleanser') || catalogProducts[0];
  const serum =
    catalogProducts.find((p) => p.category === 'serum' && p.skinType.includes(input.skinType)) ||
    catalogProducts[1];
  const moisturizer = catalogProducts.find((p) => p.category === 'moisturizer') || catalogProducts[2];
  const sunscreen = catalogProducts.find((p) => p.category === 'sunscreen') || catalogProducts[3];
  const exfoliantOrNight =
    catalogProducts.find(
      (p) => p.category === 'exfoliant' || (p.category === 'serum' && p.usage === 'evening')
    ) || catalogProducts[4];

  return {
    morningRoutine: [
      {
        step: 1,
        title: 'Gentle Purifying Cleanse',
        productCategory: 'cleanser',
        recommendedProduct: cleanser,
        explanation: `Start your day with ${cleanser.name} to remove overnight sebum without stripping your ${input.skinType} skin.`,
      },
      {
        step: 2,
        title: 'Targeted Antioxidant Treatment',
        productCategory: 'serum',
        recommendedProduct: serum,
        explanation: `Apply ${serum.name} to treat ${input.primaryConcerns.join(' and ')} and neutralize free radicals.`,
      },
      {
        step: 3,
        title: 'Barrier Hydration',
        productCategory: 'moisturizer',
        recommendedProduct: moisturizer,
        explanation: `Lock in hydration with ${moisturizer.name} for 24-hour dewiness and barrier repair.`,
      },
      {
        step: 4,
        title: 'Broad Spectrum UV Shield',
        productCategory: 'sunscreen',
        recommendedProduct: sunscreen,
        explanation: `Protect your skin against photo-aging with ${sunscreen.name} SPF 50.`,
      },
    ],
    eveningRoutine: [
      {
        step: 1,
        title: 'Double Cleanse',
        productCategory: 'cleanser',
        recommendedProduct: cleanser,
        explanation: `Deep clean SPF, makeup, and daily pollutants using ${cleanser.name}.`,
      },
      {
        step: 2,
        title: 'Cellular Renewal Treatment',
        productCategory: 'exfoliant',
        recommendedProduct: exfoliantOrNight,
        explanation: `Apply ${exfoliantOrNight.name} to stimulate overnight skin repair and refine pore texture.`,
      },
      {
        step: 3,
        title: 'Nourishing Night Cream',
        productCategory: 'moisturizer',
        recommendedProduct: moisturizer,
        explanation: `Finish with a generous layer of ${moisturizer.name} to seal in moisture while you sleep.`,
      },
    ],
    expertAdvice: `Based on your ${input.skinType} skin profile and concerns regarding ${input.primaryConcerns.join(', ')}, we recommend prioritizing gentle pH-balanced cleansers, daily broad-spectrum mineral SPF, and barrier-replenishing Ceramides. ${input.isSensitive ? 'Since your skin is sensitive, introduce active ingredients gradually 2-3 times per week.' : ''}`,
    suggestedIngredients: ['Niacinamide', 'Ceramides', 'Hyaluronic Acid', 'Vitamin C'],
  };
}

export async function askGeminiChatbot(
  userQuery: string,
  history: ChatMessage[] = [],
  catalogProducts: Product[] = INITIAL_PRODUCTS
): Promise<{ text: string; suggestedProducts?: Product[] }> {
  const sanitizedQuery = sanitizePrompt(userQuery);

  if (aiClient) {
    try {
      const historyContext = history.slice(-4).map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join('\n');
      const prompt = `You are Lumina AI, a friendly, ultra-knowledgeable luxury skincare aesthetician for Lumina Skincare.
${historyContext ? `Recent Chat Context:\n${historyContext}\n` : ''}
Customer Query: "${sanitizedQuery}"

Catalog Products Available:
${catalogProducts.map((p) => `- ${p.name} (Category: ${p.category}, Price: $${p.price}, ID: ${p.id})`).join('\n')}

Provide a concise, helpful, expert answer (150 words max).
If asking about mixing ingredients (e.g. Niacinamide + Vitamin C), answer accurately with scientific context.
If relevant, mention 1-2 catalog products by exact name.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const replyText = response.text || '';
      const matched = catalogProducts.filter((p) => replyText.toLowerCase().includes(p.name.toLowerCase()));

      return {
        text: replyText,
        suggestedProducts: matched.length > 0 ? matched.slice(0, 2) : undefined,
      };
    } catch (err) {
      console.warn('Gemini chat error, fallback active:', err);
    }
  }

  // Fallback intelligent responder
  const queryLower = sanitizedQuery.toLowerCase();
  let responseText = '';
  let suggested: Product[] = [];

  if (queryLower.includes('niacinamide') && queryLower.includes('vitamin c')) {
    responseText =
      'Yes, you can absolutely use Niacinamide and Vitamin C together! Modern formulations are highly stable and work synergistically: Vitamin C brightens dark spots in the morning while Niacinamide controls oil and strengthens the lipid barrier. We recommend our **Cellular Radiance Vitamin C + E Serum** in the morning followed by **Niacinamide 10% + Zinc** for glowing skin!';
    suggested = catalogProducts.filter(
      (p) => p.name.includes('Vitamin C') || p.name.includes('Niacinamide')
    );
  } else if (queryLower.includes('routine') || queryLower.includes('build')) {
    responseText =
      'A core luxury skincare routine consists of 4 foundational steps:\n1. **Cleanse**: Gentle pH-balanced cleanser.\n2. **Treat**: Antioxidant serum (Vitamin C morning, Retinol evening).\n3. **Hydrate**: Ceramide moisture barrier cream.\n4. **Protect**: Broad-spectrum SPF 50 sunscreen.\nWould you like me to build a custom routine tailored to your skin type?';
    suggested = catalogProducts.slice(0, 3);
  } else if (queryLower.includes('sensitive') || queryLower.includes('redness')) {
    responseText =
      'For sensitive skin, prioritize calming ingredients like Ceramides, Centella Asiatica, and Chamomile while avoiding heavy synthetic fragrances. Our **Aura Barrier Repair Ceramide Cream** and **Lumina Botanical Hydrating Cleanser** are dermatologically formulated to soothe reactive skin.';
    suggested = catalogProducts.filter((p) => p.skinType.includes('sensitive')).slice(0, 2);
  } else if (queryLower.includes('acne') || queryLower.includes('breakout') || queryLower.includes('oily')) {
    responseText =
      'For acne-prone or oily skin, Salicylic Acid (BHA 2%) penetrates deep into pores to dissolve excess sebum, while Niacinamide reduces inflammatory redness. Try our **Clarifying BHA 2% Salicylic Acid Exfoliant** 2-3 nights per week!';
    suggested = catalogProducts.filter(
      (p) => p.category === 'exfoliant' || p.name.includes('Niacinamide')
    );
  } else if (queryLower.includes('hyaluronic acid') || queryLower.includes('dry')) {
    responseText =
      'Hyaluronic Acid is a moisture magnet capable of holding up to 1,000 times its weight in water! Apply our **Multi-Weight Hyaluronic Acid Hydrating Booster** onto damp skin before locking it in with moisturizer.';
    suggested = catalogProducts.filter(
      (p) => p.name.includes('Hyaluronic') || p.category === 'moisturizer'
    ).slice(0, 2);
  } else {
    responseText = `Thank you for asking about skincare! For best results with Lumina products, we recommend pairing our botanical cleansers with active antioxidant serums and daily SPF 50 sunscreen protection. How can I assist with your skin concerns today?`;
    suggested = catalogProducts.slice(0, 2);
  }

  return { text: responseText, suggestedProducts: suggested };
}
