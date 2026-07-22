'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useReducedMotion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/SectionHeading';
import type { SanityMilestone } from '@/sanity/lib/fetch';

const FALLBACK_MILESTONES: SanityMilestone[] = [
  { _id: '1', year: '2020', title: 'The Conviction', body: 'Founded in Lagos on a single belief: African luxury on its own terms, borrowing nothing from anywhere.' },
  { _id: '2', year: '2021', title: 'First Stitch', body: 'The inaugural collection — 12 pieces, each one a vocabulary word in a new fashion language.' },
  { _id: '3', year: '2022', title: 'The Atelier', body: 'Our Lagos studio opened. A space where every pattern is deliberate and every cut is a sentence.' },
  { _id: '4', year: '2023', title: 'Beyond Borders', body: 'First international stockists. Ciallade began speaking to the world from its own ground.' },
  { _id: '5', year: '2024', title: 'Digital Flagship', body: 'Launched online. A luxury experience now accessible globally, permanently rooted locally.' },
  { _id: '6', year: '2026', title: 'SS 2026 Campaign', body: 'Define the moment. Own the frame. A new vocabulary for a new season.' },
];

// Height (in em) of a single odometer digit cell. A touch over 1em to keep
// serif figures from clipping inside the overflow-hidden window.
const CELL = 1.1;

/** One rolling digit reel: a vertical 0–9 strip that spins up to `digit`. */
function OdometerDigit({ digit, delay, reduce }: { digit: number; delay: number; reduce: boolean }) {
  const rest = `${-digit * CELL}em`;
  return (
    <span
      className="relative inline-block overflow-hidden align-baseline"
      style={{ height: `${CELL}em`, lineHeight: CELL }}
    >
      {/* Invisible placeholder sizes the window to the final glyph's width. */}
      <span className="invisible block text-center" aria-hidden style={{ lineHeight: CELL }}>
        {digit}
      </span>
      <motion.span
        aria-hidden
        className="absolute inset-x-0 top-0 flex flex-col text-center"
        initial={{ y: reduce ? rest : '0em' }}
        animate={{ y: rest }}
        transition={reduce ? { duration: 0 } : { duration: 1.3, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="block" style={{ height: `${CELL}em`, lineHeight: CELL }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** The reserved primitive for this section: an odometer year count-up. */
function OdometerYear({ year }: { year: string }) {
  const reduce = useReducedMotion() ?? false;
  return (
    <span className="relative inline-flex">
      <span className="sr-only">{year}</span>
      <span aria-hidden className="inline-flex">
        {year.split('').map((ch, i) => {
          const d = Number.parseInt(ch, 10);
          return Number.isNaN(d) ? (
            <span key={i}>{ch}</span>
          ) : (
            <OdometerDigit key={i} digit={d} delay={i * 0.12} reduce={reduce} />
          );
        })}
      </span>
    </span>
  );
}

export default function JourneySoFar({ milestones }: { milestones?: SanityMilestone[] | null }) {
  const data = milestones?.length ? milestones : FALLBACK_MILESTONES;
  const frameCount = Math.max(1, Math.ceil(data.length / 2));

  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  const [frame, setFrame] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setFrame(Math.min(frameCount - 1, Math.floor(v * frameCount)));
  });

  const m0 = data[frame * 2];
  const m1 = data[frame * 2 + 1];

  return (
    <div ref={outerRef} className="relative" style={{ minHeight: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-deep-brown wash-dark">
        {/* Header */}
        <div className="px-6 md:px-12 pt-20 md:pt-24 pb-0">
          <SectionHeading
            eyebrow="Since 2020"
            lines={[[{ text: 'The Journey So ' }, { text: 'Far', accent: true }]]}
            className="text-almond-cream text-4xl md:text-6xl"
            align="left"
            as="h2"
          />
        </div>

        {/* Two milestones per frame — cross-fading */}
        <AnimatePresence mode="wait">
          <motion.div
            key={frame}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="px-6 md:px-12 flex flex-col gap-12 md:gap-16 mt-12 md:mt-16"
          >
            {[m0, m1].filter(Boolean).map((m) => (
              <div key={m.year} className="flex gap-8 md:gap-16 items-start">
                {/* Year — very large, odometer count-up */}
                <div className="flex-none" style={{ minWidth: '120px' }}>
                  <span
                    className="font-display text-nature-brown leading-none"
                    style={{ fontSize: 'clamp(56px, 7vw, 100px)' }}
                  >
                    <OdometerYear year={m.year} />
                  </span>
                </div>
                {/* Vertical divider */}
                <div className="flex-none w-px self-stretch bg-almond-cream/15 mt-2" />
                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3
                    className="font-display text-almond-cream leading-tight mb-4"
                    style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
                  >
                    {m.title}
                  </h3>
                  <p className="font-body font-light text-almond-cream/60 text-base md:text-lg leading-relaxed max-w-lg">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 left-6 md:left-12 flex gap-2 items-center">
          {Array.from({ length: frameCount }, (_, f) => (
            <div
              key={f}
              className="h-px transition-all duration-500"
              style={{
                width: f === frame ? '48px' : '16px',
                background: f === frame ? '#CE8400' : 'rgba(255,235,205,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
