'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useReducedMotion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const THREADS = [
  {
    id: 0,
    d: 'M 0,200 C 350,180 600,350 750,420 C 900,490 1200,380 1440,300',
    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=380&h=570&q=80',
    label: 'Ochre Linen Top',
  },
  {
    id: 1,
    d: 'M 0,700 C 300,550 580,430 750,420 C 920,410 1200,290 1440,180',
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=380&h=570&q=80',
    label: 'Dark Wood Jacket',
  },
  {
    id: 2,
    d: 'M 480,0 C 640,200 720,340 750,420 C 780,500 680,700 480,900',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=380&h=570&q=80',
    label: 'Almond Draped Shirt',
  },
  {
    id: 3,
    d: 'M 1440,80 C 1200,240 960,370 750,420 C 560,468 260,490 0,460',
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=380&h=570&q=80',
    label: 'Statement Coat',
  },
  {
    id: 4,
    d: 'M 0,900 C 300,720 560,510 750,420 C 940,330 1200,200 1440,20',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=380&h=570&q=80',
    label: 'Maroon Trousers',
  },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduce = useReducedMotion();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const cardX = useMotionValue(-9999);
  const cardY = useMotionValue(-9999);

  const handleMove = useCallback(
    (e: React.MouseEvent, id: number) => {
      if (shouldReduce) return;
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const cardH = rect.height * 0.5;
      const cardW = 200;
      const gap = 90;
      let lx = mx + gap;
      let ly = my - cardH / 2;
      if (lx + cardW > rect.width - 16) lx = mx - cardW - gap;
      if (ly < 16) ly = 16;
      if (ly + cardH > rect.height - 16) ly = rect.height - cardH - 16;
      cardX.set(lx);
      cardY.set(ly);
      setHoveredId(id);
    },
    [shouldReduce, cardX, cardY],
  );

  const handleLeave = useCallback(() => {
    setHoveredId(null);
    cardX.set(-9999);
    cardY.set(-9999);
  }, [cardX, cardY]);

  const hoveredThread = THREADS.find((t) => t.id === hoveredId) ?? null;

  return (
    <section
      ref={heroRef}
      className="relative min-h-dvh overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 80% 10%, rgba(254,112,23,0.07) 0%, transparent 40%),
          radial-gradient(ellipse at 70% 50%, rgba(206,132,0,0.06) 0%, transparent 45%),
          radial-gradient(ellipse at 10% 85%, rgba(117,73,43,0.08) 0%, transparent 40%),
          linear-gradient(155deg, #080501 0%, #1C1004 38%, #100801 70%, #060400 100%)
        `,
      }}
    >
      {/* Slow shimmer sweep */}
      {!shouldReduce && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(108deg, transparent 35%, rgba(206,132,0,0.04) 50%, transparent 65%)',
          }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 14, repeat: Infinity, repeatDelay: 8, ease: 'linear' }}
        />
      )}

      {/* Thread lines — visual (no pointer events) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ pointerEvents: 'none' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Central intersection marker */}
        <circle cx="750" cy="420" r="3" fill="#CE8400" opacity="0.45" />
        <circle cx="750" cy="420" r="9" fill="none" stroke="#CE8400" strokeWidth="0.5" opacity="0.25" />

        {/* Connecting thread from "Be Yourself" (top-left) to "Reinvent Always" (centre-right) */}
        <motion.path
          d="M 360,130 Q 620,270 880,420"
          fill="none"
          stroke="#CE8400"
          strokeWidth="0.7"
          strokeDasharray="5 9"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ delay: 1.6, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.circle
          cx="360" cy="130" r="2.5"
          fill="#CE8400"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ delay: 1.55, duration: 0.35 }}
        />

        {THREADS.map((t, idx) => (
          <motion.path
            key={t.id}
            d={t.d}
            fill="none"
            stroke="#CE8400"
            strokeWidth={hoveredId === t.id ? 1.2 : 0.7}
            strokeDasharray="5 9"
            strokeLinecap="round"
            opacity={hoveredId === t.id ? 0.7 : 0.2}
            initial={shouldReduce ? undefined : { pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: 1,
              opacity: hoveredId === t.id ? 0.7 : 0.2,
              strokeWidth: hoveredId === t.id ? 1.2 : 0.7,
            }}
            transition={{
              pathLength: { duration: 2.2, ease: 'easeInOut', delay: 0.5 + idx * 0.25 },
              opacity: { duration: 0.4 },
              strokeWidth: { duration: 0.3 },
            }}
            filter={hoveredId === t.id ? 'url(#glow)' : undefined}
          />
        ))}
      </svg>

      {/* Thread hit targets */}
      <svg
        className="absolute inset-0 w-full h-full z-10"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {THREADS.map((t) => (
          <path
            key={t.id}
            d={t.d}
            fill="none"
            stroke="transparent"
            strokeWidth="28"
            style={{ cursor: 'crosshair' }}
            onMouseMove={(e) => handleMove(e as unknown as React.MouseEvent, t.id)}
            onMouseLeave={handleLeave}
          />
        ))}
      </svg>

      {/* "Be Yourself" — top left, appears second */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 z-20"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="label-text text-[10px] text-nature-brown tracking-widest mb-2">
          NEW COLLECTION · SS 2026
        </p>
        <h2
          className="font-display text-almond-cream/90 leading-[0.92]"
          style={{ fontSize: 'clamp(26px, 3.2vw, 50px)' }}
        >
          Be{' '}
          <span className="text-nature-brown">Yourself.</span>
        </h2>
      </motion.div>

      {/* "Reinvent Always" — centre-right, appears first */}
      <div className="absolute inset-0 z-20 flex items-center justify-end pr-8 md:pr-14 lg:pr-20">
        <motion.h1
          className="font-display text-almond-cream leading-[0.88] text-right"
          style={{ fontSize: 'clamp(46px, 6.5vw, 92px)' }}
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          Reinvent
          <br />
          <span className="text-nature-brown">Always.</span>
        </motion.h1>
      </div>

      {/* Subtitle — bottom left */}
      <motion.div
        className="absolute bottom-10 left-8 md:left-12 z-20 max-w-[260px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-body font-light text-almond-cream/45 text-sm leading-relaxed">
          A luxury Nigerian fashion brand
          <br />
          crafted for those who define themselves.
        </p>
      </motion.div>

      {/* Button — far right */}
      <motion.div
        className="absolute bottom-10 right-8 md:right-12 z-20"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/collections"
          className="inline-block border border-nature-brown text-nature-brown label-text text-[10px] px-8 py-4 hover:bg-nature-brown hover:text-dark-wood transition-all duration-300"
        >
          Explore Ciallade&apos;s Collection
        </Link>
      </motion.div>

      {/* Hover card — follows mouse, flips in/out */}
      <AnimatePresence mode="wait">
        {hoveredThread && (
          <motion.div
            key={hoveredThread.id}
            className="absolute z-30 pointer-events-none overflow-hidden"
            style={{
              x: cardX,
              y: cardY,
              width: 200,
              height: '50vh',
              rotate: -4,
              transformOrigin: 'top center',
              perspective: 900,
            }}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Thread connecting card to line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-px bg-nature-brown/40 w-px"
              style={{ height: 20, top: -20 }}
            />
            <div className="relative w-full h-full border border-nature-brown/25 shadow-[4px_12px_40px_rgba(0,0,0,0.7)]">
              <Image
                src={hoveredThread.img}
                alt={hoveredThread.label}
                fill
                className="object-cover"
                sizes="200px"
              />
              <div className="absolute inset-0 bg-dark-wood/15" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-dark-wood/80 to-transparent">
                <p className="label-text text-[9px] text-nature-brown">{hoveredThread.label}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
