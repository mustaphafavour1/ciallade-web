'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { fadeUp, reducedVariant } from '@/lib/animations';

const MILESTONES = [
  {
    year: '2020',
    title: 'The Conviction',
    desc: 'Founded in Lagos on a single belief: African luxury on its own terms, borrowing nothing from anywhere.',
  },
  {
    year: '2021',
    title: 'First Stitch',
    desc: 'The inaugural collection — 12 pieces, each one a vocabulary word in a new fashion language.',
  },
  {
    year: '2022',
    title: 'The Atelier',
    desc: 'Our Lagos studio opened. A space where every pattern is deliberate and every cut is a sentence.',
  },
  {
    year: '2023',
    title: 'Beyond Borders',
    desc: 'First international stockists. Ciallade began speaking to the world from its own ground.',
  },
  {
    year: '2024',
    title: 'Digital Flagship',
    desc: 'Launched online. A luxury experience now accessible globally, permanently rooted locally.',
  },
  {
    year: '2026',
    title: 'SS 2026 Campaign',
    desc: 'Define the moment. Own the frame. A new vocabulary for a new season.',
  },
];

export default function JourneySoFar() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();
  const item = shouldReduce ? reducedVariant : fadeUp;

  return (
    <section ref={ref} className="relative bg-almond-cream py-24 overflow-hidden">
      {/* Subtle diagonal stripe background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #1C1004 0px, #1C1004 1px, transparent 1px, transparent 40px)',
        }}
      />

      <div className="relative z-10 px-6 md:px-12">
        <motion.p
          variants={item}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="label-text text-xs text-coffee-brown mb-4"
        >
          Since 2020
        </motion.p>
        <motion.h2
          variants={item}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.08 }}
          className="font-display text-dark-wood text-4xl md:text-5xl mb-20 leading-tight"
        >
          The Journey So Far
        </motion.h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-[calc(theme(spacing.16)+1px)] top-0 w-px bg-coffee-brown/20 hidden md:block"
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ delay: 0.3, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%' }}
          />

          <div className="space-y-12 md:space-y-10">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                variants={item}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex gap-8 md:gap-12 items-start"
              >
                {/* Year */}
                <div className="flex-none w-16 text-right">
                  <span className="font-display text-coffee-brown text-xl leading-none">{m.year}</span>
                </div>

                {/* Dot */}
                <div className="flex-none hidden md:flex items-start pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-nature-brown border-2 border-almond-cream shadow-[0_0_0_3px_rgba(206,132,0,0.2)]" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <h3 className="font-display text-dark-wood text-2xl mb-2 leading-tight">
                    {m.title}
                  </h3>
                  <p className="font-body font-light text-dark-wood/60 text-sm leading-relaxed max-w-lg">
                    {m.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
