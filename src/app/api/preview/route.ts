// src/app/api/preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // 1. Check the secret token
  if (secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // 2. Check for slug
  if (!slug) {
    return new Response('Slug not found', { status: 400 });
  }

  // 3. Enable Draft Mode by setting a cookie
  (await draftMode()).enable();

  // 4. Redirect to the post's path
  // The `draftMode().enable()` cookie will now be present on this request
  redirect(`/blog/${slug}`);
}