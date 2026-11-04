import { insertSupabaseRow, json, SupabaseEnv } from '../_shared/supabase';

type PagesFunction<E> = (context: { request: Request; env: E }) => Promise<Response>;

export const onRequestPost: PagesFunction<SupabaseEnv> = async ({ request, env }) => {
  let data: Record<string, unknown>;
  try { data = await request.json() as Record<string, unknown>; }
  catch { return json({ error: 'Invalid request body.' }, 400); }

  const required = ['fullName', 'phone', 'email', 'address', 'residenceType', 'ownOrRent', 'petsAllowed', 'fencedYard', 'adults', 'children', 'everyoneAgrees', 'ownedDog', 'preferredColor', 'preferredSex', 'vetCare'];
  if (required.some((key) => typeof data[key] !== 'string' || !(data[key] as string).trim())) {
    return json({ error: 'Please complete all required application fields.' }, 400);
  }
  const email = String(data.email).trim();
  if (email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    return json({ error: 'Enter a valid email address.' }, 400);
  }

  const id = `SW-${crypto.randomUUID()}`;
  try {
    const response = await insertSupabaseRow(env, 'adoption_applications', {
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
      current_pets: data.currentPets ?? '',
      preferred_color: data.preferredColor,
      preferred_sex: data.preferredSex,
      vet_care: data.vetCare,
      custom_puppy_name: data.customPuppyName ?? null,
      selected_puppy_id: data.selectedPuppyId || null,
      status: 'pending',
    });
    if (!response.ok) {
      console.error('Supabase rejected adoption application:', response.status, await response.text());
      return json({ error: 'We could not save your application. Please try again or contact us by email.' }, 500);
    }
    return json({ id }, 201);
  } catch (error) {
    console.error('Unable to save adoption application', error);
    return json({ error: 'We could not save your application. Please try again or contact us by email.' }, 500);
  }
};
