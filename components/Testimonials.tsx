'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const QUOTES = [
  {
    name: 'Amara Okafor',
    location: 'Lagos, Nigeria',
    quote: 'I wore the Ochre Linen Top to my presentation and walked in feeling like myself for the first time in years. Ciallade doesn\'t just dress you — it declares you.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'Kwame Asante',
    location: 'Accra, Ghana',
    quote: 'The craftsmanship on the Dark Wood Jacket is unlike anything I\'ve found locally or internationally. Structured, warm, and entirely mine.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'Zara Bello',
    location: 'Abuja, Nigeria',
    quote: 'Every piece feels like it was made for the version of me I\'m always becoming. The BYRA Cap is my identity on display.',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&h=200&q=80',
  },
  {
    name: 'David Mensah',
    location: 'London, UK',
    quote: 'I visited Lagos and discovered Ciallade. Brought the Statement Coat back to London and nothing has started more conversations.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
  },
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % QUOTES.length), 5000);
    return () => clearInterval(id);
  }, []);

  const active = QUOTES[activeIdx];

  return (
    <section className="relative bg-dark-wood py-40 overflow-hidden">
      <div className="relative z-10 px-6 md:px-12">
        <p className="label-text text-xs text-nature-brown mb-4">Worn &amp; Witnessed</p>
        <h2 className="font-display text-almond-cream text-4xl md:text-5xl mb-20 leading-tight">
          What our customers say
        </h2>

        {/* Main testimonial card — no border, max-w constrained */}
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Customer image */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden mb-6">
                <Image src={active.avatar} alt={active.name} fill className="object-cover" sizes="80px" />
              </div>

              {/* Horizontal divider */}
              <div className="w-full h-px bg-nature-brown/20 mb-8" />

              {/* Quote text — large, no border */}
              <blockquote className="font-body font-light text-almond-cream/80 leading-relaxed mb-8"
                style={{ fontSize: 'clamp(18px, 2vw, 26px)' }}>
                &ldquo;{active.quote}&rdquo;
              </blockquote>

              <p className="font-display text-almond-cream text-xl mb-1">{active.name}</p>
              <p className="label-text text-[10px] text-nature-brown/60">{active.location}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Small thumbnail cards below — horizontal row */}
        <div className="flex gap-4 mt-16 flex-wrap">
          {QUOTES.map((q, i) => (
            <button
              key={q.name}
              onClick={() => setActiveIdx(i)}
              aria-label={`View testimony from ${q.name}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className="relative w-12 h-12 rounded-full overflow-hidden transition-all duration-300"
                style={{
                  outline: i === activeIdx ? '2px solid #CE8400' : '2px solid rgba(206,132,0,0.2)',
                  outlineOffset: '3px',
                  opacity: i === activeIdx ? 1 : 0.5,
                }}
              >
                <Image src={q.avatar} alt={q.name} fill className="object-cover" sizes="48px" />
              </div>
              <p className="label-text text-[9px] text-almond-cream/40 group-hover:text-nature-brown transition-colors duration-200 whitespace-nowrap">
                {q.name.split(' ')[0]}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
