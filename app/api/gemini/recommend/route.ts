import { NextRequest, NextResponse } from 'next/server';
import { generateSkinRecommendation } from '@/lib/gemini';
import { INITIAL_PRODUCTS } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const recommendation = await generateSkinRecommendation(body, INITIAL_PRODUCTS);
    return NextResponse.json(recommendation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate skin recommendation' },
      { status: 500 }
    );
  }
}
