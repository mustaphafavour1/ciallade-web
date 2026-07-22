'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { staggerContainer, fadeUp, slideInRight, reducedVariant } from '@/lib/animations';
import SectionHeading, { type Segment } from '@/components/SectionHeading';
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

/**
 * The reserved primitive for this section: an odometer count-up on the vision
 * stats. Distinct from JourneySoFar's rolling-digit reel — this is a smooth
 * whole-number tween that parses the leading integer and keeps any suffix ("+").
 */
function CountUpStat({ value }: { value: string }) {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const match = value.match(/^(\d+)(.*)$/);
  const isNumeric = !!match;
  const target = match ? Number.parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';
  const [display, setDisplay] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!isNumeric) return;
    if (reduce) {
      setDisplay(target);
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, target, isNumeric]);

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {isNumeric ? `${display}${suffix}` : value}
    </span>
  );
}

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
  const right = shouldReduce ? reducedVariant : slideInRight;

  // Vision headline routed through SectionHeading; gold accent on the last line.
  const headlineParts = visionHeadline.split('\n');
  const visionLines: Segment[][] = headlineParts.map((line, i) =>
    i === headlineParts.length - 1
      ? [{ text: line + ' ' }, { text: visionAccent, accent: true }]
      : [{ text: line }]
  );

  return (
    <section ref={ref} className="relative bg-almond-cream overflow-hidden">
      <BYRAPattern color="#1C1004" opacity={0.03} animated={false} />

      <div className="relative z-10">
        {/* Section title */}
        <div className="px-6 md:px-12 pt-48 pb-16">
          <SectionHeading
            eyebrow="Who We're For"
            lines={[[{ text: 'The ' }, { text: 'Focus', accent: true }]]}
            className="text-dark-wood text-4xl md:text-5xl"
            align="left"
            as="h2"
          />
        </div>

        {/* Audience cards — dashed divider, elevated spacing/type */}
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-32"
        >
          {audience.map((a, i) => (
            <motion.div
              key={a.label}
              variants={item}
              transition={{ delay: i * 0.1 }}
              style={{ borderTop: '1px dashed rgba(28,16,4,0.28)', paddingTop: '2.25rem' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="label-text text-[11px] text-nature-brown">0{i + 1}</span>
                <span className="flex-1 h-px bg-nature-brown/25" />
              </div>
              <h3 className="font-display text-dark-wood text-3xl md:text-4xl mb-4 leading-[1.05]">{a.label}</h3>
              <p className="font-body font-light text-dark-wood/65 text-base md:text-lg leading-relaxed">{a.body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 10-Year Vision — full-bleed dark block */}
        <div className="relative bg-dark-wood py-32 md:py-44 px-6 md:px-12 overflow-hidden">
          <BYRAPattern animated={false} />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeading
                eyebrow={visionLabel}
                lines={visionLines}
                className="text-almond-cream text-[clamp(42px,5.5vw,80px)]"
                align="left"
                as="h2"
              />
            </div>

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
                    <p className="font-display text-nature-brown text-6xl lg:text-7xl leading-none mb-2">
                      <CountUpStat value={s.stat} />
                    </p>
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
