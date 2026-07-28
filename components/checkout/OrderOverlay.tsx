'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, Lock, Loader2, CheckCircle2, AlertCircle, Minus, Plus } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { isPaystackConfigured, openPaystackCheckout } from '@/lib/paystack';

export type OrderPiece = {
  name: string;
  price: number;
  slug: string;
  size: string | null;
  category: string;
};

type OrderOverlayProps = {
  open: boolean;
  onClose: () => void;
  piece: OrderPiece;
};

type Status = 'form' | 'paying' | 'submitting' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full bg-transparent border border-almond-cream/20 text-almond-cream font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-nature-brown placeholder:text-almond-cream/25 transition-colors duration-300';
const labelClass = 'label-text text-[10px] text-almond-cream/40 block mb-2';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function OrderOverlay({ open, onClose, piece }: OrderOverlayProps) {
  const shouldReduce = useReducedMotion();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    address: '',
    notes: '',
  });
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<Status>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const publicKey = (process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? '').trim();
  const paymentConfigured = isPaystackConfigured();

  const unitPrice = piece.price;
  const total = unitPrice * qty;
  const emailValid = EMAIL_RE.test(form.email.trim());
  const requiredFilled =
    form.name.trim().length > 0 &&
    emailValid &&
    form.phone.trim().length > 0 &&
    form.address.trim().length > 0 &&
    qty >= 1;
  const busy = status === 'paying' || status === 'submitting';
  const canPay = paymentConfigured && requiredFilled && !busy;

  // Scroll-lock the page and wire Esc-to-close while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // Reset transient status shortly after closing (keeps typed details for the
  // exit animation, and gives a fresh state on reopen).
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStatus('form');
      setErrorMsg('');
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const submitOrder = async (reference: string) => {
    setStatus('submitting');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          altPhone: form.altPhone.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
          piece: piece.name,
          size: piece.size ?? '',
          qty,
          unitPrice,
          total,
        }),
      });
      if (!res.ok) {
        // The buyer already paid — log it, but still show success.
        console.warn('[order] /api/order responded non-OK after a successful payment.');
      }
    } catch (err) {
      console.warn('[order] Failed to record order after a successful payment.', err);
    }
    setStatus('success');
  };

  const handlePay = async () => {
    if (!canPay) return;
    setStatus('paying');
    setErrorMsg('');
    try {
      await openPaystackCheckout({
        publicKey,
        email: form.email.trim(),
        amount: Math.round(total * 100),
        currency: 'NGN',
        firstName: form.name.trim(),
        phone: form.phone.trim(),
        metadata: {
          piece: piece.name,
          slug: piece.slug,
          category: piece.category,
          size: piece.size ?? 'One Size',
          qty,
          custom_fields: [
            { display_name: 'Piece', variable_name: 'piece', value: piece.name },
            { display_name: 'Size', variable_name: 'size', value: piece.size ?? 'One Size' },
            { display_name: 'Quantity', variable_name: 'quantity', value: String(qty) },
          ],
        },
        onSuccess: ({ reference }) => {
          void submitOrder(reference);
        },
        onCancel: () => {
          setStatus('form');
        },
        onError: (error) => {
          setStatus('error');
          setErrorMsg(error?.message || 'Payment could not be started. Please try again.');
        },
      });
    } catch {
      setStatus('error');
      setErrorMsg('We could not open the payment window. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="order-overlay"
          className="fixed inset-0 z-[110] flex items-start md:items-center justify-center overflow-y-auto bg-near-black/80 backdrop-blur-sm p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label={`Order ${piece.name}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative my-auto w-full max-w-5xl bg-dark-wood border border-almond-cream/10 wash-dark shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order"
              className="absolute right-4 top-4 z-20 text-almond-cream/50 hover:text-almond-cream transition-colors"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            {status === 'success' ? (
              <SuccessState pieceName={piece.name} onClose={onClose} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* LEFT — order form */}
                <div className="p-6 md:p-10">
                  <p className="label-text text-[10px] text-nature-brown mb-3">Order</p>
                  <h2 className="font-display text-almond-cream text-2xl md:text-3xl leading-tight mb-6 pr-8">
                    {piece.name}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="ord-name" className={labelClass}>
                        Full Name <span className="text-nature-brown">*</span>
                      </label>
                      <input
                        id="ord-name"
                        type="text"
                        required
                        autoComplete="name"
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Your full name"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="ord-email" className={labelClass}>
                        Email <span className="text-nature-brown">*</span>
                      </label>
                      <input
                        id="ord-email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@email.com"
                        className={inputClass}
                      />
                      {form.email.length > 0 && !emailValid && (
                        <p className="mt-1.5 text-[11px] text-autumn-orange/80 font-body">
                          Enter a valid email address.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ord-phone" className={labelClass}>
                          Phone <span className="text-nature-brown">*</span>
                        </label>
                        <input
                          id="ord-phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          value={form.phone}
                          onChange={update('phone')}
                          placeholder="080 0000 0000"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="ord-altphone" className={labelClass}>
                          Alt. Phone
                        </label>
                        <input
                          id="ord-altphone"
                          type="tel"
                          value={form.altPhone}
                          onChange={update('altPhone')}
                          placeholder="Optional"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ord-address" className={labelClass}>
                        Delivery Address <span className="text-nature-brown">*</span>
                      </label>
                      <textarea
                        id="ord-address"
                        required
                        rows={3}
                        value={form.address}
                        onChange={update('address')}
                        placeholder="Street, city, state"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div>
                      <label htmlFor="ord-notes" className={labelClass}>
                        Comments / Notes
                      </label>
                      <textarea
                        id="ord-notes"
                        rows={2}
                        value={form.notes}
                        onChange={update('notes')}
                        placeholder="Anything we should know? (optional)"
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>
                </div>

                {/* RIGHT — payment panel */}
                <div className="p-6 md:p-10 bg-near-black/40 border-t md:border-t-0 md:border-l border-almond-cream/10 flex flex-col">
                  <p className="label-text text-[10px] text-almond-cream/40 mb-5">Order Summary</p>

                  <div className="space-y-3">
                    <SummaryRow label="Piece" value={piece.name} />
                    <SummaryRow label="Size" value={piece.size ?? 'One Size'} />
                    <SummaryRow label="Unit Price" value={formatPrice(unitPrice)} />

                    <div className="flex items-center justify-between gap-4 py-1">
                      <span className="label-text text-[10px] text-almond-cream/40">Quantity</span>
                      <div className="flex items-center border border-almond-cream/20">
                        <button
                          type="button"
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          disabled={qty <= 1}
                          aria-label="Decrease quantity"
                          className="p-2 text-almond-cream/60 hover:text-almond-cream disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(e) =>
                            setQty(Math.max(1, Math.floor(Number(e.target.value) || 1)))
                          }
                          aria-label="Quantity"
                          className="w-12 bg-transparent text-center text-almond-cream font-body text-sm py-2 focus:outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQty((q) => q + 1)}
                          aria-label="Increase quantity"
                          className="p-2 text-almond-cream/60 hover:text-almond-cream transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-5 border-t border-almond-cream/10 flex items-baseline justify-between">
                    <span className="label-text text-[10px] text-almond-cream/40">Total</span>
                    <span className="font-display text-nature-brown text-3xl">{formatPrice(total)}</span>
                  </div>

                  <div className="mt-8 md:mt-auto md:pt-8">
                    {!paymentConfigured ? (
                      <div className="border border-almond-cream/15 bg-almond-cream/[0.03] px-4 py-4 text-center">
                        <p className="font-body font-light text-almond-cream/60 text-sm">
                          Payment isn&apos;t set up yet.
                        </p>
                        <p className="font-body font-light text-almond-cream/35 text-xs mt-1">
                          Please use &ldquo;Make an Enquiry&rdquo; to reach us about this piece.
                        </p>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handlePay}
                          disabled={!canPay}
                          className="w-full bg-nature-brown text-dark-wood label-text text-xs py-4 px-6 hover:bg-ochre-brown transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {busy ? (
                            <>
                              <Loader2 size={15} className="animate-spin" />
                              {status === 'submitting' ? 'Confirming order…' : 'Opening checkout…'}
                            </>
                          ) : (
                            <>Pay {formatPrice(total)}</>
                          )}
                        </button>

                        {!requiredFilled && (
                          <p className="mt-3 text-[11px] text-almond-cream/45 font-body text-center">
                            {emailValid
                              ? 'Fill in the required details to continue to payment.'
                              : 'Enter your email to continue to payment.'}
                          </p>
                        )}

                        {status === 'error' && (
                          <p className="mt-3 text-[11px] text-autumn-orange/90 font-body text-center flex items-center justify-center gap-1.5">
                            <AlertCircle size={13} /> {errorMsg}
                          </p>
                        )}

                        <p className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-almond-cream/30 label-text">
                          <Lock size={11} /> Secured by Paystack
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="label-text text-[10px] text-almond-cream/40 shrink-0">{label}</span>
      <span className="font-body font-light text-almond-cream/80 text-sm text-right">{value}</span>
    </div>
  );
}

function SuccessState({ pieceName, onClose }: { pieceName: string; onClose: () => void }) {
  return (
    <div className="px-6 md:px-12 py-16 md:py-20 text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-full border border-nature-brown flex items-center justify-center mb-6">
        <CheckCircle2 size={26} className="text-nature-brown" strokeWidth={1.5} />
      </div>
      <h2 className="font-display text-almond-cream text-3xl md:text-4xl mb-3">Order placed.</h2>
      <p className="font-body font-light text-almond-cream/60 text-base max-w-md mb-2">
        Thank you — your payment for <span className="text-almond-cream">{pieceName}</span> came through.
      </p>
      <p className="font-body font-light text-almond-cream/45 text-sm max-w-md mb-8">
        We&apos;ll be in touch shortly to arrange delivery.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="border border-almond-cream/25 text-almond-cream/80 label-text text-xs py-3.5 px-10 hover:border-almond-cream/60 hover:text-almond-cream transition-all duration-300"
      >
        Done
      </button>
    </div>
  );
}
