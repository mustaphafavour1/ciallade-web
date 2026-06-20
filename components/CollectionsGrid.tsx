'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const UNS = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const categories = [
  {
    label: 'Ready-to-Wear',
    slug: 'tops',
    image: UNS('photo-1529139574466-a303027c1d8b', 600, 800),
  },
  {
    label: 'Headwear',
    slug: 'headwear',
    image: UNS('photo-1576871337622-98d48d1cf531', 600, 600),
  },
  {
    label: 'Statement Pieces',
    slug: 'statement-pieces',
    image: UNS('photo-1539109136881-3be0616acf4b', 600, 800),
  },
  {
    label: 'Bottoms',
    slug: 'bottoms',
    image: UNS('photo-1509631179647-0177331693ae', 600, 800),
  },
  {
    label: 'Jackets',
    slug: 'jackets',
    image: UNS('photo-1591047139829-d91aecb6caea', 600, 800),
  },
];

// Desktop scatter positions (top/left as % of the section container)
const SCATTER: { top: string; left: string }[] = [
  { top: '15%', left: '5%' },
  { top: '30%', left: '45%' },
  { top: '52%', left: '15%' },
  { top: '65%', left: '55%' },
  { top: '78%', left: '8%' },
];

const CYCLE_MS = 3000;

export default function CollectionsGrid() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % categories.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-dark-wood py-24 px-6 md:px-12 relative min-h-[70vh]">
      {/* Header */}
      <div className="mb-12 relative z-10">
        <p className="label-text text-xs text-nature-brown mb-3">Explore</p>
        <h2 className="font-display text-almond-cream text-4xl md:text-5xl leading-tight">
          Collections
        </h2>
      </div>

      {/* ── Mobile: simple vertical list ── */}
      <div className="flex flex-col gap-6 md:hidden">
        {categories.map((cat, i) => {
          const isActive = i === activeIdx;
          return (
            <Link key={cat.slug} href={`/collections?category=${cat.slug}`}>
              <div className="flex items-center gap-4 cursor-pointer">
                <motion.div
                  animate={{
                    width: isActive ? 180 : 28,
                    height: isActive ? 240 : 28,
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden flex-none"
                  style={{ borderRadius: 2 }}
                >
                  <Image
                    src={cat.image}
                    fill
                    className="object-cover"
                    alt={cat.label}
                    sizes="180px"
                  />
                </motion.div>
                <motion.p
                  animate={{ color: isActive ? '#CE8400' : 'rgba(255,235,205,0.7)' }}
                  className="font-display text-2xl"
                >
                  {cat.label}
                </motion.p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Desktop: scattered absolute layout ── */}
      <div className="hidden md:block relative" style={{ minHeight: '70vh' }}>
        {categories.map((cat, i) => {
          const isActive = i === activeIdx;
          const pos = SCATTER[i];
          return (
            <div
              key={cat.slug}
              className="absolute"
              style={{ top: pos.top, left: pos.left }}
            >
              <Link href={`/collections?category=${cat.slug}`}>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <motion.div
                    animate={{
                      width: isActive ? 180 : 28,
                      height: isActive ? 240 : 28,
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden flex-none"
                    style={{ borderRadius: 2 }}
                  >
                    <Image
                      src={cat.image}
                      fill
                      className="object-cover"
                      alt={cat.label}
                      sizes="(min-width: 768px) 180px, 28px"
                    />
                  </motion.div>
                  <motion.p
                    animate={{ color: isActive ? '#CE8400' : 'rgba(255,235,205,0.7)' }}
                    className="font-display text-2xl md:text-3xl whitespace-nowrap"
                  >
                    {cat.label}
                  </motion.p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
