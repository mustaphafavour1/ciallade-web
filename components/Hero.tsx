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
      // Path 1: Full outer silhouette — shoulder slope, V-collar, short sleeves, body
      'M 38,15 C 39,9 42,7 50,7 C 58,7 61,9 62,15 L 70,18 C 74,19 80,22 86,28 L 92,35 L 86,46 L 78,41 L 78,112 L 22,112 L 22,41 L 14,46 L 8,35 L 14,28 C 20,22 26,19 30,18 Z',
      // Path 2: Collar — two triangular pointed collar leaves in V opening
      'M 38,15 C 40,20 44,25 50,30 C 56,25 60,20 62,15 M 46,15 C 47,22 48,26 50,30 M 54,15 C 53,22 52,26 50,30',
      // Path 3: Button placket center line + buttons
      'M 50,30 L 50,110 M 48,42 L 52,42 M 48,55 L 52,55 M 48,68 L 52,68 M 48,81 L 52,81',
      // Path 4: Breast pocket (left chest)
      'M 27,46 L 44,46 L 44,58 L 27,58 L 27,46 M 27,46 L 44,46',
    ],
  },
  {
    id: 'longsleeve',
    label: 'Long-sleeve Shirt',
    viewBox: '0 0 100 130',
    paths: [
      // Path 1: Full silhouette — long sleeves tapering to narrow wrist
      'M 38,15 C 39,9 42,7 50,7 C 58,7 61,9 62,15 L 70,18 C 74,19 80,22 88,32 L 96,70 L 96,78 L 84,78 L 82,68 C 80,58 79,50 78,41 L 78,112 L 22,112 L 22,41 C 21,50 20,58 18,68 L 16,78 L 4,78 L 4,70 L 12,32 C 20,22 26,19 30,18 Z',
      // Path 2: Collar — pointed collar in V
      'M 38,15 C 40,20 44,25 50,30 C 56,25 60,20 62,15 M 46,15 C 47,22 48,26 50,30 M 54,15 C 53,22 52,26 50,30',
      // Path 3: Button placket + buttons
      'M 50,30 L 50,110 M 48,42 L 52,42 M 48,55 L 52,55 M 48,68 L 52,68 M 48,81 L 52,81',
      // Path 4: Cuff bands at each wrist (double horizontal lines)
      'M 4,70 L 16,70 M 4,74 L 16,74 M 84,70 L 96,70 M 84,74 L 96,74',
    ],
  },
  {
    id: 'trousers',
    label: 'Trousers',
    viewBox: '0 0 80 150',
    paths: [
      // Path 1: Full silhouette — high waist, two legs with hip curve, straight/tapered
      'M 12,22 Q 14,10 16,8 L 64,8 Q 66,10 68,22 Q 72,40 66,60 L 60,142 L 44,142 L 40,80 Q 40,72 40,70 Q 40,72 40,80 L 36,142 L 20,142 L 14,60 Q 8,40 12,22 Z',
      // Path 2: Waistband — double horizontal lines
      'M 12,22 L 68,22 M 12,14 L 68,14',
      // Path 3: Belt loops (5 small rectangles on waistband)
      'M 17,8 L 17,22 M 28,8 L 28,22 M 40,8 L 40,22 M 52,8 L 52,22 M 63,8 L 63,22',
      // Path 4: Crease lines + diagonal slash pockets at hip
      'M 32,22 C 35,50 37,90 38,142 M 48,22 C 45,50 43,90 42,142 M 20,25 L 32,40 M 60,25 L 48,40',
    ],
  },
  {
    id: 'tshirt',
    label: 'Roundneck',
    viewBox: '0 0 100 120',
    paths: [
      // Path 1: Full silhouette — round neck, short set-in sleeves, clean body
      'M 42,14 Q 50,7 58,14 L 68,17 Q 76,20 84,28 L 90,37 L 82,46 L 74,40 L 74,112 L 26,112 L 26,40 L 18,46 L 10,37 L 16,28 Q 24,20 32,17 Z',
      // Path 2: Neckband — two concentric curves for the crew neck rib
      'M 42,14 Q 50,22 58,14 M 43,18 Q 50,26 57,18',
      // Path 3: Sleeve hem lines at armhole seam
      'M 26,40 Q 22,38 18,40 M 74,40 Q 78,38 82,40',
      // Path 4: Subtle side seams and hem
      'M 26,40 L 26,112 M 74,40 L 74,112 M 26,112 L 74,112',
    ],
  },
  {
    id: 'jacket',
    label: 'Jacket',
    viewBox: '0 0 100 135',
    paths: [
      // Path 1: Full blazer silhouette — padded shoulders, long sleeves, open front with lapels
      'M 38,12 Q 40,7 50,7 Q 60,7 62,12 L 74,15 Q 82,18 90,26 L 96,50 L 96,62 L 84,60 L 82,120 L 18,120 L 16,60 L 4,62 L 4,50 L 10,26 Q 18,18 26,15 Z',
      // Path 2: Lapels — triangular flaps from shoulder down to chest on each side
      'M 38,12 L 44,32 Q 46,40 50,46 Q 54,40 56,32 L 62,12 M 38,12 L 36,28 Q 34,36 36,46 L 50,46 M 62,12 L 64,28 Q 66,36 64,46 L 50,46',
      // Path 3: Two front buttons on placket
      'M 48,58 L 52,58 M 48,72 L 52,72',
      // Path 4: Two welt pocket flaps (one each side, lower front)
      'M 14,88 L 40,88 L 40,96 L 14,96 M 60,88 L 86,88 L 86,96 L 60,96',
    ],
  },
  {
    id: 'native',
    label: 'Native Top',
    viewBox: '0 0 130 130',
    paths: [
      // Path 1: Agbada — very wide flowing sleeves, wide hem, center slit
      'M 65,10 L 52,12 L 4,20 L 4,52 L 32,44 L 32,118 L 98,118 L 98,44 L 126,52 L 126,20 L 78,12 Z',
      // Path 2: Center front opening/slit from neckline to hem
      'M 65,14 L 65,118',
      // Path 3: Decorative geometric embroidery at neckline — diamond/star pattern
      'M 65,14 L 72,22 L 65,30 L 58,22 Z M 65,14 L 65,10 M 65,30 L 65,34 M 58,22 L 54,22 M 72,22 L 76,22',
      // Path 4: Sleeve border/trim lines parallel to edges + hem trim
      'M 4,44 L 32,38 M 126,44 L 98,38 M 32,112 L 98,112 M 8,26 L 32,20 M 122,26 L 98,20',
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
                strokeWidth="0.22"
                strokeDasharray="2 5"
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
          style={{ fontSize: 'clamp(39px, 4.8vw, 75px)' }}
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
            className="font-body font-light text-almond-cream/45 text-base leading-relaxed max-w-[240px]"
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
