'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, reducedVariant } from '@/lib/animations';

const QUOTES = [
  {
    name: 'Amara Okafor',
    location: 'Lagos, Nigeria',
    quote:
      'I wore the Ochre Linen Top to my presentation and walked in feeling like myself for the first time in years. Ciallade doesn’t just dress you — it declares you.',
  },
  {
    name: 'Kwame Asante',
    location: 'Accra, Ghana',
    quote:
      'The craftsmanship on the Dark Wood Jacket is unlike anything I’ve found locally or internationally. Structured, warm, and entirely mine.',
  },
  {
    name: 'Zara Bello',
    location: 'Abuja, Nigeria',
    quote:
      'Every piece feels like it was made for the version of me I’m always becoming. The BYRA Cap is my identity on display.',
  },
  {
    name: 'David Mensah',
    location: 'London, UK',
    quote:
      'I visited Lagos and discovered Ciallade. Brought the Statement Coat back to London and nothing has started more conversations.',
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();
  const container = shouldReduce ? {} : staggerContainer;
  const item = shouldReduce ? reducedVariant : fadeUp;

  return (
    <section ref={ref} className="relative bg-dark-wood py-24 overflow-hidden">
      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#CE8400 1px, transparent 1px), linear-gradient(90deg, #CE8400 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 px-6 md:px-12">
        <motion.p
          variants={item}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="label-text text-xs text-nature-brown mb-4"
        >
          Worn &amp; Witnessed
        </motion.p>
        <motion.h2
          variants={item}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.08 }}
          className="font-display text-almond-cream text-4xl md:text-5xl mb-16 leading-tight"
        >
          What our customers say
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {QUOTES.map((q, i) => (
            <motion.div
              key={q.name}
              variants={item}
              transition={{ delay: i * 0.08 }}
              className="relative border border-nature-brown/15 p-7 group hover:border-nature-brown/40 transition-colors duration-500"
            >
              {/* Large open-quote mark */}
              <span
                className="absolute top-4 left-6 font-display text-nature-brown/20 leading-none select-none"
                style={{ fontSize: '72px', lineHeight: 1 }}
              >
                &ldquo;
              </span>

              <p className="relative z-10 font-body font-light text-almond-cream/75 text-sm leading-relaxed mt-8 mb-8">
                {q.quote}
              </p>

              <div className="border-t border-nature-brown/15 pt-4">
                <p className="font-display text-almond-cream text-base leading-tight">{q.name}</p>
                <p className="label-text text-[10px] text-nature-brown/60 mt-1">{q.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
