'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import type { SanityEditorial } from '@/sanity/lib/fetch';

const COLS = 8;
const ROWS = 8;
const TOTAL = COLS * ROWS;

// Stagger order: diagonal wave pattern for a pixel-scatter feel
function buildRevealOrder(): number[] {
  const indices = Array.from({ length: TOTAL }, (_, i) => i);
  return indices.sort((a, b) => {
    const ax = a % COLS, ay = Math.floor(a / COLS);
    const bx = b % COLS, by = Math.floor(b / COLS);
    return (ax + ay) - (bx + by);
  });
}
const REVEAL_ORDER = buildRevealOrder();

export default function EditorialSection({ editorial }: { editorial?: SanityEditorial | null }) {
  const sectionLabel = editorial?.sectionLabel ?? 'SS 2026 Campaign';
  const headline = editorial?.headline ?? 'Define the moment.';
  const subheadline = editorial?.subheadline ?? 'Own the frame.';
  const imageUrl = editorial?.imageUrl ?? 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&h=800&q=80';
  const ctaText = editorial?.ctaText ?? 'Explore the Campaign';
  const ctaLink = editorial?.ctaLink ?? '/collections';

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!inView) return;
    setRevealed(new Set());
    REVEAL_ORDER.forEach((idx, order) => {
      setTimeout(() => {
        setRevealed((prev) => new Set(Array.from(prev).concat(idx)));
      }, order * 18); // 18ms per square × 64 squares = ~1.15s total
    });
  }, [inView]);

  // Sniper crosshair SVG overlay
  const SniperFrame = () => (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Outer circle scope */}
      <motion.circle
        cx="50" cy="50" r="42"
        fill="none" stroke="#CE8400" strokeWidth="0.4" strokeDasharray="2 1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.6 } : {}}
        transition={{ delay: 0.2, duration: 1.5, ease: 'easeInOut' }}
      />
      {/* Inner circle */}
      <motion.circle
        cx="50" cy="50" r="6"
        fill="none" stroke="#CE8400" strokeWidth="0.5"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 0.9 } : {}}
        transition={{ delay: 1.2, duration: 0.4 }}
      />
      {/* Center dot */}
      <motion.circle
        cx="50" cy="50" r="1"
        fill="#CE8400"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.2 }}
      />
      {/* Horizontal crosshair — left segment */}
      <motion.line x1="2" y1="50" x2="42" y2="50"
        stroke="#CE8400" strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
      />
      {/* Horizontal crosshair — right segment */}
      <motion.line x1="58" y1="50" x2="98" y2="50"
        stroke="#CE8400" strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
        transition={{ delay: 0.7, duration: 0.5 }}
      />
      {/* Vertical crosshair — top segment */}
      <motion.line x1="50" y1="2" x2="50" y2="42"
        stroke="#CE8400" strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
      />
      {/* Vertical crosshair — bottom segment */}
      <motion.line x1="50" y1="58" x2="50" y2="98"
        stroke="#CE8400" strokeWidth="0.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.7 } : {}}
        transition={{ delay: 0.9, duration: 0.5 }}
      />
      {/* Distance tick marks on horizontal crosshair */}
      {[20, 30, 70, 80].map((x) => (
        <motion.line key={`ht${x}`} x1={x} y1="48" x2={x} y2="52"
          stroke="#CE8400" strokeWidth="0.4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 1.1 }}
        />
      ))}
      {/* Distance tick marks on vertical crosshair */}
      {[20, 30, 70, 80].map((y) => (
        <motion.line key={`vt${y}`} x1="48" y1={y} x2="52" y2={y}
          stroke="#CE8400" strokeWidth="0.4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ delay: 1.1 }}
        />
      ))}
      {/* Corner L-brackets */}
      {[
        { x1: 2, y1: 12, x2: 2, y2: 2, x3: 12, y3: 2 },
        { x1: 98, y1: 12, x2: 98, y2: 2, x3: 88, y3: 2 },
        { x1: 2, y1: 88, x2: 2, y2: 98, x3: 12, y3: 98 },
        { x1: 98, y1: 88, x2: 98, y2: 98, x3: 88, y3: 98 },
      ].map((c, i) => (
        <motion.polyline
          key={i}
          points={`${c.x1},${c.y1} ${c.x2},${c.y2} ${c.x3},${c.y3}`}
          fill="none" stroke="#CE8400" strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ delay: 0.4 + i * 0.06, duration: 0.4 }}
        />
      ))}
    </svg>
  );

  return (
    <section ref={ref} className="relative bg-dark-wood overflow-hidden py-40">
      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="label-text text-xs text-nature-brown mb-6"
        >
          {sectionLabel}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-almond-cream text-4xl md:text-6xl lg:text-7xl text-center leading-tight mb-16 max-w-2xl"
        >
          {headline}<br />
          <span className="text-nature-brown">{subheadline}</span>
        </motion.h2>

        {/* Square image with sniper frame */}
        <div className="relative w-full max-w-[600px] mx-auto px-6 md:px-0">
          <SniperFrame />

          {/* Pixel grid container — square */}
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: '1/1' }}
          >
            {/* Background image (always mounted) */}
            <Image
              src={imageUrl}
              alt="Ciallade editorial campaign"
              fill
              className="object-cover"
              sizes="(min-width: 600px) 600px, 100vw"
            />

            {/* Pixel overlay: 8×8 grid of dark squares that hide, then reveal */}
            <div
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              }}
            >
              {Array.from({ length: TOTAL }, (_, idx) => (
                <motion.div
                  key={idx}
                  className="bg-dark-wood"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: revealed.has(idx) ? 0 : 1 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                />
              ))}
            </div>
          </div>
        </div>

        <motion.a
          href={ctaLink}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-16 inline-block border border-nature-brown text-nature-brown font-body label-text text-xs px-10 py-4 hover:bg-nature-brown hover:text-dark-wood transition-all duration-300"
        >
          {ctaText}
        </motion.a>
      </div>
    </section>
  );
}
