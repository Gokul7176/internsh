import { Product, SkinType } from '../../types';

export interface ProductScoringCriteria {
  skinType: SkinType;
  primaryConcerns: string[];
  secondaryConcerns?: string[];
  isSensitive?: boolean;
  maxBudget?: number;
}

export interface ScoredProduct {
  product: Product;
  score: number;
}

export function rankProductsForUser(
  catalog: Product[],
  criteria: ProductScoringCriteria,
  topN: number = 5
): Product[] {
  if (!catalog || catalog.length === 0) return [];

  const scored: ScoredProduct[] = catalog.map((product) => {
    let score = 0;

    // 1. Skin Type Compatibility (+30 pts for exact match, +20 for 'all')
    if (product.skinType.includes(criteria.skinType)) {
      score += 30;
    } else if (product.skinType.includes('all')) {
      score += 20;
    }

    // 2. Primary Concern Match (+25 pts per matched benefit/ingredient/description)
    const productText = `${product.name} ${product.description} ${product.benefits.join(' ')} ${product.ingredients.join(' ')}`.toLowerCase();
    
    for (const concern of criteria.primaryConcerns) {
      const concernLower = concern.toLowerCase();
      if (productText.includes(concernLower)) {
        score += 25;
      }
      if (concernLower.includes('acne') || concernLower.includes('breakout')) {
        if (productText.includes('salicylic') || productText.includes('bha') || productText.includes('zinc') || productText.includes('clarifying')) {
          score += 20;
        }
      }
      if (concernLower.includes('aging') || concernLower.includes('wrinkle') || concernLower.includes('line')) {
        if (productText.includes('retinol') || productText.includes('peptide') || productText.includes('bakuchiol') || productText.includes('radiance')) {
          score += 20;
        }
      }
      if (concernLower.includes('dry') || concernLower.includes('dehydration') || concernLower.includes('moisture')) {
        if (productText.includes('ceramide') || productText.includes('hyaluronic') || productText.includes('squalane') || productText.includes('hydrat')) {
          score += 20;
        }
      }
      if (concernLower.includes('pigmentation') || concernLower.includes('dark spot') || concernLower.includes('tone')) {
        if (productText.includes('vitamin c') || productText.includes('niacinamide') || productText.includes('bright')) {
          score += 20;
        }
      }
    }

    // 3. Secondary Concern Match (+15 pts)
    if (criteria.secondaryConcerns) {
      for (const sConcern of criteria.secondaryConcerns) {
        if (productText.includes(sConcern.toLowerCase())) {
          score += 15;
        }
      }
    }

    // 4. Sensitive Skin Compatibility (+20 pts for gentle/soothing formulas)
    if (criteria.isSensitive) {
      if (product.skinType.includes('sensitive') || product.skinType.includes('all')) {
        score += 15;
      }
      if (productText.includes('gentle') || productText.includes('sooth') || productText.includes('barrier') || productText.includes('chamomile') || productText.includes('centella')) {
        score += 15;
      }
      if (productText.includes('20%') || productText.includes('strong acid')) {
        score -= 20;
      }
    }

    // 5. Budget Match (+15 pts)
    if (criteria.maxBudget && criteria.maxBudget > 0) {
      if (product.price <= criteria.maxBudget) {
        score += 15;
      } else {
        score -= 10;
      }
    }

    // 6. Rating boost (0-10 pts based on 0-5 rating)
    score += (product.rating || 4.5) * 2;

    // 7. Direct Category & Keyword Boost (+50 pts for category match, +40 for ingredient match)
    for (const concern of criteria.primaryConcerns) {
      const cLower = concern.toLowerCase();

      // Category matching
      if (
        (cLower.includes('sunscreen') || cLower.includes('spf') || cLower.includes('sun protection')) &&
        product.category === 'sunscreen'
      ) {
        score += 50;
      }
      if (
        (cLower.includes('cleanser') || cLower.includes('face wash') || cLower.includes('cleanse')) &&
        product.category === 'cleanser'
      ) {
        score += 50;
      }
      if (
        (cLower.includes('moisturizer') || cLower.includes('cream') || cLower.includes('lotion')) &&
        product.category === 'moisturizer'
      ) {
        score += 50;
      }
      if (
        (cLower.includes('serum') || cLower.includes('booster') || cLower.includes('elixir')) &&
        product.category === 'serum'
      ) {
        score += 50;
      }
      if (
        (cLower.includes('exfoliant') || cLower.includes('peel') || cLower.includes('tonic') || cLower.includes('bha') || cLower.includes('aha')) &&
        product.category === 'exfoliant'
      ) {
        score += 50;
      }
      if (
        (cLower.includes('mask') || cLower.includes('clay')) &&
        product.category === 'mask'
      ) {
        score += 50;
      }
      if (
        (cLower.includes('eye') || cLower.includes('dark circle') || cLower.includes('puffiness')) &&
        product.category === 'eye-care'
      ) {
        score += 50;
      }

      // Ingredient matching
      const ingredientsText = product.ingredients.join(' ').toLowerCase();
      if (cLower.includes('retinol') && ingredientsText.includes('retinol')) score += 40;
      if (cLower.includes('vitamin c') && ingredientsText.includes('ascorbic')) score += 40;
      if (cLower.includes('niacinamide') && ingredientsText.includes('niacinamide')) score += 40;
      if ((cLower.includes('hyaluronic') || cLower.includes('ha')) && ingredientsText.includes('hyaluron')) score += 40;
      if ((cLower.includes('salicylic') || cLower.includes('bha')) && ingredientsText.includes('salicylic')) score += 40;
      if (cLower.includes('glycolic') && ingredientsText.includes('glycolic')) score += 40;
      if (cLower.includes('ceramide') && ingredientsText.includes('ceramide')) score += 40;
      if (cLower.includes('squalane') && ingredientsText.includes('squalane')) score += 40;
      if (cLower.includes('peptide') && ingredientsText.includes('peptide')) score += 40;
      if (cLower.includes('caffeine') && ingredientsText.includes('caffeine')) score += 40;
    }

    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: Product[] = [];
  const categoryCounts = new Map<string, number>();

  const addProduct = (p: Product) => {
    if (selected.some((item) => item.id === p.id)) return;
    selected.push(p);
    categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
  };

  // Check if query or primaryConcerns contains a specific category request
  const hasSpecificCategory = criteria.primaryConcerns.some((c) => {
    const cl = c.toLowerCase();
    return (
      cl.includes('sunscreen') ||
      cl.includes('spf') ||
      cl.includes('cleanser') ||
      cl.includes('wash') ||
      cl.includes('moisturizer') ||
      cl.includes('cream') ||
      cl.includes('serum') ||
      cl.includes('exfoliant') ||
      cl.includes('mask') ||
      cl.includes('eye')
    );
  });

  const maxPerCategory = hasSpecificCategory ? topN : 1;

  // Pass 1: Add highest scoring products, capping maxPerCategory
  for (const item of scored) {
    if (selected.length >= topN) break;
    const count = categoryCounts.get(item.product.category) || 0;
    if (count < maxPerCategory) {
      addProduct(item.product);
    }
  }

  // Pass 2: If topN >= 4 and key routine categories are missing, fill remaining slots
  if (topN >= 4 && selected.length < topN) {
    for (const essentialCat of ['cleanser', 'serum', 'moisturizer', 'sunscreen']) {
      if (selected.length >= topN) break;
      if (!selected.some((p) => p.category === essentialCat)) {
        const candidate = scored.find((item) => item.product.category === essentialCat);
        if (candidate) {
          addProduct(candidate.product);
        }
      }
    }
  }

  // Pass 3: Fill any remaining slots by score
  for (const item of scored) {
    if (selected.length >= topN) break;
    addProduct(item.product);
  }

  return selected;
}
