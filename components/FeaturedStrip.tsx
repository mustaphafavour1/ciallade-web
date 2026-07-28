'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { featuredProducts, formatPrice } from '@/data/products';
import SectionHeading, { toLines } from '@/components/SectionHeading';
import type { SanityHeading, SanityPiece } from '@/sanity/lib/fetch';

const CYCLE_MS = 4500;
// Clip-sweep easing — the ONE animation primitive for this section.
const SWEEP: [number, number, number, number] = [0.76, 0, 0.24, 1];

type NormalizedProduct = { id: string; slug: string; name: string; price: number; images: string[]; description: string };

/** CMS piece → the shape this strip renders. Optional fields get safe defaults. */
function normalizeSanity(p: SanityPiece): NormalizedProduct {
  return {
    id: p._id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    images: p.images?.filter(Boolean) ?? [],
    description: p.description ?? '',
  };
}

/** Vertical (desktop) / horizontal (mobile) numbered index of product names. */
function IndexList({
  items,
  activeIdx,
  onSelect,
  orientation,
}: {
  items: NormalizedProduct[];
  activeIdx: number;
  onSelect: (i: number) => void;
  orientation: 'vertical' | 'horizontal';
}) {
  if (orientation === 'horizontal') {
    return (
      <div className="-mx-6 flex gap-7 overflow-x-auto px-6 pb-1">
        {items.map((p, i) => {
          const active = i === activeIdx;
          return (
            <button
              key={p.id ?? i}
              onClick={() => onSelect(i)}
              aria-current={active}
              className="flex flex-none flex-col items-start gap-2 text-left"
            >
              <span
                className={`label-text text-[10px] tabular-nums transition-colors duration-500 ${
                  active ? 'text-nature-brown' : 'text-almond-cream/30'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`font-display whitespace-nowrap text-lg leading-none transition-colors duration-500 ${
                  active ? 'text-nature-brown' : 'text-almond-cream/40'
                }`}
              >
                {p.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col border-b border-almond-cream/10">
      {items.map((p, i) => {
        const active = i === activeIdx;
        return (
          <button
            key={p.id ?? i}
            onClick={() => onSelect(i)}
            aria-current={active}
            className="group relative flex min-h-[68px] w-full items-center gap-5 border-t border-almond-cream/10 py-4 text-left md:min-h-[80px] md:gap-7"
          >
            {/* Gold marker on the active row (state indicator, not an animated primitive) */}
            <span
              aria-hidden
              className="absolute left-0 top-0 bottom-0 w-[2px] bg-nature-brown transition-opacity duration-500"
              style={{ opacity: active ? 1 : 0 }}
            />
            <span
              className={`label-text text-[11px] tabular-nums transition-colors duration-500 ${
                active ? 'text-nature-brown' : 'text-almond-cream/30'
              }`}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className={`inline-block font-display leading-none transition-all duration-500 ease-out ${
                active
                  ? 'translate-x-2 text-3xl text-nature-brown md:translate-x-3 md:text-4xl'
                  : 'translate-x-0 text-2xl text-almond-cream/40 group-hover:text-almond-cream/70 md:text-3xl'
              }`}
            >
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function FeaturedStrip({
  products,
  heading,
}: {
  products?: SanityPiece[] | null;
  heading?: SanityHeading | null;
}) {
  const items: NormalizedProduct[] = products?.length
    ? products.map(normalizeSanity)
    : featuredProducts.map((p) => ({ id: p.id, slug: p.slug, name: p.name, price: p.price, images: p.images, description: p.description }));

  const reduce = useReducedMotion();
  // [current, previous] — previous stays visible under the wipe so the new image reveals over the old.
  const [[activeIdx, prevIdx], setIdx] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => {
      setIdx(([cur]) => [(cur + 1) % items.length, cur]);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce, paused, items.length]);

  // Clicking overrides the selection and pauses the auto-cycle.
  const handleSelect = (i: number) => {
    setPaused(true);
    setIdx(([cur]) => (i === cur ? [cur, cur] : [i, cur]));
  };

  const active = items[activeIdx];
  const previous = items[prevIdx];

  return (
    <section className="relative overflow-hidden bg-near-black wash-dark px-6 py-32 md:px-12 md:py-44">
      <div className="mx-auto flex max-w-7xl flex-col gap-14 md:flex-row md:items-start md:gap-16 lg:gap-24">
        {/* LEFT — eyebrow + title + vertical numbered index */}
        <div className="md:w-[42%] md:flex-none">
          <SectionHeading
            as="h2"
            align="left"
            eyebrow={heading?.eyebrow ?? 'Featured Pieces'}
            lines={toLines(heading?.title, heading?.titleAccent, 'The', 'Edit')}
            className="text-almond-cream text-[length:clamp(40px,4.5vw,72px)]"
          />
          <div className="mt-10 hidden md:mt-14 md:block">
            <IndexList items={items} activeIdx={activeIdx} onSelect={handleSelect} orientation="vertical" />
          </div>
        </div>

        {/* RIGHT — tall portrait frame + details */}
        <div className="md:w-[58%] md:flex-1">
          <div className="relative h-[62vh] max-h-[680px] w-full overflow-hidden bg-black/30">
            {/* Previous image — revealed underneath the wipe */}
            {previous?.images[0] && (
              <Image
                key={`base-${prevIdx}`}
                src={previous.images[0]}
                alt=""
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            )}
            {/* Current image wipes over the old via a left→right clip-sweep */}
            {active?.images[0] && (
              <motion.div
                key={`top-${activeIdx}`}
                className="absolute inset-0"
                initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                transition={{ duration: 0.7, ease: SWEEP }}
              >
                <Image
                  src={active.images[0]}
                  alt={active.name}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            )}
            {/* Gold hairline riding the sweep edge */}
            {!reduce && (
              <motion.div
                key={`bar-${activeIdx}`}
                aria-hidden
                className="absolute top-0 bottom-0 w-px bg-nature-brown"
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 0.7, ease: SWEEP }}
              />
            )}
          </div>

          {/* Details under the frame — fixed min-height so nothing jumps */}
          <div className="relative mt-8 min-h-[176px] md:min-h-[156px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-display text-2xl text-almond-cream md:text-3xl">{active.name}</h3>
                  <span className="label-text text-sm text-nature-brown">{formatPrice(active.price)}</span>
                </div>
                <p className="mt-4 max-w-md font-body text-sm font-light leading-relaxed text-almond-cream/55 md:text-base">
                  {active.description}
                </p>
                <Link
                  href={`/collections/${active.slug}`}
                  className="label-text mt-6 inline-block border border-nature-brown px-8 py-3.5 text-[10px] text-nature-brown transition-all duration-300 hover:bg-nature-brown hover:text-dark-wood"
                >
                  Shop Now
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile — horizontal numbered index below the frame */}
          <div className="mt-10 md:hidden">
            <IndexList items={items} activeIdx={activeIdx} onSelect={handleSelect} orientation="horizontal" />
          </div>
        </div>
      </div>
    </section>
  );
}
