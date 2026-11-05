import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ImagePlus, LoaderCircle, Trash2, Upload } from 'lucide-react';

interface HeroSlide {
  id: string;
  image_url: string;
  position: number;
}

interface HeroSettings {
  slideshow_enabled: boolean;
  interval_seconds: number;
}

export const HeroSettingsTab: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [settings, setSettings] = useState<HeroSettings>({ slideshow_enabled: true, interval_seconds: 5 });
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/hero-slides');
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load hero slides.');
      setSlides(result.slides || []);
      setSettings(result.settings || { slideshow_enabled: true, interval_seconds: 5 });
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load hero slides.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    if (!adminPassword) {
      setError('Enter the admin password configured in Vercel before uploading.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      for (const file of files) {
        const form = new FormData();
        form.append('image', file);
        const response = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: { 'x-admin-password': adminPassword },
          body: form,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Image upload failed.');
      }
      sessionStorage.setItem('simberwood_admin_password', adminPassword);
      window.dispatchEvent(new Event('simberwood-admin-authenticated'));
      setSuccess(`${files.length} hero image${files.length === 1 ? '' : 's'} uploaded.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const saveSettings = async () => {
    if (!adminPassword) {
      setError('Enter the admin password configured in Vercel before saving.');
      return;
    }
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-admin-password': adminPassword },
        body: JSON.stringify({ slideshowEnabled: settings.slideshow_enabled, intervalSeconds: settings.interval_seconds }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save slideshow settings.');
      sessionStorage.setItem('simberwood_admin_password', adminPassword);
      window.dispatchEvent(new Event('simberwood-admin-authenticated'));
      setSuccess('Password confirmed. Site edits and slideshow settings now sync for all visitors.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save slideshow settings.');
    } finally {
      setBusy(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!adminPassword) {
      setError('Enter the admin password configured in Vercel before removing a slide.');
      return;
    }
    if (!window.confirm('Remove this hero image from the slideshow?')) return;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/hero-slides', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json', 'x-admin-password': adminPassword },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not remove this slide.');
      setSlides((current) => current.filter((slide) => slide.id !== id));
      setSuccess('Hero image removed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not remove this slide.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-neutral-100 p-2.5 text-neutral-800"><ImagePlus className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-neutral-950">Homepage hero slideshow</h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">Upload background images, choose the slide timing, and control whether the homepage rotates through them. Use the Pets, Reviews, and Gallery tabs to add and manage their images.</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <label htmlFor="hero-admin-password" className="block text-xs font-semibold text-neutral-700">Admin password</label>
          <input
            id="hero-admin-password"
            type="password"
            autoComplete="current-password"
            value={adminPassword}
            onChange={(event) => setAdminPassword(event.target.value)}
            placeholder="Password set in Vercel environment variables"
            className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <p className="mt-2 text-xs text-neutral-500">Set <code>ADMIN_DASHBOARD_PASSWORD</code> in Vercel. Your password is sent only to the server when saving or uploading and is not stored on this device.</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4">
            <input
              type="checkbox"
              checked={settings.slideshow_enabled}
              onChange={(event) => setSettings((current) => ({ ...current, slideshow_enabled: event.target.checked }))}
              className="h-4 w-4 accent-neutral-900"
            />
            <span>
              <span className="block text-sm font-semibold text-neutral-900">Enable slideshow</span>
              <span className="block text-xs text-neutral-500">Rotate hero images automatically</span>
            </span>
          </label>
          <label className="block rounded-xl border border-neutral-200 p-4">
            <span className="block text-sm font-semibold text-neutral-900">Slide duration</span>
            <select
              value={settings.interval_seconds}
              onChange={(event) => setSettings((current) => ({ ...current, interval_seconds: Number(event.target.value) }))}
              className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm"
            >
              {[3, 5, 7, 10, 15, 20, 30].map((seconds) => <option key={seconds} value={seconds}>{seconds} seconds</option>)}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => void saveSettings()} disabled={busy} className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50">
            {busy ? <LoaderCircle className="mr-2 inline h-4 w-4 animate-spin" /> : null}Save slideshow settings
          </button>
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50">
            {busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload images
          </button>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={(event) => void uploadImages(event)} />
          <span className="text-xs text-neutral-500">JPG, PNG, WebP, or AVIF · max 5 MB each</span>
        </div>

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle2 className="h-4 w-4" />{success}</p>}
      </div>

      <div className="rounded-2xl bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-neutral-950">Hero images</h3>
            <p className="mt-1 text-xs text-neutral-500">{slides.length} uploaded · Images appear behind the homepage hero text.</p>
          </div>
          {loading && <LoaderCircle className="h-5 w-5 animate-spin text-neutral-500" />}
        </div>
        {!loading && slides.length === 0 && <p className="mt-5 rounded-xl bg-neutral-50 p-5 text-sm text-neutral-600">No uploaded images yet. The homepage will keep its current animated gradient until you add a slide.</p>}
        {slides.length > 0 && (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {slides.map((slide, index) => (
              <div key={slide.id} className="overflow-hidden rounded-xl border border-neutral-200">
                <img src={slide.image_url} alt={`Hero slide ${index + 1}`} className="aspect-video w-full object-cover" />
                <div className="flex items-center justify-between gap-2 p-3">
                  <span className="text-xs font-semibold text-neutral-700">Slide {index + 1}</span>
                  <button type="button" onClick={() => void deleteSlide(slide.id)} disabled={busy} aria-label={`Delete hero slide ${index + 1}`} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" />Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
