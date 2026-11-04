interface Env { DB: D1Database }
type PagesFunction<E> = (context: { request: Request; env: E }) => Promise<Response>;
interface D1Database {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
}

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: 'Message storage is not configured.' }, 503);
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
    await env.DB.prepare('INSERT INTO contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)')
      .bind(crypto.randomUUID(), name, email, message).run();
    return json({ ok: true }, 201);
  } catch (error) {
    console.error('Unable to save contact message', error);
    return json({ error: 'We could not save your message. Please try again or email us directly.' }, 500);
  }
};
