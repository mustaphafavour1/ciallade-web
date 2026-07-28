import { NextResponse } from 'next/server';
import { forwardToGoogleForm } from '@/lib/forms/googleForm';
import { ORDER_FORM } from '@/lib/forms/config';

// Coerce any field value into the string shape the Google Form forwarder wants.
const s = (v: unknown): string => (v == null ? '' : String(v));

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const reference = s(body.reference);
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // Verify the payment server-side when we can. With a secret key and a
  // reference, the transaction must have status "success" or we reject.
  if (secret && reference) {
    try {
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        { headers: { Authorization: `Bearer ${secret}` }, cache: 'no-store' },
      );
      const verifyJson = (await verifyRes.json()) as { data?: { status?: string } };
      if (!verifyRes.ok || verifyJson?.data?.status !== 'success') {
        return NextResponse.json({ ok: false }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
  } else if (!secret) {
    console.warn('[api/order] PAYSTACK_SECRET_KEY not set — skipping server-side verification.');
  }

  // Payment is good. Forward to the Google Form on a best-effort basis: the
  // buyer has already paid, so a forwarding failure must never reach them.
  const forward = await forwardToGoogleForm(ORDER_FORM, {
    name: s(body.name),
    email: s(body.email),
    phone: s(body.phone),
    altPhone: s(body.altPhone),
    address: s(body.address),
    notes: s(body.notes),
    piece: s(body.piece),
    size: s(body.size),
    unitPrice: s(body.unitPrice),
    qty: s(body.qty),
    total: s(body.total),
    reference,
    status: 'PAID',
  });

  if (!forward.ok) {
    console.warn(
      `[api/order] Google Form forward failed (${forward.reason ?? 'unknown'}) for reference ${reference || 'n/a'}.`,
    );
  }

  // Payment succeeded — always report success to the buyer.
  return NextResponse.json({ ok: true });
}
