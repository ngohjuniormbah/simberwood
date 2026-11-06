const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '';
const BUCKET = 'hero-backgrounds';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const json = (data: unknown, status = 200, headers: HeadersInit = {}) => Response.json(data, {
  status,
  headers: { 'cache-control': 'no-store', ...headers },
});

async function supabase(path: string, init: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) throw new Error('Supabase is not configured.');
  const headers = new Headers(init.headers);
  headers.set('apikey', SUPABASE_SECRET_KEY);
  return fetch(`${SUPABASE_URL}/${path}`, { ...init, headers });
}

function authorized(request: Request) {
  return Boolean(ADMIN_PASSWORD) && request.headers.get('x-admin-password') === ADMIN_PASSWORD;
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'GET') {
      try {
        const [slidesResponse, settingsResponse] = await Promise.all([
          supabase('rest/v1/hero_slides?select=id,image_url,storage_path,position,created_at&order=position.asc,created_at.asc'),
          supabase('rest/v1/hero_settings?id=eq.main&select=slideshow_enabled,interval_seconds'),
        ]);
        if (!slidesResponse.ok || !settingsResponse.ok) {
          console.error('Unable to read hero settings from Supabase.');
          return json({ error: 'Hero settings are temporarily unavailable.' }, 503);
        }
        const slides = await slidesResponse.json() as Array<{ id: string; image_url: string; storage_path: string }>;
        const rows = await settingsResponse.json() as Array<{ slideshow_enabled: boolean; interval_seconds: number }>;
        const publicSlides = slides.map((slide) => {
          const imageUrl = new URL('/api/image', request.url);
          imageUrl.searchParams.set('bucket', BUCKET);
          imageUrl.searchParams.set('path', slide.storage_path);
          return { ...slide, image_url: imageUrl.toString() };
        });
        return json(
          { slides: publicSlides, settings: rows[0] ?? { slideshow_enabled: true, interval_seconds: 5 } },
          200,
          { 'vercel-cdn-cache-control': 'public, s-maxage=60, stale-while-revalidate=300' },
        );
      } catch (error) {
        console.error('Unable to load hero slides', error);
        return json({ error: 'Hero settings are temporarily unavailable.' }, 503);
      }
    }

    if (!authorized(request)) return json({ error: 'Enter the admin password configured in Vercel.' }, 401);

    if (request.method === 'POST') {
      if (request.headers.get('content-type')?.includes('application/json')) {
        let data: { slideshowEnabled?: unknown; intervalSeconds?: unknown };
        try { data = await request.json() as typeof data; }
        catch { return json({ error: 'Invalid settings.' }, 400); }
        if (typeof data.slideshowEnabled !== 'boolean' || !Number.isInteger(data.intervalSeconds) || Number(data.intervalSeconds) < 3 || Number(data.intervalSeconds) > 30) {
          return json({ error: 'Choose a slideshow interval from 3 to 30 seconds.' }, 400);
        }
        try {
          const response = await supabase('rest/v1/hero_settings?id=eq.main', {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', prefer: 'return=minimal' },
            body: JSON.stringify({ slideshow_enabled: data.slideshowEnabled, interval_seconds: data.intervalSeconds, updated_at: new Date().toISOString() }),
          });
          if (!response.ok) {
            console.error('Supabase rejected hero settings:', response.status, await response.text());
            return json({ error: 'Could not save slideshow settings.' }, 500);
          }
          return json({ ok: true });
        } catch (error) {
          console.error('Unable to save hero settings', error);
          return json({ error: 'Could not save slideshow settings.' }, 500);
        }
      }

      let form: FormData;
      try { form = await request.formData(); }
      catch { return json({ error: 'Choose an image file to upload.' }, 400); }
      const file = form.get('image');
      if (!(file instanceof File)) return json({ error: 'Choose an image file to upload.' }, 400);
      const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };
      if (!extensions[file.type]) return json({ error: 'Use a JPG, PNG, WebP, or AVIF image.' }, 400);
      if (file.size === 0 || file.size > MAX_IMAGE_BYTES) return json({ error: 'Each image must be smaller than 5 MB.' }, 400);

      try {
        const storagePath = `${crypto.randomUUID()}.${extensions[file.type]}`;
        const upload = await supabase(`storage/v1/object/${BUCKET}/${storagePath}`, {
          method: 'POST',
          headers: { 'content-type': file.type, 'cache-control': '31536000', 'x-upsert': 'false' },
          body: file,
        });
        if (!upload.ok) {
          console.error('Supabase rejected hero image upload:', upload.status, await upload.text());
          return json({ error: 'Image upload failed. Confirm the Supabase schema and storage bucket are installed.' }, 502);
        }

        const list = await supabase('rest/v1/hero_slides?select=position&order=position.desc&limit=1');
        const lastPosition = list.ok ? (await list.json() as Array<{ position: number }>)[0]?.position ?? -1 : -1;
        const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
        const created = await supabase('rest/v1/hero_slides', {
          method: 'POST',
          headers: { 'content-type': 'application/json', prefer: 'return=minimal' },
          body: JSON.stringify({ image_url: imageUrl, storage_path: storagePath, position: lastPosition + 1 }),
        });
        if (!created.ok) {
          await supabase(`storage/v1/object/${BUCKET}/${storagePath}`, { method: 'DELETE' });
          console.error('Supabase rejected hero slide record:', created.status, await created.text());
          return json({ error: 'Image uploaded, but its slide record could not be saved.' }, 500);
        }
        return json({ ok: true }, 201);
      } catch (error) {
        console.error('Unable to upload hero image', error);
        return json({ error: 'Image upload failed. Please try again.' }, 500);
      }
    }

    if (request.method === 'DELETE') {
      let data: { id?: unknown };
      try { data = await request.json() as typeof data; }
      catch { return json({ error: 'Invalid slide.' }, 400); }
      const id = typeof data.id === 'string' && /^[0-9a-f-]{36}$/i.test(data.id) ? data.id : '';
      if (!id) return json({ error: 'Invalid slide.' }, 400);
      try {
        const found = await supabase(`rest/v1/hero_slides?id=eq.${encodeURIComponent(id)}&select=id,storage_path`);
        if (!found.ok) return json({ error: 'Could not find that slide.' }, 404);
        const rows = await found.json() as Array<{ storage_path: string }>;
        if (!rows[0]) return json({ error: 'That slide no longer exists.' }, 404);
        const removed = await supabase(`rest/v1/hero_slides?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!removed.ok) return json({ error: 'Could not remove that slide.' }, 500);
        const cleanup = await supabase(`storage/v1/object/${BUCKET}/${encodeURIComponent(rows[0].storage_path)}`, { method: 'DELETE' });
        if (!cleanup.ok) console.error('Hero slide deleted but storage cleanup failed:', cleanup.status);
        return json({ ok: true });
      } catch (error) {
        console.error('Unable to delete hero slide', error);
        return json({ error: 'Could not remove that slide.' }, 500);
      }
    }

    return json({ error: 'Method not allowed.' }, 405);
  },
};
