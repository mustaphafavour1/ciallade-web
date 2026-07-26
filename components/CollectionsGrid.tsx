'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionHeading, { toLines } from '@/components/SectionHeading';
import type { SanityCollection, SanityHeading } from '@/sanity/lib/fetch';

const UNS = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const categories = [
  {
    label: 'Ready-to-Wear',
    slug: 'tops',
    image: UNS('photo-1529139574466-a303027c1d8b', 800, 1100),
  },
  {
    label: 'Headwear',
    slug: 'headwear',
    image: UNS('photo-1576871337622-98d48d1cf531', 800, 1100),
  },
  {
    label: 'Statement Pieces',
    slug: 'statement-pieces',
    image: UNS('photo-1539109136881-3be0616acf4b', 800, 1100),
  },
  {
    label: 'Bottoms',
    slug: 'bottoms',
    image: UNS('photo-1509631179647-0177331693ae', 800, 1100),
  },
  {
    label: 'Jackets',
    slug: 'jackets',
    image: UNS('photo-1591047139829-d91aecb6caea', 800, 1100),
  },
];

const CYCLE_MS = 3000;
const EASE = 'cubic-bezier(0.22,1,0.36,1)';

type Category = { label: string; slug: string; image: string };

export default function CollectionsGrid({
  collections,
  heading,
}: {
  collections?: SanityCollection[] | null;
  heading?: SanityHeading | null;
}) {
  // CMS collections → the shape the lookbook renders. A collection without an
  // uploaded image borrows one of the built-in samples so no tile renders blank.
  const cats: Category[] = collections?.length
    ? collections.map((c, i) => ({
        label: c.label,
        slug: c.slug,
        image: c.imageUrl || categories[i % categories.length].image,
      }))
    : categories;

  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const displayIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % cats.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, [cats.length, reduce]);

  return (
    <section className="bg-almond-cream wash-light text-dark-wood py-32 md:py-44 px-6 md:px-12">
      {/* Header — routed through SectionHeading (dark ink, gold accent) */}
      <div className="mb-12 md:mb-16">
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'Explore'}
          lines={toLines(heading?.title, heading?.titleAccent, '', 'Collections')}
          className="text-dark-wood text-5xl md:text-6xl"
          align="left"
          as="h2"
        />
      </div>

      {/* ── Desktop: expanding-column lookbook (width flex-grows) ── */}
      <div className="hidden md:flex gap-2 h-[68vh]">
        {cats.map((cat, i) => {
          const isActive = i === displayIdx;
          return (
            <Link
              key={cat.slug}
              href={`/collections?category=${cat.slug}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(i)}
              onBlur={() => setHoveredIdx(null)}
              aria-label={`View ${cat.label} collection`}
              className="group relative overflow-hidden rounded-[2px] min-w-0"
              style={{
                flexGrow: isActive ? 3 : 1,
                flexBasis: 0,
                transition: `flex-grow ${reduce ? '0s' : '0.7s'} ${EASE}`,
              }}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
              {/* dark scrim anchored at the bottom for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-wood/85 via-dark-wood/15 to-transparent" />

              {/* Collapsed state — vertical rotated label only */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: isActive ? 0 : 1, transition: `opacity ${reduce ? '0s' : '0.3s'} ease` }}
              >
                <span
                  className="font-display text-almond-cream text-lg tracking-wide whitespace-nowrap"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {cat.label}
                </span>
              </div>

              {/* Expanded state — large label + View Collection link */}
              <div
                className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start gap-3"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive || reduce ? 'translateY(0)' : 'translateY(16px)',
                  pointerEvents: isActive ? 'auto' : 'none',
                  transition: reduce ? 'none' : `opacity 0.5s ${EASE}, transform 0.5s ${EASE}`,
                }}
              >
                <h3 className="font-display text-almond-cream text-4xl lg:text-5xl leading-none">
                  {cat.label}
                </h3>
                <span className="inline-flex items-center gap-2 label-text text-[11px] text-nature-brown">
                  View Collection
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Mobile: expanding horizontal rows (height grows) ── */}
      <div className="flex flex-col gap-2 md:hidden">
        {cats.map((cat, i) => {
          const isActive = i === displayIdx;
          return (
            <Link
              key={cat.slug}
              href={`/collections?category=${cat.slug}`}
              aria-label={`View ${cat.label} collection`}
              className="group relative overflow-hidden rounded-[2px] w-full"
              style={{
                height: isActive ? '42vh' : '13vh',
                transition: `height ${reduce ? '0s' : '0.7s'} ${EASE}`,
              }}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-wood/85 via-dark-wood/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between gap-4">
                <h3 className="font-display text-almond-cream text-3xl leading-none">
                  {cat.label}
                </h3>
                <span
                  className="inline-flex items-center gap-2 label-text text-[11px] text-nature-brown flex-none"
                  style={{ opacity: isActive ? 1 : 0, transition: `opacity ${reduce ? '0s' : '0.5s'} ease` }}
                >
                  View
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
