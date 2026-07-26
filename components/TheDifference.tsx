'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { staggerContainer, fadeUp, reducedVariant } from '@/lib/animations';
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

// Split a statement into a lead-in and its emphasised key phrase (~last 55%
// of words), so the phrase can shift weight + ink gold as it enters view.
function splitKeyPhrase(text: string): { head: string; phrase: string } {
  const words = text.trim().split(/\s+/);
  if (words.length <= 2) return { head: '', phrase: text };
  const cut = Math.max(1, Math.floor(words.length * 0.45));
  return { head: words.slice(0, cut).join(' ') + ' ', phrase: words.slice(cut).join(' ') };
}

// The reserved primitive here: a deliberate typographic weight + colour shift.
const phraseVariants: Variants = {
  hidden: { fontWeight: 300, color: 'rgba(255,235,205,0.55)' },
  visible: { fontWeight: 600, color: '#CE8400', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const phraseReduced: Variants = {
  hidden: { fontWeight: 600, color: '#CE8400' },
  visible: { fontWeight: 600, color: '#CE8400' },
};

export default function TheDifference({
  items,
  heading,
}: {
  items?: IncomingDiffItem[] | null;
  heading?: SanityHeading | null;
}) {
  // Items without a glyph reuse the built-in one at the same position so the
  // gold marker above each statement is never missing.
  const diff: DiffItem[] = items?.length
    ? items.map((d, i) => ({ ...d, symbol: d.symbol?.trim() || FALLBACK[i % FALLBACK.length].symbol }))
    : FALLBACK;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();
  const container = shouldReduce ? {} : staggerContainer;
  const item = shouldReduce ? reducedVariant : fadeUp;
  const phrase = shouldReduce ? phraseReduced : phraseVariants;

  return (
    <section ref={ref} className="relative bg-dark-wood py-32 md:py-44 overflow-hidden">
      <div className="relative z-10 px-6 md:px-12">
        <div className="mb-20">
          <SectionHeading
            eyebrow={heading?.eyebrow ?? 'Why Ciallade'}
            lines={toLines(heading?.title, heading?.titleAccent, 'The', 'Difference')}
            className="text-almond-cream text-4xl md:text-5xl"
            align="left"
            as="h2"
          />
        </div>

        {/* CIALLADE statements (above the divider) */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-12"
        >
          {diff.map((d, i) => {
            const { head, phrase: key } = splitKeyPhrase(d.ciallade);
            return (
              <motion.div key={i} variants={item} transition={{ delay: i * 0.08 }} className="group">
                <span className="block font-display text-nature-brown/30 text-2xl mb-4" aria-hidden>
                  {d.symbol}
                </span>
                <p className="font-body text-almond-cream/90 text-base md:text-lg leading-snug">
                  <span className="font-light text-almond-cream/70 transition-colors duration-300 group-hover:text-almond-cream">
                    {head}
                  </span>
                  <motion.span variants={phrase} className="inline">
                    {key}
                  </motion.span>
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Center hairline divider that draws in, with VERSUS label */}
        <div className="relative flex items-center gap-4 my-2 mb-12">
          <motion.div
            className="flex-1 h-px bg-nature-brown/30 origin-left"
            initial={{ scaleX: shouldReduce ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
          <span className="label-text text-[10px] text-nature-brown/50 tracking-[0.3em] px-4">VERSUS</span>
          <motion.div
            className="flex-1 h-px bg-nature-brown/30 origin-right"
            initial={{ scaleX: shouldReduce ? 1 : 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* Industry statements (below the divider) — struck-through, muted */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {diff.map((d, i) => (
            <motion.div key={i} variants={item} transition={{ delay: 0.6 + i * 0.08 }}>
              <p className="font-body font-light text-almond-cream/25 text-sm leading-snug line-through decoration-almond-cream/15">
                {d.contrast}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
