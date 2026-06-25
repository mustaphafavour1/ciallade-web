'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { SanityCollection } from '@/sanity/lib/fetch';

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

// Desktop scatter positions:
// 0 = Ready-to-Wear  → upper-left
// 1 = Headwear       → upper-right
// 2 = Statement Pieces → center (translateX(-50%) applied inline)
// 3 = Bottoms        → lower-left
// 4 = Jackets        → lower-right
const SCATTER: { top: string; left: string; transform?: string }[] = [
  { top: '12%', left: '8%' },
  { top: '10%', left: '58%' },
  { top: '42%', left: '32%', transform: 'translateX(-50%)' },
  { top: '70%', left: '5%' },
  { top: '68%', left: '58%' },
];

const CYCLE_MS = 3000;

export default function CollectionsGrid({ collections }: { collections?: SanityCollection[] | null }) {
  const cats = collections?.length
    ? collections.map((c) => ({ label: c.label, slug: c.slug, image: c.imageUrl }))
    : categories;

  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const displayIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  useEffect(() => {
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % cats.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, [cats.length]);

  return (
    <section className="bg-dark-wood py-40 px-6 md:px-12 relative min-h-[70vh]">
      {/* Header */}
      <div className="mb-12 relative z-10">
        <p className="label-text text-xs text-nature-brown mb-3">Explore</p>
        <h2 className="font-display text-almond-cream text-4xl md:text-5xl leading-tight">
          Collections
        </h2>
      </div>

      {/* ── Mobile: simple vertical list ── */}
      <div className="flex flex-col gap-6 md:hidden">
        {cats.map((cat, i) => {
          const isActive = i === displayIdx;
          return (
            <Link key={cat.slug} href={`/collections?category=${cat.slug}`}>
              <div
                className="flex items-center gap-4 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <motion.div
                  animate={{
                    width: isActive ? 310 : 28,
                    height: isActive ? 450 : 28,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden flex-none"
                  style={{ borderRadius: 2 }}
                >
                  <Image
                    src={cat.image}
                    fill
                    className="object-cover"
                    alt={cat.label}
                    sizes="310px"
                  />
                </motion.div>
                <motion.p
                  animate={{ color: isActive ? '#CE8400' : 'rgba(255,235,205,0.7)' }}
                  className="font-display text-3xl md:text-4xl"
                >
                  {cat.label}
                </motion.p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Desktop: scattered absolute layout ── */}
      <div className="hidden md:block relative" style={{ minHeight: '85vh' }}>
        {cats.map((cat, i) => {
          const isActive = i === displayIdx;
          const pos = SCATTER[i];
          return (
            <div
              key={cat.slug}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                transform: pos.transform,
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <Link href={`/collections?category=${cat.slug}`}>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <motion.div
                    animate={{
                      width: isActive ? 310 : 28,
                      height: isActive ? 450 : 28,
                    }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden flex-none"
                    style={{ borderRadius: 2 }}
                  >
                    <Image
                      src={cat.image}
                      fill
                      className="object-cover"
                      alt={cat.label}
                      sizes="(min-width: 768px) 310px, 28px"
                    />
                  </motion.div>
                  <motion.p
                    animate={{ color: isActive ? '#CE8400' : 'rgba(255,235,205,0.7)' }}
                    className="font-display text-3xl md:text-4xl whitespace-nowrap"
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
