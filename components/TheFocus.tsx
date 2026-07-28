'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useReducedMotion, animate, type Variants } from 'framer-motion';
import Image from 'next/image';
import { staggerContainer, fadeUp, slideInRight, reducedVariant } from '@/lib/animations';
import SectionHeading, { toLines, type Segment } from '@/components/SectionHeading';
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

// Editorial portraits, one per persona (cropped to a 4:5 frame at request time).
const UNS = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=1125&q=80`;
const PORTRAITS = [
  UNS('photo-1506794778202-cad84cf45f1d'),
  UNS('photo-1524504388940-b1c1722653e1'),
  UNS('photo-1517841905240-472988babdf9'),
];

const AUTO_MS = 4800;

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

/**
 * FRESH PRIMITIVE — a "photo-develop" reveal on the persona switcher: the
 * selected portrait resolves from a desaturated, blurred, dimmed frame into a
 * sharp, full-colour one, like a photograph developing. It reads as the person
 * "coming into focus" — a literal match for who Ciallade dresses. No other
 * section on the page uses a filter-develop or an interactive persona index.
 */
const developVariants: Variants = {
  enter: { opacity: 0, scale: 1.06, filter: 'grayscale(1) brightness(0.45) blur(12px)' },
  center: {
    opacity: 1,
    scale: 1,
    filter: 'grayscale(0) brightness(1) blur(0px)',
    transition: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function TheFocus({
  focus,
  visionBgUrl,
}: {
  focus?: SanityFocus | null;
  visionBgUrl?: string;
}) {
  const audience = focus?.audience?.length ? focus.audience : FALLBACK_AUDIENCE;
  const stats = focus?.stats?.length ? focus.stats : FALLBACK_STATS;
  const visionLabel = focus?.visionLabel ?? '10-Year Vision · 2035';
  const visionHeadline = focus?.visionHeadline ?? 'The definitive\nAfrican luxury';
  const visionAccent = focus?.visionAccent ?? 'house.';
  const visionBody1 = focus?.visionBody1 ?? 'By 2035, Ciallade will be recognized globally as the definitive African luxury fashion house — not a brand that competes with European houses, but one that has built its own category entirely.';
  const visionBody2 = focus?.visionBody2 ?? 'Rooted in Nigeria. Worn across continents. Belonging to no trend, no season, no movement but its own.';

  // Section heading, CMS-driven with the original copy as fallback.
  const headingEyebrow = focus?.heading?.eyebrow?.trim() || "Who We're For";
  const headingLines = toLines(focus?.heading?.title, focus?.heading?.titleAccent, 'The', 'Focus');

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();
  const container = shouldReduce ? {} : staggerContainer;
  const item = shouldReduce ? reducedVariant : fadeUp;
  const right = shouldReduce ? reducedVariant : slideInRight;

  // ── Persona switcher state ──
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const activePortrait = PORTRAITS[active % PORTRAITS.length];

  // Auto-advance through personas until the visitor takes over (hover/focus).
  useEffect(() => {
    if (shouldReduce || paused || audience.length < 2) return;
    const id = setInterval(() => setActive((i) => (i + 1) % audience.length), AUTO_MS);
    return () => clearInterval(id);
  }, [shouldReduce, paused, audience.length]);

  // Keep the active index valid if the audience list length changes.
  useEffect(() => {
    if (active >= audience.length) setActive(0);
  }, [audience.length, active]);

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
            eyebrow={headingEyebrow}
            lines={headingLines}
            className="text-dark-wood text-4xl md:text-5xl"
            align="left"
            as="h2"
          />
        </div>

        {/* ── Persona switcher: index list (left) + developing portrait (right) ── */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="px-6 md:px-12 mb-32 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:items-stretch"
        >
          {/* Persona index — one expanded at a time */}
          <div className="flex flex-col justify-center">
            {audience.map((a, i) => {
              const isActive = i === active;
              return (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-pressed={isActive}
                  className="group border-t border-dark-wood/15 py-6 text-left outline-none first:border-t-0 focus-visible:bg-dark-wood/[0.03]"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="label-text text-[11px] tabular-nums transition-colors duration-300"
                      style={{ color: isActive ? '#CE8400' : 'rgba(28,16,4,0.35)' }}
                    >
                      0{i + 1}
                    </span>
                    <h3
                      className="font-display text-3xl leading-[1.05] transition-colors duration-500 md:text-4xl lg:text-5xl"
                      style={{ color: isActive ? '#1C1004' : 'rgba(28,16,4,0.32)' }}
                    >
                      {a.label}
                    </h3>
                  </div>
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="body"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: shouldReduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-md pl-10 pt-4 font-body text-base font-light leading-relaxed text-dark-wood/65 md:text-lg">
                          {a.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>

          {/* Developing portrait — fixed 4:5 frame so nothing jumps on swap */}
          <div className="relative w-full overflow-hidden rounded-[3px] bg-dark-wood" style={{ aspectRatio: '4 / 5' }}>
            {shouldReduce ? (
              <Image
                key={active}
                src={activePortrait}
                alt={`Editorial portrait — ${audience[active]?.label ?? ''}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            ) : (
              <AnimatePresence>
                <motion.div
                  key={active}
                  variants={developVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0"
                >
                  <Image
                    src={activePortrait}
                    alt={`Editorial portrait — ${audience[active]?.label ?? ''}`}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            )}

            {/* Bottom scrim + caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-dark-wood/85 via-dark-wood/25 to-transparent p-6 md:p-8">
              <div className="flex items-end justify-between gap-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: shouldReduce ? 0 : -8 }}
                    transition={{ duration: shouldReduce ? 0 : 0.4 }}
                    className="font-display text-2xl leading-none text-almond-cream md:text-3xl"
                  >
                    {audience[active]?.label}
                  </motion.p>
                </AnimatePresence>
                <span className="label-text flex-none text-[10px] tabular-nums text-nature-brown">
                  0{active + 1} / 0{audience.length}
                </span>
              </div>
            </div>

            {/* Persona progress ticks */}
            <div className="absolute right-6 top-6 z-10 flex flex-col gap-1.5 md:right-8 md:top-8">
              {audience.map((a, i) => (
                <span
                  key={a.label}
                  className="h-6 w-px transition-colors duration-300"
                  style={{ backgroundColor: i === active ? '#CE8400' : 'rgba(255,235,205,0.35)' }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* 10-Year Vision — full-bleed dark block */}
        <div className="relative bg-dark-wood py-32 md:py-44 px-6 md:px-12 overflow-hidden">
          {visionBgUrl ? (
            // Owner-uploaded background, dimmed so almond-cream text stays legible.
            <div className="absolute inset-0 z-0" aria-hidden>
              <Image src={visionBgUrl} alt="" fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-dark-wood/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-wood via-dark-wood/70 to-dark-wood/55" />
            </div>
          ) : (
            <BYRAPattern animated={false} />
          )}

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
