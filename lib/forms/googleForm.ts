/**
 * SERVER-ONLY helper. Forwards a completed order or enquiry to a Google Form by
 * POSTing to its `formResponse` endpoint.
 *
 * Never import this from a client component — it is referenced only by the
 * `/api/order` and `/api/enquiry` route handlers. No secret is embedded here:
 * the prefill URL is passed in by the caller, which reads it from a server-only
 * env var.
 */

// Sentinel token (the placeholder value pre-filled into the Google Form's
// "Get pre-filled link") → the field key we send. Exported so callers/tests can
// reason about the mapping.
export const ORDER_SENTINELS: Record<string, string> = {
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  ALTPHONE: 'altPhone',
  ADDRESS: 'address',
  PIECE: 'piece',
  SIZE: 'size',
  UNITPRICE: 'unitPrice',
  QTY: 'qty',
  TOTAL: 'total',
  REF: 'reference',
  STATUS: 'status',
  NOTES: 'notes',
};

export const ENQUIRY_SENTINELS: Record<string, string> = {
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  PIECE: 'piece',
  MESSAGE: 'message',
};

// The two maps agree on every shared token, so a single merged lookup resolves
// either form. Any sentinel found in a URL that isn't known here is ignored.
const SENTINEL_TO_FIELD: Record<string, string> = { ...ORDER_SENTINELS, ...ENQUIRY_SENTINELS };

export async function forwardToGoogleForm(
  prefillUrl: string | undefined,
  values: Record<string, string>,
): Promise<{ ok: boolean; reason?: string }> {
  if (!prefillUrl || !prefillUrl.trim()) {
    return { ok: false, reason: 'not_configured' };
  }

  try {
    const url = new URL(prefillUrl);

    // Read each `entry.<id>=<SENTINEL>` pair and build fieldKey -> entry id.
    const fieldToEntryId: Record<string, string> = {};
    url.searchParams.forEach((sentinel, key) => {
      if (!key.startsWith('entry.')) return;
      const fieldKey = SENTINEL_TO_FIELD[sentinel];
      if (!fieldKey) return; // unknown sentinel — ignore
      fieldToEntryId[fieldKey] = key.slice('entry.'.length);
    });

    // Derive the POST endpoint: same origin + path, trailing segment (e.g.
    // `viewform` or `prefill`) replaced with `formResponse`.
    const segments = url.pathname.split('/');
    segments[segments.length - 1] = 'formResponse';
    const endpoint = `${url.origin}${segments.join('/')}`;

    // Build the urlencoded payload for every provided value with a mapped entry.
    const body = new URLSearchParams();
    for (const [fieldKey, value] of Object.entries(values)) {
      const entryId = fieldToEntryId[fieldKey];
      if (!entryId || value == null) continue;
      body.append(`entry.${entryId}`, String(value));
    }

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    // Google returns 200 HTML (or an opaque response). A resolved fetch is ok.
    return { ok: true };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
