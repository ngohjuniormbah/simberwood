const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\\/+$/, '');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const json = (data: unknown, status = 200) => Response.json(data, {
  status,
  headers: { 'cache-control': 'no-store' },
});

async function insertContactRow(row: Record<string, unknown>): Promise<Response> {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    return json({ error: 'Database is not configured. Please try again later.' }, 503);
  }
  return fetch(`${SUPABASE_URL}/rest/v1/contact_messages?select=id`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      'content-type': 'application/json',
      prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

    let data: { name?: unknown; email?: unknown; message?: unknown };
    try { data = await request.json() as typeof data; }
    catch { return json({ error: 'Invalid request body.' }, 400); }

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const message = typeof data.message === 'string' ? data.message.trim() : '';
    if (!name || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !message || message.length > 5000) {
      return json({ error: 'Enter a valid name, email, and message (up to 5,000 characters).' }, 400);
    }

    try {
      const response = await insertContactRow({
        id: crypto.randomUUID(),
        name,
        email,
        message,
        status: 'new',
      });
      if (!response.ok) {
        console.error('Supabase rejected contact message:', response.status, await response.text());
        return json({ error: 'We could not save your message. Please try again or email us directly.' }, 500);
      }
      return json({ ok: true }, 201);
    } catch (error) {
      console.error('Unable to save contact message', error);
      return json({ error: 'We could not save your message. Please try again or email us directly.' }, 500);
    }
  },
};
