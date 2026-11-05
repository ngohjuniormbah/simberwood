const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '';

const json = (data: unknown, status = 200) => Response.json(data, {
  status,
  headers: { 'cache-control': 'no-store' },
});

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
    if (!ADMIN_PASSWORD) return json({ error: 'Admin login is not configured on the server.' }, 503);

    let data: { password?: unknown };
    try { data = await request.json() as typeof data; }
    catch { return json({ error: 'Invalid login request.' }, 400); }

    if (typeof data.password !== 'string' || data.password !== ADMIN_PASSWORD) {
      return json({ error: 'Incorrect admin password.' }, 401);
    }

    return json({ ok: true });
  },
};