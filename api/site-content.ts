const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '';

const json = (data: unknown, status = 200, headers: HeadersInit = {}) => Response.json(data, {
  status,
  headers: { 'cache-control': 'no-store', ...headers },
});

async function query(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('apikey', SUPABASE_SECRET_KEY);
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return json({ error: 'Supabase is not configured.' }, 503);

    if (request.method === 'GET') {
      try {
        const response = await query('site_content?select=id,content');
        if (!response.ok) {
          console.error('Unable to load shared site content:', response.status, await response.text());
          return json({ error: 'Shared site images are temporarily unavailable.' }, 503);
        }
        const rows = await response.json() as Array<{ id: string; content: unknown }>;
        const records = Object.fromEntries(rows.map((row) => [row.id, row.content]));
        return json({
          pets: records.pets ?? null,
          reviews: records.reviews ?? null,
          gallery: records.gallery ?? null,
        }, 200, { 'vercel-cdn-cache-control': 'public, s-maxage=60, stale-while-revalidate=300' });
      } catch (error) {
        console.error('Unable to read shared site content', error);
        return json({ error: 'Shared site images are temporarily unavailable.' }, 503);
      }
    }

    if (request.method !== 'PUT') return json({ error: 'Method not allowed.' }, 405);
    if (!ADMIN_PASSWORD || request.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
      return json({ error: 'Enter the admin password in Admin → Settings before saving site content.' }, 401);
    }

    let data: { pets?: unknown; reviews?: unknown; gallery?: unknown };
    try { data = await request.json() as typeof data; }
    catch { return json({ error: 'Invalid site content.' }, 400); }
    if (!Array.isArray(data.pets) || !Array.isArray(data.reviews) || !Array.isArray(data.gallery)) {
      return json({ error: 'Puppies, reviews, and gallery must all be valid lists.' }, 400);
    }
    const serialized = JSON.stringify(data);
    if (serialized.length > 4_000_000 || serialized.includes('data:image/')) {
      return json({ error: 'Upload images through Admin first; image data cannot be saved in the content database.' }, 413);
    }

    try {
      const response = await query('site_content?on_conflict=id', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify([
          { id: 'pets', content: data.pets },
          { id: 'reviews', content: data.reviews },
          { id: 'gallery', content: data.gallery },
        ]),
      });
      if (!response.ok) {
        console.error('Supabase rejected shared site content:', response.status, await response.text());
        return json({ error: 'Could not save site content. Please try again.' }, 500);
      }
      return json({ ok: true });
    } catch (error) {
      console.error('Unable to save shared site content', error);
      return json({ error: 'Could not save site content. Please try again.' }, 500);
    }
  },
};
