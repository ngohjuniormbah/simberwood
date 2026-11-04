export interface SupabaseEnv {
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
}

export const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export async function insertSupabaseRow<T extends Record<string, unknown>>(
  env: SupabaseEnv,
  table: string,
  row: T,
): Promise<Response> {
  const baseUrl = env.SUPABASE_URL?.replace(/\/+$/, '');
  const secretKey = env.SUPABASE_SECRET_KEY;
  if (!baseUrl || !secretKey) {
    return json({ error: 'Database is not configured. Please try again later.' }, 503);
  }

  return fetch(`${baseUrl}/rest/v1/${table}?select=id`, {
    method: 'POST',
    headers: {
      apikey: secretKey,
      'content-type': 'application/json',
      prefer: 'return=representation',
    },
    body: JSON.stringify(row),
  });
}
