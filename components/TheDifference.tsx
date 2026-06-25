'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, reducedVariant } from '@/lib/animations';

type DiffItem = { symbol: string; ciallade: string; contrast: string };

const FALLBACK: DiffItem[] = [
  { symbol: '⊙', ciallade: 'Crafted with deliberate intention.', contrast: 'Mass-produced. Silent. Assumed.' },
  { symbol: '◈', ciallade: 'African luxury, on its own terms.', contrast: 'European luxury as the standard.' },
  { symbol: '∿', ciallade: 'Fashion as language. You are what you wear.', contrast: 'Fashion as trend. Follow or fade.' },
  { symbol: '⊕', ciallade: 'Defining your own silhouette.', contrast: 'Fitting into the mold.' },
];

export default function TheDifference({ items }: { items?: DiffItem[] | null }) {
  const diff = items?.length ? items : FALLBACK;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();
  const container = shouldReduce ? {} : staggerContainer;
  const item = shouldReduce ? reducedVariant : fadeUp;

  return (
    <section ref={ref} className="relative bg-dark-wood py-40 overflow-hidden">
      <div className="relative z-10 px-6 md:px-12">
        <motion.p
          variants={item}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="label-text text-xs text-nature-brown mb-4"
        >
          Why Ciallade
        </motion.p>
        <motion.h2
          variants={item}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.08 }}
          className="font-display text-almond-cream text-4xl md:text-5xl mb-20 leading-tight max-w-lg"
        >
          The Difference
        </motion.h2>

        {/* CIALLADE ROW (top) */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
        >
          {diff.map((d, i) => (
            <motion.div
              key={i}
              variants={item}
              transition={{ delay: i * 0.08 }}
            >
              <span className="block font-display text-nature-brown/30 text-2xl mb-3" aria-hidden>{d.symbol}</span>
              <p className="font-body text-almond-cream/90 text-base md:text-lg leading-snug font-medium">
                {d.ciallade}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* DIVIDER LINE with centered label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative flex items-center gap-4 my-2 mb-12"
        >
          <div className="flex-1 h-px bg-nature-brown/30" />
          <span className="label-text text-[10px] text-nature-brown/50 tracking-[0.3em] px-4">VERSUS</span>
          <div className="flex-1 h-px bg-nature-brown/30" />
        </motion.div>

        {/* INDUSTRY ROW (bottom) */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {diff.map((d, i) => (
            <motion.div
              key={i}
              variants={item}
              transition={{ delay: 0.6 + i * 0.08 }}
            >
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
