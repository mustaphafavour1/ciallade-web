'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { featuredProducts, formatPrice } from '@/data/products';

const CYCLE_MS = 4500;

// -90 so that angle 0° starts at the top of the circle
function wedgePath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number
): string {
  const s = ((startDeg - 90) * Math.PI) / 180;
  const e = ((endDeg - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy + r * Math.sin(e);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`;
}

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
      className="relative overflow-hidden bg-dark-wood"
      style={{ minHeight: '90vh' }}
    >
      {/* ── Mobile layout: stack vertically ── */}
      <div className="flex flex-col md:hidden min-h-[90vh]">
        {/* Details */}
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

        {/* Full-width pie chart on mobile */}
        <div className="flex justify-center py-6 flex-none">
          <svg
            viewBox="0 0 600 600"
            style={{ width: '80vw', height: '80vw', maxWidth: '360px', maxHeight: '360px' }}
            aria-hidden="true"
          >
            <defs>
              {featuredProducts.map((_, i) => (
                <clipPath key={i} id={`mobile-clip-${i}`}>
                  <path d={wedgePath(300, 300, 290, i * 60, (i + 1) * 60)} />
                </clipPath>
              ))}
            </defs>
            {featuredProducts.map((product, i) => {
              const isActive = i === activeIdx;
              return (
                <g key={product.id} onClick={() => setActiveIdx(i)} style={{ cursor: 'pointer' }}>
                  <image
                    href={product.images[0]}
                    x="10"
                    y="10"
                    width="580"
                    height="580"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#mobile-clip-${i})`}
                    style={{ opacity: isActive ? 1 : 0.45, transition: 'opacity 0.4s' }}
                  />
                  <path
                    d={wedgePath(300, 300, 290, i * 60, (i + 1) * 60)}
                    fill="none"
                    stroke="#0a0600"
                    strokeWidth="3"
                  />
                  {isActive && (
                    <path
                      d={wedgePath(300, 300, 290, i * 60, (i + 1) * 60)}
                      fill="none"
                      stroke="#CE8400"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Mobile thumbnail row */}
        <div className="flex gap-3 justify-center py-4 flex-none">
          {featuredProducts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveIdx(i)}
              aria-label={`View ${p.name}`}
              className="relative rounded-full overflow-hidden flex-none transition-all duration-300"
              style={{
                width: i === activeIdx ? 44 : 34,
                height: i === activeIdx ? 44 : 34,
                outline: i === activeIdx ? '2px solid #CE8400' : '2px solid rgba(206,132,0,0.25)',
                outlineOffset: '2px',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.images[0]}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Desktop layout: left / right split ── */}
      <div className="hidden md:flex min-h-[90vh] relative">
        {/* Left panel — ~45% width */}
        <div
          className="relative z-10 flex flex-col justify-center px-12 lg:px-16 py-20"
          style={{ width: '45%', flexShrink: 0 }}
        >
          <p className="label-text text-[10px] text-nature-brown tracking-widest mb-3">
            Featured Pieces
          </p>
          <h2
            className="font-display text-almond-cream leading-tight mb-10"
            style={{ fontSize: 'clamp(40px, 4.5vw, 72px)' }}
          >
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
              <p
                className="font-display text-almond-cream leading-tight mb-2"
                style={{ fontSize: 'clamp(22px, 2.2vw, 36px)' }}
              >
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

          {/* Small selector pie */}
          <div className="mt-10">
            <svg
              viewBox="0 0 200 200"
              style={{ width: '160px', height: '160px', cursor: 'pointer' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
                if (angle < 0) angle += 360;
                const idx = Math.floor(angle / 60) % 6;
                setActiveIdx(idx);
              }}
              aria-label="Select a featured product"
              role="img"
            >
              <defs>
                {featuredProducts.map((_, i) => (
                  <clipPath key={i} id={`small-clip-${i}`}>
                    <path d={wedgePath(100, 100, 85, i * 60, (i + 1) * 60)} />
                  </clipPath>
                ))}
              </defs>
              {featuredProducts.map((product, i) => (
                <g key={product.id}>
                  <image
                    href={product.images[0]}
                    x="15"
                    y="15"
                    width="170"
                    height="170"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#small-clip-${i})`}
                    style={{ opacity: i === activeIdx ? 1 : 0.55 }}
                  />
                  <path
                    d={wedgePath(100, 100, 85, i * 60, (i + 1) * 60)}
                    fill="none"
                    stroke={i === activeIdx ? '#CE8400' : '#0a0600'}
                    strokeWidth={i === activeIdx ? 2.5 : 2}
                  />
                </g>
              ))}
            </svg>
            <p className="label-text text-[9px] text-almond-cream/30 mt-2">Click to explore</p>
          </div>
        </div>

        {/* Right panel — large pie chart, left half visible */}
        <div
          className="absolute top-0 bottom-0 right-0 flex items-center"
          style={{ width: '60%', overflow: 'hidden' }}
        >
          <svg
            viewBox="0 0 600 600"
            style={{ height: '88vh', width: 'auto', flexShrink: 0, marginLeft: '-12%' }}
            aria-hidden="true"
          >
            <defs>
              {featuredProducts.map((_, i) => (
                <clipPath key={i} id={`large-clip-${i}`}>
                  <path d={wedgePath(300, 300, 290, i * 60, (i + 1) * 60)} />
                </clipPath>
              ))}
            </defs>
            {featuredProducts.map((product, i) => {
              const isActive = i === activeIdx;
              return (
                <g key={product.id}>
                  <image
                    href={product.images[0]}
                    x="10"
                    y="10"
                    width="580"
                    height="580"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath={`url(#large-clip-${i})`}
                    style={{ opacity: isActive ? 1 : 0.5, transition: 'opacity 0.4s' }}
                  />
                  {/* Thin dark separator on each wedge edge */}
                  <path
                    d={wedgePath(300, 300, 290, i * 60, (i + 1) * 60)}
                    fill="none"
                    stroke="#0a0600"
                    strokeWidth="3"
                  />
                  {/* Gold highlight on active wedge */}
                  {isActive && (
                    <path
                      d={wedgePath(300, 300, 290, i * 60, (i + 1) * 60)}
                      fill="none"
                      stroke="#CE8400"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </section>
  );
}
