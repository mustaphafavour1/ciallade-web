'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, slideInLeft, slideInRight, reducedVariant } from '@/lib/animations';
import BYRAPattern from './BYRAPattern';

const AUDIENCE = [
  {
    label: 'The Self-Defined',
    body: '25–45 year-olds who know who they are and want clothes that agree.',
  },
  {
    label: 'The Culturally Rooted',
    body: 'Those who carry Africa with them and want luxury that does the same.',
  },
  {
    label: 'The Intentional Dresser',
    body: 'People who choose, never follow. Every piece purchased is a declaration.',
  },
];

export default function TheFocus() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();
  const container = shouldReduce ? {} : staggerContainer;
  const item = shouldReduce ? reducedVariant : fadeUp;
  const left = shouldReduce ? reducedVariant : slideInLeft;
  const right = shouldReduce ? reducedVariant : slideInRight;

  return (
    <section ref={ref} className="relative bg-almond-cream overflow-hidden">
      <BYRAPattern color="#1C1004" opacity={0.03} animated={false} />

      <div className="relative z-10">
        {/* Top label */}
        <div className="px-6 md:px-12 pt-24 pb-12">
          <motion.p
            variants={item}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="label-text text-xs text-coffee-brown mb-4"
          >
            Who We&apos;re For
          </motion.p>
          <motion.h2
            variants={item}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.08 }}
            className="font-display text-dark-wood text-4xl md:text-5xl leading-tight"
          >
            The Focus
          </motion.h2>
        </div>

        {/* Audience cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-24"
        >
          {AUDIENCE.map((a, i) => (
            <motion.div
              key={a.label}
              variants={item}
              transition={{ delay: i * 0.1 }}
              className="border border-dark-wood/10 p-8 hover:border-coffee-brown/40 transition-colors duration-400"
            >
              <div className="w-6 h-px bg-nature-brown mb-5" />
              <h3 className="font-display text-dark-wood text-2xl mb-3 leading-tight">{a.label}</h3>
              <p className="font-body font-light text-dark-wood/60 text-sm leading-relaxed">{a.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 10-Year Vision — full bleed dark block */}
        <div className="relative bg-dark-wood py-24 px-6 md:px-12 overflow-hidden">
          <BYRAPattern animated={false} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={left}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.3 }}
            >
              <p className="label-text text-xs text-nature-brown mb-6">10-Year Vision · 2035</p>
              <blockquote
                className="font-display text-almond-cream leading-[0.9]"
                style={{ fontSize: 'clamp(32px, 4.5vw, 64px)' }}
              >
                The definitive
                <br />
                African luxury{' '}
                <span className="text-nature-brown">house.</span>
              </blockquote>
            </motion.div>

            <motion.div
              variants={right}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.45 }}
              className="space-y-6"
            >
              <p className="font-body font-light text-almond-cream/65 text-base leading-relaxed">
                By 2035, Ciallade will be recognized globally as the definitive African luxury fashion
                house — not a brand that competes with European houses, but one that has built its own
                category entirely.
              </p>
              <p className="font-body font-light text-almond-cream/65 text-base leading-relaxed">
                Rooted in Nigeria. Worn across continents. Belonging to no trend, no season, no movement
                but its own.
              </p>
              <motion.div
                variants={container}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="grid grid-cols-3 gap-6 pt-4"
              >
                {[
                  { stat: '3', label: 'Flagship Cities' },
                  { stat: '10+', label: 'Annual Drops' },
                  { stat: '50+', label: 'Countries Reached' },
                ].map((s) => (
                  <motion.div key={s.label} variants={item}>
                    <p className="font-display text-nature-brown text-4xl leading-none mb-1">{s.stat}</p>
                    <p className="label-text text-[10px] text-almond-cream/40">{s.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
