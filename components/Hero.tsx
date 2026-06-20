'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

const CLOTHES = [
  {
    id: 'shirt',
    label: 'Short-sleeve Shirt',
    viewBox: '0 0 100 130',
    paths: [
      'M 38,14 C 40,7 60,7 62,14 L 75,17 L 94,33 L 87,46 L 78,39 L 78,112 L 22,112 L 22,39 L 13,46 L 6,33 L 25,17 Z',
      'M 50,8 L 44,28 L 38,14 M 50,8 L 56,28 L 62,14',
      'M 47,34 L 53,34 M 47,48 L 53,48 M 47,62 L 53,62',
      'M 32,44 L 48,44 L 48,56 L 32,56',
    ],
  },
  {
    id: 'longsleeve',
    label: 'Long-sleeve Shirt',
    viewBox: '0 0 100 130',
    paths: [
      'M 38,14 C 40,7 60,7 62,14 L 76,18 L 97,60 L 90,67 L 78,52 L 78,112 L 22,112 L 22,52 L 10,67 L 3,60 L 24,18 Z',
      'M 50,8 L 44,28 L 38,14 M 50,8 L 56,28 L 62,14',
      'M 47,34 L 53,34 M 47,48 L 53,48 M 47,62 L 53,62',
      'M 90,65 L 78,51 M 10,65 L 22,51',
    ],
  },
  {
    id: 'trousers',
    label: 'Trousers',
    viewBox: '0 0 80 145',
    paths: [
      'M 14,6 L 66,6 Q 70,32 65,56 L 60,138 L 46,138 L 43,70 Q 42,67 40,66 Q 38,67 37,70 L 34,138 L 20,138 L 15,56 Q 10,32 14,12 Z',
      'M 14,6 L 66,6 L 66,20 L 14,20',
      'M 22,6 L 22,20 M 40,6 L 40,20 M 58,6 L 58,20',
      'M 53,56 L 56,138 M 27,56 L 24,138',
    ],
  },
  {
    id: 'tshirt',
    label: 'Roundneck',
    viewBox: '0 0 100 130',
    paths: [
      'M 40,13 Q 50,5 60,13 L 74,17 L 89,30 L 82,44 L 74,38 L 74,112 L 26,112 L 26,38 L 18,44 L 11,30 L 26,17 Z',
      'M 40,13 Q 50,22 60,13',
      'M 26,38 L 18,44 M 74,38 L 82,44',
      'M 42,60 L 42,76 L 58,76 L 58,60',
    ],
  },
  {
    id: 'jacket',
    label: 'Jacket',
    viewBox: '0 0 100 132',
    paths: [
      'M 40,10 Q 44,19 50,28 Q 56,19 60,10 L 76,14 L 95,28 L 88,42 L 78,36 L 78,122 L 22,122 L 22,36 L 12,42 L 5,28 L 24,14 Z',
      'M 40,10 L 46,30 L 50,28 M 60,10 L 54,30 L 50,28',
      'M 28,52 L 46,52',
      'M 24,86 L 48,86 L 48,96 L 24,96 M 52,86 L 76,86 L 76,96 L 52,96',
    ],
  },
  {
    id: 'native',
    label: 'Native Top',
    viewBox: '0 0 120 130',
    paths: [
      'M 60,8 L 44,12 L 4,22 L 4,56 L 30,48 L 30,120 L 90,120 L 90,48 L 116,56 L 116,22 L 76,12 Z',
      'M 60,10 L 60,74',
      'M 52,10 L 56,6 L 60,8 L 64,6 L 68,10 L 64,14 L 60,16 L 56,14 Z',
      'M 4,48 L 30,42 M 116,48 L 90,42 M 30,112 L 90,112',
    ],
  },
];

const DRAW_DURATION = 4.2;
const INTERVAL = 8000;

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: { duration: DRAW_DURATION, ease: 'easeInOut' as const, delay: i * 0.5 },
  }),
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: { duration: 1.4, ease: 'easeIn' as const },
  },
};

function ClothingCycle() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % CLOTHES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  const item = CLOTHES[idx];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
      <div style={{ height: '75vh' }}>
        <AnimatePresence mode="wait">
          <motion.svg
            key={item.id}
            viewBox={item.viewBox}
            style={{ height: '100%', width: 'auto' }}
            preserveAspectRatio="xMidYMid meet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0, transition: { delay: 1.3, duration: 0.1 } }}
            transition={{ duration: 0.4 }}
          >
            {item.paths.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="#CE8400"
                strokeWidth="1.2"
                strokeDasharray="0.1 5"
                strokeLinecap="round"
                strokeLinejoin="round"
                custom={i}
                variants={pathVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            ))}
          </motion.svg>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Hero() {
  const shouldReduce = useReducedMotion();

  return (
    <section
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

      {/* Cycling clothing silhouette — centred, behind all text */}
      {!shouldReduce && <ClothingCycle />}

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
          Be <span className="text-nature-brown">Yourself.</span>
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

      {/* Bottom row — stacked on mobile (subtitle above button), side-by-side on desktop */}
      <div className="absolute bottom-10 left-0 right-0 px-8 md:px-12 z-20">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <motion.p
            className="font-body font-light text-almond-cream/45 text-sm leading-relaxed max-w-[240px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            A luxury Nigerian fashion brand
            <br />
            crafted for those who define themselves.
          </motion.p>

          <motion.div
            className="self-start md:self-auto"
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
        </div>
      </div>
    </section>
  );
}
