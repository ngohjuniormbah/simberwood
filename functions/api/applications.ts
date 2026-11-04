interface Env { DB: D1Database }
type PagesFunction<E> = (context: { request: Request; env: E }) => Promise<Response>;
interface D1Database {
  prepare(query: string): {
    bind(...values: unknown[]): { run(): Promise<unknown> };
  };
}

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: 'Application storage is not configured.' }, 503);
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return json({ error: 'Invalid request body.' }, 400); }

  const required = ['fullName', 'phone', 'email', 'address', 'residenceType', 'ownOrRent', 'petsAllowed', 'fencedYard', 'adults', 'children', 'everyoneAgrees', 'ownedDog', 'preferredColor', 'preferredSex', 'vetCare'];
  if (required.some((key) => typeof data[key] !== 'string' || !(data[key] as string).trim())) {
    return json({ error: 'Please complete all required application fields.' }, 400);
  }
  const email = String(data.email).trim();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400);

  const id = `SW-${crypto.randomUUID()}`;
  try {
    await env.DB.prepare(`INSERT INTO adoption_applications
      (id, full_name, phone, email, address, residence_type, own_or_rent, pets_allowed, fenced_yard, adults, children, everyone_agrees, owned_dog, current_pets, preferred_color, preferred_sex, vet_care, custom_puppy_name, selected_puppy_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(id, data.fullName, data.phone, email, data.address, data.residenceType, data.ownOrRent, data.petsAllowed, data.fencedYard, data.adults, data.children, data.everyoneAgrees, data.ownedDog, data.currentPets ?? '', data.preferredColor, data.preferredSex, data.vetCare, data.customPuppyName ?? null, data.selectedPuppyId || null)
      .run();
    return json({ id }, 201);
  } catch (error) {
    console.error('Unable to save adoption application', error);
    return json({ error: 'We could not save your application. Please try again or contact us by email.' }, 500);
  }
};
