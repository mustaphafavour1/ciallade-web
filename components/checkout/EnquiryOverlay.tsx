'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export type EnquiryPiece = {
  name: string;
  category?: string;
};

type EnquiryOverlayProps = {
  open: boolean;
  onClose: () => void;
  piece: EnquiryPiece;
};

type Status = 'form' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  'w-full bg-transparent border border-almond-cream/20 text-almond-cream font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-nature-brown placeholder:text-almond-cream/25 transition-colors duration-300';
const labelClass = 'label-text text-[10px] text-almond-cream/40 block mb-2';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function EnquiryOverlay({ open, onClose, piece }: EnquiryOverlayProps) {
  const shouldReduce = useReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<Status>('form');
  const [errorMsg, setErrorMsg] = useState('');

  const emailValid = EMAIL_RE.test(form.email.trim());
  const canSubmit =
    form.name.trim().length > 0 &&
    emailValid &&
    form.message.trim().length > 0 &&
    status !== 'sending';

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

  // Reset transient status shortly after closing.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          piece: piece.name,
        }),
      });
      const data = (await res.json().catch(() => ({ ok: false }))) as { ok?: boolean };
      if (res.ok && data.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg("We couldn't send your enquiry just now. Please try again in a moment.");
      }
    } catch {
      setStatus('error');
      setErrorMsg("We couldn't send your enquiry just now. Please try again in a moment.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="enquiry-overlay"
          className="fixed inset-0 z-[110] flex items-start md:items-center justify-center overflow-y-auto bg-near-black/80 backdrop-blur-sm p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label={`Enquire about ${piece.name}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative my-auto w-full max-w-lg bg-dark-wood border border-almond-cream/10 wash-dark shadow-2xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry"
              className="absolute right-4 top-4 z-20 text-almond-cream/50 hover:text-almond-cream transition-colors"
            >
              <X size={22} strokeWidth={1.5} />
            </button>

            {status === 'success' ? (
              <div className="px-6 md:px-12 py-16 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border border-nature-brown flex items-center justify-center mb-6">
                  <CheckCircle2 size={26} className="text-nature-brown" strokeWidth={1.5} />
                </div>
                <h2 className="font-display text-almond-cream text-3xl md:text-4xl mb-3">
                  Enquiry sent.
                </h2>
                <p className="font-body font-light text-almond-cream/60 text-base max-w-sm mb-8">
                  Thank you for reaching out about{' '}
                  <span className="text-almond-cream">{piece.name}</span>. We&apos;ll reply shortly.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="border border-almond-cream/25 text-almond-cream/80 label-text text-xs py-3.5 px-10 hover:border-almond-cream/60 hover:text-almond-cream transition-all duration-300"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 md:p-10">
                <p className="label-text text-[10px] text-nature-brown mb-3">Enquiry</p>
                <h2 className="font-display text-almond-cream text-2xl md:text-3xl leading-tight mb-1 pr-8">
                  Make an Enquiry
                </h2>
                <p className="font-body font-light text-almond-cream/50 text-sm mb-7">
                  About <span className="text-almond-cream/80">{piece.name}</span>
                </p>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="enq-name" className={labelClass}>
                      Full Name <span className="text-nature-brown">*</span>
                    </label>
                    <input
                      id="enq-name"
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
                    <label htmlFor="enq-email" className={labelClass}>
                      Email <span className="text-nature-brown">*</span>
                    </label>
                    <input
                      id="enq-email"
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

                  <div>
                    <label htmlFor="enq-phone" className={labelClass}>
                      Phone
                    </label>
                    <input
                      id="enq-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={update('phone')}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="enq-message" className={labelClass}>
                      Message <span className="text-nature-brown">*</span>
                    </label>
                    <textarea
                      id="enq-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={update('message')}
                      placeholder="What would you like to know?"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="mt-7 w-full bg-nature-brown text-dark-wood label-text text-xs py-4 px-6 hover:bg-ochre-brown transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      <Send size={14} /> Send Enquiry
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <p className="mt-3 text-[11px] text-autumn-orange/90 font-body text-center flex items-center justify-center gap-1.5">
                    <AlertCircle size={13} /> {errorMsg}
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
