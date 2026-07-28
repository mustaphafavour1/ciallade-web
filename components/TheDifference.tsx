'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useReducedMotion, animate, type AnimationPlaybackControls } from 'framer-motion';
import { ChevronsLeftRight } from 'lucide-react';
import SectionHeading, { toLines } from '@/components/SectionHeading';
import type { SanityHeading } from '@/sanity/lib/fetch';

type DiffItem = { symbol: string; ciallade: string; contrast: string };
/** CMS shape — the glyph is optional there, so it is filled in on normalization. */
type IncomingDiffItem = { symbol?: string; ciallade: string; contrast: string };

const FALLBACK: DiffItem[] = [
  { symbol: '⊙', ciallade: 'Crafted with deliberate intention.', contrast: 'Mass-produced. Silent. Assumed.' },
  { symbol: '◈', ciallade: 'African luxury, on its own terms.', contrast: 'European luxury as the standard.' },
  { symbol: '∿', ciallade: 'Fashion as language. You are what you wear.', contrast: 'Fashion as trend. Follow or fade.' },
  { symbol: '⊕', ciallade: 'Defining your own silhouette.', contrast: 'Fitting into the mold.' },
];

// The interactive seam can travel between these fractions of the panel width.
const MIN = 0.2;
const MAX = 0.8;
// Horizontal offset (in % of width) between the seam's top and bottom, giving
// the divide its diagonal cut rather than a plain vertical rule.
const SKEW = 8;

/**
 * FRESH PRIMITIVE — a pointer-driven diagonal clip seam (a "territory
 * comparator"). Nothing else on the page reveals via clip-path or a draggable
 * boundary. The concept is literal: one movable divide between two worlds, and
 * the visitor drags it to decide how much ground each side holds. Ciallade
 * warms and brightens as its territory grows; the industry cools and recedes.
 */
