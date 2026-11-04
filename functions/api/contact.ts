import { insertSupabaseRow, json, SupabaseEnv } from '../_shared/supabase';

type PagesFunction<E> = (context: { request: Request; env: E }) => Promise<Response>;

export const onRequestPost: PagesFunction<SupabaseEnv> = async ({ request, env }) => {
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
    const response = await insertSupabaseRow(env, 'contact_messages', {
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
};
