import { SkinType } from '../../types';

export interface ExtractedUserProfile {
  age?: number;
  ageGroup?: string;
  skinType?: SkinType;
  primaryConcerns: string[];
  secondaryConcerns: string[];
  isSensitive?: boolean;
  budget?: number;
  goals?: string;
}

export function extractProfileFromText(text: string): ExtractedUserProfile {
  const lower = text.toLowerCase();
  const result: ExtractedUserProfile = {
    primaryConcerns: [],
    secondaryConcerns: [],
  };

  // 1. Age Extraction
  const ageMatch = lower.match(/\b(\d{1,2})\s*(?:years?\s*old|yo|yr|yrs)\b|\bi\s*am\s*(\d{1,2})\b/);
  if (ageMatch) {
    const ageNum = parseInt(ageMatch[1] || ageMatch[2], 10);
    if (ageNum > 10 && ageNum < 100) {
      result.age = ageNum;
      if (ageNum < 18) result.ageGroup = 'Under 18';
      else if (ageNum <= 24) result.ageGroup = '18-24';
      else if (ageNum <= 34) result.ageGroup = '25-34';
      else if (ageNum <= 44) result.ageGroup = '35-44';
      else if (ageNum <= 54) result.ageGroup = '45-54';
      else result.ageGroup = '55+';
    }
  }

  // 2. Skin Type Extraction
  if (lower.includes('oily')) {
    result.skinType = 'oily';
  } else if (lower.includes('dry')) {
    result.skinType = 'dry';
  } else if (lower.includes('combination') || lower.includes('combo')) {
    result.skinType = 'combination';
  } else if (lower.includes('sensitive') || lower.includes('reactive')) {
    result.skinType = 'sensitive';
  } else if (lower.includes('normal')) {
    result.skinType = 'normal';
  }

  // 3. Primary & Secondary Concerns Extraction
  if (lower.includes('pimple') || lower.includes('piple') || lower.includes('pipel') || lower.includes('acne') || lower.includes('breakout') || lower.includes('spot') || lower.includes('zit') || lower.includes('blackhead') || lower.includes('whitehead') || lower.includes('bha')) {
    result.primaryConcerns.push('Acne & Clogged Pores');
  }
  if (lower.includes('dark spot') || lower.includes('darkspot') || lower.includes('pigment') || lower.includes('hyper-pigmentation') || lower.includes('uneven tone') || lower.includes('brightening') || lower.includes('discolor')) {
    result.primaryConcerns.push('Hyperpigmentation & Dark Spots');
  }
  if (lower.includes('wrinkle') || lower.includes('rinkle') || lower.includes('fine line') || lower.includes('aging') || lower.includes('ageing') || lower.includes('sagging') || lower.includes('retinol') || lower.includes('anti-aging')) {
    result.primaryConcerns.push('Fine Lines & Wrinkles');
  }
  if (lower.includes('flak') || lower.includes('dehydrat') || lower.includes('tightness') || lower.includes('dryness') || lower.includes('dry') || lower.includes('moisture') || lower.includes('hydrat')) {
    result.primaryConcerns.push('Dehydration & Dry Flaking');
  }
  if (lower.includes('redness') || lower.includes('rosacea') || lower.includes('irritat') || lower.includes('sooth')) {
    result.primaryConcerns.push('Redness & Rosacea');
    result.isSensitive = true;
  }
  if (lower.includes('texture') || lower.includes('rough')) {
    result.secondaryConcerns.push('Uneven Texture');
  }
  if (lower.includes('t-zone') || lower.includes('shine') || lower.includes('sebum')) {
    result.secondaryConcerns.push('Excess T-Zone Oil');
  }

  // Category and Ingredient Keywords
  const categoryKeywords = ['sunscreen', 'spf', 'cleanser', 'face wash', 'moisturizer', 'serum', 'exfoliant', 'mask', 'eye cream', 'retinol', 'vitamin c', 'niacinamide', 'hyaluronic', 'ceramide', 'squalane', 'peptide', 'clay', 'bha', 'aha'];
  for (const kw of categoryKeywords) {
    if (lower.includes(kw) && !result.primaryConcerns.includes(kw)) {
      result.primaryConcerns.push(kw);
    }
  }

  // Sensitivity explicit flag
  if (lower.includes('sensitive') || lower.includes('reactive') || lower.includes('burns easily')) {
    result.isSensitive = true;
  }

  // 4. Budget Extraction
  const budgetMatch = lower.match(/(?:budget|price|under|below|max)\s*(?:of|is)?\s*₹?\s*(\d{3,5})\b/);
  if (budgetMatch) {
    result.budget = parseInt(budgetMatch[1], 10);
  }

  return result;
}
