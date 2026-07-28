'use client';

/**
 * Client-only helper around the official `@paystack/inline-js` library.
 *
 * The library is pulled in with a dynamic `import()` so it never lands in the
 * server bundle and is code-split out of the initial page load — it only
 * downloads when the buyer actually reaches the payment step.
 *
 * Only the PUBLIC key (`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`) is ever referenced
 * here. The secret key lives exclusively in the server route and is never
 * imported into any client module.
 */

export type PaystackCheckoutOptions = {
  publicKey: string;
  email: string;
  /** Amount in the smallest currency unit (kobo for NGN). */
  amount: number;
  currency?: string;
  reference?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
  onSuccess: (result: { reference: string }) => void;
  onCancel?: () => void;
  onError?: (error: { message?: string }) => void;
};

/** True when a usable public key is configured (inlined at build time). */
export function isPaystackConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim());
}

/**
 * Launches the Paystack inline checkout popup. The returned promise resolves
 * once the popup has been opened (or rejects if the library fails to load);
 * the transaction outcome arrives through the onSuccess / onCancel / onError
 * callbacks.
 */
export async function openPaystackCheckout(options: PaystackCheckoutOptions): Promise<void> {
  const { default: PaystackPop } = await import('@paystack/inline-js');
  const paystack = new PaystackPop();

  paystack.newTransaction({
    key: options.publicKey,
    email: options.email,
    amount: options.amount,
    currency: options.currency ?? 'NGN',
    ...(options.reference ? { reference: options.reference } : {}),
    ...(options.firstName ? { firstName: options.firstName } : {}),
    ...(options.lastName ? { lastName: options.lastName } : {}),
    ...(options.phone ? { phone: options.phone } : {}),
    ...(options.metadata ? { metadata: options.metadata } : {}),
    onSuccess: (transaction) => options.onSuccess({ reference: transaction.reference }),
    onCancel: () => options.onCancel?.(),
    onError: (error) => options.onError?.(error),
  });
}
