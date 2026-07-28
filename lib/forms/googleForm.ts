/**
 * SERVER-ONLY helper. Forwards a completed order or enquiry to a Google Form by
 * POSTing to its `formResponse` endpoint, using the direct entry-id map in
 * `./config`. Never import this from a client component — it is referenced only
 * by the `/api/order` and `/api/enquiry` route handlers.
 */
import type { FormConfig } from './config';

export async function forwardToGoogleForm(
  form: FormConfig,
  values: Record<string, string | number | undefined | null>,
): Promise<{ ok: boolean; reason?: string }> {
  try {
    // Build the urlencoded payload: for each mapped field that has a value,
    // append entry.<id>=<value>.
    const body = new URLSearchParams();
    for (const [fieldKey, entryId] of Object.entries(form.fields)) {
      const value = values[fieldKey];
      if (value == null || value === '') continue;
      body.append(`entry.${entryId}`, String(value));
    }

    // Nothing to send would silently record a blank response — treat as a bug.
    if (Array.from(body.keys()).length === 0) {
      return { ok: false, reason: 'empty' };
    }

    const endpoint = `https://docs.google.com/forms/d/e/${form.id}/formResponse`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    });

    // Google returns 200 on a recorded response (and often a redirect first).
    const ok = res.status >= 200 && res.status < 400;
    if (!ok) console.warn(`[googleForm] formResponse returned HTTP ${res.status}`);
    return ok ? { ok: true } : { ok: false, reason: `status_${res.status}` };
  } catch (err) {
    console.warn('[googleForm] forward error', err);
    return { ok: false, reason: 'error' };
  }
}
