'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';

// All silhouettes share a 0 0 100 130 viewBox; cap uses 0 0 130 90
const CLOTHES = [
  {
    id: 'shirt',
    label: 'Short-sleeve Shirt',
    viewBox: '0 0 100 130',
    paths: [
      // neckline (V-curve), right shoulder → sleeve → body, left mirror
      'M 38,14 C 40,7 60,7 62,14 L 75,17 L 94,33 L 87,46 L 78,39 L 78,112 L 22,112 L 22,39 L 13,46 L 6,33 L 25,17 Z',
    ],
  },
  {
    id: 'trousers',
    label: 'Trousers',
    viewBox: '0 0 80 145',
    paths: [
      // waistband → seat curves → two legs → crotch point
      'M 14,6 L 66,6 Q 70,32 65,56 L 60,138 L 46,138 L 43,70 Q 42,67 40,66 Q 38,67 37,70 L 34,138 L 20,138 L 15,56 Q 10,32 14,12 Z',
    ],
  },
  {
    id: 'tshirt',
    label: 'Roundneck',
    viewBox: '0 0 100 130',
    paths: [
      // round neck, wider short sleeves
      'M 40,13 Q 50,5 60,13 L 74,17 L 89,30 L 82,44 L 74,38 L 74,112 L 26,112 L 26,38 L 18,44 L 11,30 L 26,17 Z',
    ],
  },
  {
    id: 'cap',
    label: 'Cap',
    viewBox: '0 0 130 90',
    paths: [
      // crown dome + band
      'M 12,64 Q 10,20 58,12 Q 106,20 104,64 L 104,72 Q 58,70 12,72 Z',
      // brim
      'M 12,72 Q 58,69 110,76 Q 110,86 100,82 L 104,72',
    ],
  },
  {
    id: 'jacket',
    label: 'Jacket',
    viewBox: '0 0 100 132',
    paths: [
      // lapels (V opens to chest), longer body than shirt
      'M 40,10 Q 44,19 50,28 Q 56,19 60,10 L 76,14 L 95,28 L 88,42 L 78,36 L 78,122 L 22,122 L 22,36 L 12,42 L 5,28 L 24,14 Z',
    ],
  },
  {
    id: 'native',
    label: 'Native Top',
    viewBox: '0 0 120 130',
    paths: [
      // agbada-style: very wide sleeves, flowing body
      'M 60,8 L 44,12 L 4,22 L 4,56 L 30,48 L 30,120 L 90,120 L 90,48 L 116,56 L 116,22 L 76,12 Z',
      // front centre slit
      'M 60,10 L 60,74',
    ],
  },
];

const INTERVAL = 4400;

function ClothingCycle() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % CLOTHES.length), INTERVAL);
    return () => clearInterval(id);
  }, []);

  const item = CLOTHES[idx];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
      <div
        className="w-[170px] md:w-[200px]"
        style={{ height: 'clamp(200px, 26vh, 300px)' }}
      >
        <AnimatePresence mode="wait">
          <motion.svg
            key={item.id}
            viewBox={item.viewBox}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
          >
            {item.paths.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="#CE8400"
                strokeWidth="0.9"
                strokeDasharray="3 5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: 'easeInOut', delay: i * 0.5 }}
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
