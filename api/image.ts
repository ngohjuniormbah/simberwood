const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\\/+$/, '');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const ALLOWED_BUCKETS = new Set(['site-media', 'hero-backgrounds']);
const IMAGE_PATH = /^[0-9a-f-]{36}\\.(jpg|png|webp|avif)$/i;

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed.', { status: 405 });
    }

    const requestUrl = new URL(request.url);
    const bucket = requestUrl.searchParams.get('bucket') || '';
    const path = requestUrl.searchParams.get('path') || '';
    if (!ALLOWED_BUCKETS.has(bucket) || !IMAGE_PATH.test(path)) {
      return new Response('Image not found.', { status: 404 });
    }
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
      return new Response('Image service is not configured.', { status: 503 });
    }

    try {
      const upstream = await fetch(
        `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`,
        { method: request.method, headers: { apikey: SUPABASE_SECRET_KEY } },
      );
      if (!upstream.ok) return new Response('Image not found.', { status: upstream.status === 404 ? 404 : 502 });

      const headers = new Headers();
      headers.set('content-type', upstream.headers.get('content-type') || 'application/octet-stream');
      headers.set('x-content-type-options', 'nosniff');
      headers.set('cache-control', 'public, max-age=31536000, immutable');
      headers.set('vercel-cdn-cache-control', 'public, max-age=31536000, stale-while-revalidate=86400');
      return new Response(request.method === 'HEAD' ? null : upstream.body, { status: 200, headers });
    } catch (error) {
      console.error('Could not fetch cached site image.', error);
      return new Response('Image service is temporarily unavailable.', { status: 502 });
    }
  },
};