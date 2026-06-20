'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

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
  const outerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  const [frame, setFrame] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // 3 frames over scroll 0→1, last frame at 0.67→1
    setFrame(Math.min(2, Math.floor(v * 3)));
  });

  // The two milestones for this frame
  const m0 = MILESTONES[frame * 2];
  const m1 = MILESTONES[frame * 2 + 1];

  return (
    <div ref={outerRef} className="relative" style={{ minHeight: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-almond-cream">
        {/* Header */}
        <div className="px-8 md:px-16 pt-24 pb-0">
          <p className="label-text text-xs text-coffee-brown mb-3">Since 2020</p>
          <h2
            className="font-display text-dark-wood leading-tight"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            The Journey So Far
          </h2>
        </div>

        {/* Two milestones */}
        <AnimatePresence mode="wait">
          <motion.div
            key={frame}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="px-8 md:px-16 flex flex-col gap-20 mt-16"
          >
            {[m0, m1].filter(Boolean).map((m) => (
              <div key={m.year} className="flex gap-10 md:gap-16 items-start">
                {/* Year — very large */}
                <div className="flex-none" style={{ minWidth: '120px' }}>
                  <span
                    className="font-display text-nature-brown leading-none"
                    style={{ fontSize: 'clamp(56px, 7vw, 100px)' }}
                  >
                    {m.year}
                  </span>
                </div>
                {/* Vertical divider */}
                <div className="flex-none w-px self-stretch bg-coffee-brown/20 mt-2" />
                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3
                    className="font-display text-dark-wood leading-tight mb-4"
                    style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}
                  >
                    {m.title}
                  </h3>
                  <p className="font-body font-light text-dark-wood/60 text-base md:text-lg leading-relaxed max-w-lg">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-8 left-8 md:left-16 flex gap-2 items-center">
          {[0, 1, 2].map((f) => (
            <div
              key={f}
              className="h-px transition-all duration-500"
              style={{
                width: f === frame ? '48px' : '16px',
                background: f === frame ? '#CE8400' : 'rgba(117,73,43,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
