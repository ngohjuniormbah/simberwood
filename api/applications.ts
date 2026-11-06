import { insertSupabaseRow, json } from '../lib/server/supabase';

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '';

function applicationSaveError(status: number, body: string): string {
  let code = '';
  let message = '';
  try {
    const payload = JSON.parse(body) as { code?: unknown; message?: unknown; error?: unknown };
    code = typeof payload.code === 'string' ? payload.code : '';
    message = typeof payload.message === 'string' ? payload.message : '';
  } catch { /* Supabase may return non-JSON errors. */ }

  if (status === 503) return 'The application database is not configured in Vercel. Check SUPABASE_URL and SUPABASE_SECRET_KEY, then redeploy.';
  if (status === 401 || status === 403 || code === 'PGRST301' || code === '42501') return 'The application database rejected its credentials. Check that SUPABASE_SECRET_KEY is the project secret key in Vercel, then redeploy.';
  if (code === '42P01' || code === 'PGRST205' || status === 404) return 'The adoption_applications table is missing. Run the repository file supabase/schema.sql in your Supabase SQL Editor.';
  if (code === '42703' || code === 'PGRST204') return 'The adoption database schema is outdated. Run the latest supabase/schema.sql in your Supabase SQL Editor.';
  if (code === '23502' || code === '23514' || code === '22P02') return 'The application data did not match the database fields. Please review the form and try again.';
  if (message.toLowerCase().includes('fetch failed')) return 'The application database could not be reached. Check SUPABASE_URL in Vercel.';
  return 'We could not save your application. Please contact us and include reference ' + (code || String(status)) + '.';
}

async function adminQuery(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('apikey', SUPABASE_SECRET_KEY);
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers });
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (['GET', 'PATCH', 'DELETE'].includes(request.method)) {
      if (!ADMIN_PASSWORD || request.headers.get('x-admin-password') !== ADMIN_PASSWORD) {
        return json({ error: 'Admin login required.' }, 401);
      }
      if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return json({ error: 'Database is not configured.' }, 503);

      if (request.method === 'GET') {
        try {
          const response = await adminQuery('adoption_applications?select=*&order=submitted_at.desc');
          if (!response.ok) {
            console.error('Could not load adoption applications:', response.status, await response.text());
            return json({ error: 'Could not load applications.' }, 502);
          }
          return json({ applications: await response.json() });
        } catch (error) {
          console.error('Could not load adoption applications.', error);
          return json({ error: 'Could not load applications.' }, 500);
        }
      }

      let adminData: { id?: unknown; status?: unknown };
      try { adminData = await request.json() as typeof adminData; }
      catch { return json({ error: 'Invalid application request.' }, 400); }
      const id = typeof adminData.id === 'string' ? adminData.id.trim() : '';
      if (!id || id.length > 120) return json({ error: 'A valid application ID is required.' }, 400);

      if (request.method === 'PATCH') {
        if (!['pending', 'contacted', 'approved', 'rejected'].includes(String(adminData.status))) {
          return json({ error: 'Invalid application status.' }, 400);
        }
        try {
          const response = await adminQuery(`adoption_applications?id=eq.${encodeURIComponent(id)}`, {
            method: 'PATCH',
            headers: { 'content-type': 'application/json', prefer: 'return=minimal' },
            body: JSON.stringify({ status: adminData.status }),
          });
          if (!response.ok) {
            console.error('Could not update adoption application:', response.status, await response.text());
            return json({ error: 'Could not update application.' }, 502);
          }
          return json({ ok: true });
        } catch (error) {
          console.error('Could not update adoption application.', error);
          return json({ error: 'Could not update application.' }, 500);
        }
      }

      try {
        const response = await adminQuery(`adoption_applications?id=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: { prefer: 'return=minimal' },
        });
        if (!response.ok) {
          console.error('Could not delete adoption application:', response.status, await response.text());
          return json({ error: 'Could not delete application.' }, 502);
        }
        return json({ ok: true });
      } catch (error) {
        console.error('Could not delete adoption application.', error);
        return json({ error: 'Could not delete application.' }, 500);
      }
    }

    if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

    let data: Record<string, unknown>;
    try { data = await request.json() as Record<string, unknown>; }
    catch { return json({ error: 'Invalid request body.' }, 400); }

    const required = ['fullName', 'phone', 'email', 'address', 'residenceType', 'ownOrRent', 'petsAllowed', 'fencedYard', 'adults', 'children', 'everyoneAgrees', 'ownedDog', 'preferredColor', 'preferredSex', 'vetCare'];
    if (required.some((key) => typeof data[key] !== 'string' || !(data[key] as string).trim())) {
      return json({ error: 'Please complete all required application fields.' }, 400);
    }
    const email = String(data.email).trim();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Enter a valid email address.' }, 400);
    }

    const id = `SW-${crypto.randomUUID()}`;
    try {
      const response = await insertSupabaseRow({
        SUPABASE_URL: process.env.SUPABASE_URL,
        SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
      }, 'adoption_applications', {
        id,
        full_name: String(data.fullName).trim(),
        phone: String(data.phone).trim(),
        email,
        address: String(data.address).trim(),
        residence_type: data.residenceType,
        own_or_rent: data.ownOrRent,
        pets_allowed: data.petsAllowed,
        fenced_yard: data.fencedYard,
        adults: data.adults,
        children: data.children,
        everyone_agrees: data.everyoneAgrees,
        owned_dog: data.ownedDog,
        current_pets: typeof data.currentPets === 'string' ? data.currentPets : '',
        preferred_color: data.preferredColor,
        preferred_sex: data.preferredSex,
        vet_care: data.vetCare,
        custom_puppy_name: typeof data.customPuppyName === 'string' ? data.customPuppyName : null,
        selected_puppy_id: typeof data.selectedPuppyId === 'string' ? data.selectedPuppyId : null,
        status: 'pending',
      });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Supabase rejected adoption application:', response.status, errorBody);
        return json({ error: applicationSaveError(response.status, errorBody) }, response.status === 503 ? 503 : 500);
      }
      return json({ id }, 201);
    } catch (error) {
      console.error('Unable to save adoption application', error);
      return json({ error: 'We could not save your application. Please try again or contact us by email.' }, 500);
    }
  },
};