export default function TheDifference({
  items,
  heading,
}: {
  items?: IncomingDiffItem[] | null;
  heading?: SanityHeading | null;
}) {
  // Items without a glyph reuse the built-in one at the same position so the
  // gold marker beside each Ciallade statement is never missing.
  const diff: DiffItem[] = items?.length
    ? items.map((d, i) => ({ ...d, symbol: d.symbol?.trim() || FALLBACK[i % FALLBACK.length].symbol }))
    : FALLBACK;

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(0.5);
  const draggingRef = useRef(false);
  const interactedRef = useRef(false);
  const sweepRef = useRef<AnimationPlaybackControls | null>(null);

  const stopSweep = useCallback(() => {
    interactedRef.current = true;
    sweepRef.current?.stop();
  }, []);

  const setFromClientX = useCallback((clientX: number) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    setSplit(Math.min(MAX, Math.max(MIN, raw)));
  }, []);

  // Self-demonstrating sweep on entry — the divide "breathes" once so the
  // visitor learns it is draggable. Skipped under reduced motion / after touch.
  useEffect(() => {
    if (shouldReduce || !inView || interactedRef.current) return;
    const controls = animate(0.5, [0.5, 0.36, 0.64, 0.5], {
      duration: 2.6,
      delay: 0.6,
      ease: [0.22, 1, 0.36, 1],
      times: [0, 0.34, 0.7, 1],
      onUpdate: (v) => {
        if (!interactedRef.current) setSplit(v);
      },
    });
    sweepRef.current = controls;
    return () => controls.stop();
  }, [inView, shouldReduce]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stopSweep();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) setFromClientX(e.clientX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      stopSweep();
      setSplit((s) => Math.max(MIN, s - 0.04));
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      stopSweep();
      setSplit((s) => Math.min(MAX, s + 0.04));
      e.preventDefault();
    }
  };

  // Diagonal seam geometry. topX/botX are the seam's x (in %) at the panel's
  // top and bottom edges; the two clip polygons tile perfectly along it.
  const topX = split * 100 + SKEW;
  const botX = split * 100 - SKEW;
  const cialladeClip = `polygon(${topX}% 0, 100% 0, 100% 100%, ${botX}% 100%)`;
  const industryClip = `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`;

  // t = how far the divide has been pushed toward Ciallade (0…1).
  const t = (split - MIN) / (MAX - MIN);
  const cialladeShare = Math.round(t * 100);
  const cialladeInk = 0.62 + 0.38 * t; // brightens as its ground grows
  const industryInk = 0.24 + 0.28 * (1 - t); // recedes as it loses ground

  return (
    <section ref={ref} className="relative bg-dark-wood py-32 md:py-44 overflow-hidden">
      <div className="relative z-10 px-6 md:px-12">
        <div className="mb-14 md:mb-20">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? 'Why Ciallade'}
            lines={toLines(heading?.title, heading?.titleAccent, 'The', 'Difference')}
            className="text-almond-cream text-4xl md:text-5xl"
            align="left"
            as="h2"
          />
        </div>

        {/* ── The divide: a draggable diagonal seam between two worlds ── */}
        <motion.div
          ref={panelRef}
          role="slider"
          tabIndex={0}
          aria-label="Drag the divide between the industry and Ciallade"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={cialladeShare}
          aria-valuetext={`Ciallade holds ${cialladeShare}% of the divide`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: shouldReduce ? 0.3 : 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full min-h-[520px] md:min-h-[560px] overflow-hidden rounded-[3px] cursor-ew-resize select-none outline-none ring-1 ring-nature-brown/15 focus-visible:ring-2 focus-visible:ring-nature-brown/70"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Industry field (left of seam) — cold, desaturated */}
          <div
            className="absolute inset-0 z-0"
            style={{
              clipPath: industryClip,
              backgroundColor: '#0D0803',
              backgroundImage:
                'linear-gradient(180deg, rgba(120,132,150,0.06), rgba(70,80,100,0.03))',
            }}
            aria-hidden
          />
          {/* Ciallade field (right of seam) — warm, gold-lit */}
          <div
            className="absolute inset-0 z-0"
            style={{
              clipPath: cialladeClip,
              backgroundColor: '#150B02',
              backgroundImage:
                'radial-gradient(ellipse at 78% 28%, rgba(206,132,0,0.20), transparent 62%), radial-gradient(ellipse at 92% 100%, rgba(117,73,43,0.16), transparent 55%)',
            }}
            aria-hidden
          />

          {/* Seam line + soft gold glow, tracing the diagonal */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 z-20 h-full w-full pointer-events-none"
            aria-hidden
          >
            <line x1={topX} y1={0} x2={botX} y2={100} stroke="#CE8400" strokeOpacity={0.25} strokeWidth={7} vectorEffect="non-scaling-stroke" />
            <line x1={topX} y1={0} x2={botX} y2={100} stroke="#CE8400" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          </svg>

          {/* Draggable handle, centred on the seam */}
          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ left: `${split * 100}%`, top: '50%' }}
            aria-hidden
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-nature-brown text-dark-wood shadow-[0_0_28px_rgba(206,132,0,0.55)]">
              <ChevronsLeftRight className="h-5 w-5" strokeWidth={2.25} />
            </span>
          </div>

          {/* Content overlay — always fully legible, aligned to opposite edges */}
          <div className="relative z-30 flex h-full min-h-[520px] md:min-h-[560px] flex-col justify-between px-6 py-9 md:px-12 md:py-12 pointer-events-none">
            {/* Column headers */}
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-[42%]" style={{ opacity: industryInk + 0.25 }}>
                <p className="label-text text-[10px] tracking-[0.3em] text-almond-cream/50">The Industry</p>
              </div>
              <div className="max-w-[46%] text-right" style={{ opacity: 0.7 + 0.3 * t }}>
                <p
                  className="label-text text-[10px] tracking-[0.3em] text-nature-brown"
                  style={{ transform: `scale(${1 + 0.05 * t})`, transformOrigin: 'right' }}
                >
                  Ciallade
                </p>
              </div>
            </div>

            {/* Paired statements — one row per item, industry vs Ciallade */}
            <div className="flex flex-1 flex-col justify-center gap-0 py-6">
              {diff.map((d, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 items-center gap-4 border-t border-almond-cream/10 py-4 first:border-t-0 md:gap-10"
                >
                  {/* Industry side */}
                  <p
                    className="font-body text-[13px] font-light leading-snug text-almond-cream line-through decoration-almond-cream/25 md:text-sm"
                    style={{ opacity: industryInk }}
                  >
                    {d.contrast}
                  </p>
                  {/* Ciallade side */}
                  <p
                    className="flex items-baseline justify-end gap-2 text-right font-body text-[15px] font-medium leading-snug text-almond-cream md:text-lg"
                    style={{ opacity: cialladeInk }}
                  >
                    <span className="font-body text-base leading-snug md:text-lg">{d.ciallade}</span>
                    <span className="font-display text-lg text-nature-brown/80 md:text-xl" aria-hidden>
                      {d.symbol}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Prompt */}
            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-nature-brown/40" />
              <p className="label-text text-[9px] tracking-[0.32em] text-nature-brown/60">Drag the divide</p>
              <span className="h-px w-6 bg-nature-brown/40" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
