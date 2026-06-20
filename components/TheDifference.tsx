'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, reducedVariant } from '@/lib/animations';

const DIFF = [
  {
    contrast: 'Mass-produced in silence',
    ciallade: 'Crafted with deliberate intention — every stitch chosen, not assumed.',
    sym: '⊙',
  },
  {
    contrast: 'European luxury as the standard',
    ciallade: 'African luxury on its own terms. No apology. No imitation.',
    sym: '◈',
  },
  {
    contrast: 'Fashion as trend',
    ciallade: 'Fashion as language. What you wear is what you say.',
    sym: '∿',
  },
  {
    contrast: 'Fitting into a mold',
    ciallade: 'Defining your own silhouette, on your own terms.',
    sym: '⊕',
  },
];

export default function TheDifference() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();
  const container = shouldReduce ? {} : staggerContainer;
  const item = shouldReduce ? reducedVariant : fadeUp;

  return (
    <section ref={ref} className="relative bg-dark-wood py-24 overflow-hidden">
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
          className="font-display text-almond-cream text-4xl md:text-5xl mb-16 leading-tight max-w-lg"
        >
          The Difference
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-nature-brown/10"
        >
          {DIFF.map((d, i) => (
            <motion.div
              key={i}
              variants={item}
              transition={{ delay: i * 0.08 }}
              className="bg-dark-wood p-10 group relative overflow-hidden"
            >
              {/* Hover fill */}
              <motion.div
                className="absolute inset-0 bg-nature-brown/5 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />

              <span
                className="block text-nature-brown/25 mb-6 font-display relative z-10"
                style={{ fontSize: '36px' }}
                aria-hidden="true"
              >
                {d.sym}
              </span>

              {/* Industry line */}
              <div className="relative z-10 mb-5 flex items-start gap-3">
                <span className="mt-1 flex-none w-3 h-px bg-almond-cream/20 translate-y-2" />
                <p className="font-body font-light text-almond-cream/30 text-sm line-through decoration-almond-cream/20">
                  {d.contrast}
                </p>
              </div>

              {/* Ciallade line */}
              <div className="relative z-10 flex items-start gap-3">
                <span className="mt-1 flex-none w-3 h-px bg-nature-brown" />
                <p className="font-body text-almond-cream/85 text-base leading-snug">{d.ciallade}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
