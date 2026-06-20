'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { featuredProducts, formatPrice } from '@/data/products';

const CYCLE_MS = 4500;

export default function FeaturedStrip() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActiveIdx((i) => (i + 1) % featuredProducts.length),
      CYCLE_MS
    );
    return () => clearInterval(id);
  }, []);

  const active = featuredProducts[activeIdx];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '90vh',
        background: `
          radial-gradient(ellipse at 30% 80%, rgba(117,73,43,0.12) 0%, transparent 50%),
          linear-gradient(160deg, #0c0700 0%, #1C1004 45%, #0a0602 100%)
        `,
      }}
    >
      {/* ── Mobile layout: stack vertically ── */}
      <div className="flex flex-col md:hidden min-h-[90vh]">
        {/* Details top */}
        <div className="px-6 pt-16 pb-8 flex-none">
          <p className="label-text text-[10px] text-nature-brown tracking-widest mb-3">
            Featured Pieces
          </p>
          <h2 className="font-display text-almond-cream text-4xl leading-tight mb-8">
            The Edit
          </h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-almond-cream text-2xl mb-1">{active.name}</p>
              <p className="label-text text-xs text-nature-brown mb-4">
                {formatPrice(active.price)}
              </p>
              <p className="font-body font-light text-almond-cream/55 text-sm leading-relaxed mb-6 max-w-xs">
                {active.description}
              </p>
              <Link
                href={`/products/${active.slug}`}
                className="inline-block label-text text-[10px] text-nature-brown border border-nature-brown px-6 py-3 hover:bg-nature-brown hover:text-dark-wood transition-all duration-300"
              >
                Shop Now
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Large circular image */}
        <div className="relative flex-1 min-h-[55vw] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${activeIdx}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Image
                src={active.images[0]}
                alt={active.name}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Selector dots */}
        <div className="flex gap-3 justify-center py-5 flex-none">
          {featuredProducts.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              aria-label={`Select product ${i + 1}`}
              className="relative w-10 h-10 rounded-full overflow-hidden flex-none"
              style={{
                outline: i === activeIdx ? '2px solid #CE8400' : '2px solid transparent',
                outlineOffset: '2px',
              }}
            >
              <Image
                src={featuredProducts[i].images[0]}
                alt={featuredProducts[i].name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop layout: left/right split ── */}
      <div className="hidden md:flex min-h-[90vh] relative">
        {/* Left panel — ~45% width */}
        <div
          className="relative z-10 flex flex-col justify-center px-12 lg:px-16 py-20"
          style={{ width: '45%', flexShrink: 0 }}
        >
          <p className="label-text text-[10px] text-nature-brown tracking-widest mb-3">
            Featured Pieces
          </p>
          <h2 className="font-display text-almond-cream leading-tight mb-10"
            style={{ fontSize: 'clamp(40px, 4.5vw, 72px)' }}>
            The Edit
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-display text-almond-cream leading-tight mb-2"
                style={{ fontSize: 'clamp(22px, 2.2vw, 36px)' }}>
                {active.name}
              </p>
              <p className="label-text text-sm text-nature-brown mb-5">
                {formatPrice(active.price)}
              </p>
              <p className="font-body font-light text-almond-cream/55 text-base leading-relaxed mb-8 max-w-sm">
                {active.description}
              </p>
              <Link
                href={`/products/${active.slug}`}
                className="inline-block label-text text-[10px] text-nature-brown border border-nature-brown px-8 py-4 hover:bg-nature-brown hover:text-dark-wood transition-all duration-300"
              >
                Shop Now
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Small selector — circular thumbnails stacked */}
          <div className="absolute bottom-12 left-12 lg:left-16 flex gap-3 items-center">
            {featuredProducts.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                aria-label={`View ${p.name}`}
                className="relative rounded-full overflow-hidden flex-none transition-all duration-300"
                style={{
                  width: i === activeIdx ? 52 : 40,
                  height: i === activeIdx ? 52 : 40,
                  outline: i === activeIdx ? '2px solid #CE8400' : '2px solid rgba(206,132,0,0.25)',
                  outlineOffset: '2px',
                }}
              >
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="52px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right panel — large circular image clipped at right edge */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center"
          style={{ width: '62%', pointerEvents: 'none' }}
        >
          {/* Circle container: circle diameter = 80vh, offset right so half is off-screen */}
          <div
            className="relative flex-none"
            style={{
              width: '80vh',
              height: '80vh',
              borderRadius: '50%',
              overflow: 'hidden',
              marginLeft: 'auto',
              transform: 'translateX(40vh)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`circle-${activeIdx}`}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={active.images[0]}
                  alt={active.name}
                  fill
                  className="object-cover object-center"
                  sizes="80vh"
                  priority
                />
                {/* Subtle left-edge gradient so image fades into dark bg */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(12,7,0,0.55) 0%, transparent 28%)',
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
