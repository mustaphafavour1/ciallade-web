import { NextResponse } from 'next/server';
import { forwardToGoogleForm } from '@/lib/forms/googleForm';

// Coerce any field value into the string shape the Google Form forwarder wants.
const s = (v: unknown): string => (v == null ? '' : String(v));

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, reason: 'bad_request' }, { status: 400 });
  }

  const result = await forwardToGoogleForm(process.env.ENQUIRY_FORM_PREFILL_URL, {
    name: s(body.name),
    email: s(body.email),
    phone: s(body.phone),
    message: s(body.message),
    piece: s(body.piece),
  });

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }
  // Surface the reason so the client can show a graceful retry message.
  return NextResponse.json({ ok: false, reason: result.reason });
}
