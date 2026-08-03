import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200, message?: string) {
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(message ? { message } : {}),
    },
    {
      status,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    }
  );
}

export function apiError(error: string, status = 400, details?: unknown) {
  return NextResponse.json(
    {
      success: false as const,
      error,
      ...(details !== undefined ? { details } : {}),
    },
    {
      status,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    }
  );
}
