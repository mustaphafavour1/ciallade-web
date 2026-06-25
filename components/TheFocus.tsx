'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, slideInLeft, slideInRight, reducedVariant } from '@/lib/animations';
import BYRAPattern from './BYRAPattern';
import type { SanityFocus } from '@/sanity/lib/fetch';

const FALLBACK_AUDIENCE = [
  { label: 'The Self-Defined', body: '25–45 year-olds who know who they are and want clothes that agree.' },
  { label: 'The Culturally Rooted', body: 'Those who carry Africa with them and want luxury that does the same.' },
  { label: 'The Intentional Dresser', body: 'People who choose, never follow. Every piece purchased is a declaration.' },
];

const FALLBACK_STATS = [
  { stat: '3', label: 'Flagship Cities' },
  { stat: '10+', label: 'Annual Drops' },
  { stat: '50+', label: 'Countries Reached' },
];

export default function TheFocus({ focus }: { focus?: SanityFocus | null }) {
  const audience = focus?.audience?.length ? focus.audience : FALLBACK_AUDIENCE;
  const stats = focus?.stats?.length ? focus.stats : FALLBACK_STATS;
  const visionLabel = focus?.visionLabel ?? '10-Year Vision · 2035';
  const visionHeadline = focus?.visionHeadline ?? 'The definitive\nAfrican luxury';
  const visionAccent = focus?.visionAccent ?? 'house.';
  const visionBody1 = focus?.visionBody1 ?? 'By 2035, Ciallade will be recognized globally as the definitive African luxury fashion house — not a brand that competes with European houses, but one that has built its own category entirely.';
  const visionBody2 = focus?.visionBody2 ?? 'Rooted in Nigeria. Worn across continents. Belonging to no trend, no season, no movement but its own.';
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
        <div className="px-6 md:px-12 pt-48 pb-16">
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
          className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32"
        >
          {audience.map((a, i) => (
            <motion.div
              key={a.label}
              variants={item}
              transition={{ delay: i * 0.1 }}
              style={{ borderTop: '1px dashed rgba(28,16,4,0.25)', paddingTop: '2rem' }}
            >
              <div className="w-6 h-px bg-nature-brown mb-5" />
              <h3 className="font-display text-dark-wood text-3xl font-bold mb-3 leading-tight">{a.label}</h3>
              <p className="font-body font-light text-dark-wood/60 text-base leading-relaxed">{a.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 10-Year Vision — full bleed dark block */}
        <div className="relative bg-dark-wood py-40 px-6 md:px-12 overflow-hidden">
          <BYRAPattern animated={false} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={left}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.3 }}
            >
              <p className="label-text text-xs text-nature-brown mb-6">{visionLabel}</p>
              <blockquote
                className="font-display text-almond-cream leading-[0.9]"
                style={{ fontSize: 'clamp(42px, 5.5vw, 80px)' }}
              >
                {visionHeadline.split('\n').map((line, i) => (
                  <span key={i}>{line}{i < visionHeadline.split('\n').length - 1 && <br />}</span>
                ))}{' '}
                <span className="text-nature-brown">{visionAccent}</span>
              </blockquote>
            </motion.div>

            <motion.div
              variants={right}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              transition={{ delay: 0.45 }}
              className="space-y-6"
            >
              <p className="font-body font-light text-almond-cream/80 text-lg leading-relaxed">{visionBody1}</p>
              <p className="font-body font-light text-almond-cream/80 text-lg leading-relaxed">{visionBody2}</p>
              <motion.div
                variants={container}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="grid grid-cols-3 gap-6 pt-4"
              >
                {stats.map((s) => (
                  <motion.div key={s.label} variants={item}>
                    <p className="font-display text-nature-brown text-6xl leading-none mb-1">{s.stat}</p>
                    <p className="label-text text-[10px] text-almond-cream/60">{s.label}</p>
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
