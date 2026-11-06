const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '';
const BUCKET = 'site-media';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const json = (data: unknown, status = 200) => Response.json(data, {
  status,
  headers: { 'cache-control': 'no-store' },
});

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    if (!ADMIN_PASSWORD || request.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
      return json({ error: 'Admin login required.' }, 401);
    }
    if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return json({ error: 'Supabase is not configured.' }, 503);

    let form: FormData;
    try { form = await request.formData(); }
    catch { return json({ error: 'Choose an image file to upload.' }, 400); }
    const file = form.get('image');
    if (!(file instanceof File)) return json({ error: 'Choose an image file to upload.' }, 400);

    const extensions: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/avif': 'avif',
    };
    const extension = extensions[file.type];
    if (!extension) return json({ error: 'Upload a JPG, PNG, WebP, or AVIF image.' }, 400);
    if (!file.size || file.size > MAX_IMAGE_BYTES) return json({ error: 'Each image must be smaller than 5 MB.' }, 400);

    const path = `${crypto.randomUUID()}.${extension}`;
    try {
      const upload = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_SECRET_KEY,
          'content-type': file.type,
          'cache-control': '31536000',
          'x-upsert': 'false',
        },
        body: file,
      });
      if (!upload.ok) {
        console.error('Supabase rejected site image upload:', upload.status, await upload.text());
        return json({ error: 'Image upload failed. Check the Supabase media bucket and try again.' }, 502);
      }
      const imageUrl = new URL('/api/image', request.url);
      imageUrl.searchParams.set('bucket', BUCKET);
      imageUrl.searchParams.set('path', path);
      return json({ url: imageUrl.toString() }, 201);
    } catch (error) {
      console.error('Unable to upload site image', error);
      return json({ error: 'Image upload failed. Please try again.' }, 500);
    }
  },
};
