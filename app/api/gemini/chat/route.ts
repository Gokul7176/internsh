import { NextRequest, NextResponse } from 'next/server';
import { askGeminiChatbot } from '@/lib/gemini';
import { INITIAL_PRODUCTS } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const { query, history } = await req.json();
    const result = await askGeminiChatbot(query, history || [], INITIAL_PRODUCTS);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to process AI chat query' },
      { status: 500 }
    );
  }
}
