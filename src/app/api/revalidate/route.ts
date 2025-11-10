// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // 1. Check the secret token
  if (secret !== process.env.WORDPRESS_REVALIDATE_SECRET) {
    return new NextResponse('Invalid token', { status: 401 });
  }

  const body = await request.json();
  const slug = body?.slug;

  // 2. Check for slug
  if (!slug) {
    return new NextResponse('Slug not found', { status: 400 });
  }

  try {
    // 3. Revalidate (purge the cache for) the specific path
    // This will re-run the `page.tsx` for this slug on the next visit
    await revalidatePath(`/blog/${slug}`);
    return new NextResponse('Revalidated', { status: 200 });
  } catch (err) {
    return new NextResponse('Error revalidating', { status: 500 });
  }
}