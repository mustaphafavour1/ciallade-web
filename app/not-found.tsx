'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

/**
 * 404 — "A Loose Thread".
 *
 * Concept: at Ciallade every garment is a thread of identity; a missing page is a
 * thread that has slipped off the rail and frayed into nowhere. The signature
 * motion is that single golden thread drawing itself across the "404", weaving
 * behind the digits, splitting into loose frayed ends on the right — with a
 * travelling glint of light running the length of it, the way light catches silk.
 * The "404" itself echoes the site's ONE headline mechanism (SectionHeading):
 * digits rise from behind a clip mask, the middle 0 inked gold with a drawn
 * underline. Reduced motion renders the whole scene at rest, fully drawn.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

// One continuous thread that undulates across the width of the "404"...
const THREAD = 'M30,120 C170,66 320,178 480,120 C620,70 700,168 780,120';
// ...then frays into three loose strands from the same point (780,120).
const STRANDS = [
  'M780,120 C880,104 1000,80 1170,64',
  'M780,120 C885,130 1010,152 1180,182',
  'M780,120 C840,120 892,132 916,164',
];
const ENDS: Array<[number, number]> = [
  [1170, 64],
  [1180, 182],
  [916, 164],
];

const DIGITS = ['4', '0', '4'];

export default function NotFound() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-near-black wash-dark px-6 py-24 text-almond-cream md:px-12">
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="label-text text-[11px] tracking-[0.25em] text-nature-brown"
        >
          A Loose Thread
        </motion.p>

        {/* The 404 with its golden thread */}
        <div className="relative my-4 flex w-full items-center justify-center md:my-6">
          <svg
            viewBox="0 0 1200 240"
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2"
            style={{ filter: 'drop-shadow(0 0 10px rgba(206,132,0,0.28))' }}
          >
            {/* Main thread — draws itself left to right */}
            <motion.path
              d={THREAD}
              fill="none"
              stroke="#CE8400"
              strokeWidth={2}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.9 : 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{
                pathLength: { duration: 1.6, ease: [0.65, 0, 0.35, 1], delay: 0.2 },
                opacity: { duration: 0.3, delay: 0.2 },
              }}
            />

            {/* Frayed loose ends */}
            {STRANDS.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                fill="none"
                stroke="#CE8400"
                strokeWidth={1.4}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.6 : 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{
                  pathLength: { duration: 0.9, ease: 'easeOut', delay: reduce ? 0 : 1.5 + i * 0.12 },
                  opacity: { duration: 0.3, delay: reduce ? 0 : 1.5 + i * 0.12 },
                }}
              />
            ))}

            {/* Knot at the start of the thread */}
            <motion.circle
              cx={30}
              cy={120}
              r={4}
              fill="#CE8400"
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 0.9 : 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              transition={{ duration: 0.4, ease: 'backOut', delay: reduce ? 0 : 0.3 }}
            />

            {/* Tiny beads at each frayed end */}
            {ENDS.map(([cx, cy], i) => (
              <motion.circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={2.4}
                fill="#CE8400"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ scale: reduce ? 1 : 0, opacity: reduce ? 0.65 : 0 }}
                animate={{ scale: 1, opacity: 0.65 }}
                transition={{ duration: 0.35, ease: 'backOut', delay: reduce ? 0 : 2.2 + i * 0.1 }}
              />
            ))}

            {/* Travelling glint — light running the length of the silk thread */}
            {!reduce && (
              <motion.path
                d={THREAD}
                fill="none"
                stroke="#FFEBCD"
                strokeWidth={2}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                pathLength={100}
                strokeDasharray="5 100"
                initial={{ strokeDashoffset: 100, opacity: 0.9 }}
                animate={{ strokeDashoffset: -5 }}
                transition={{
                  duration: 2.6,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 1.4,
                  delay: 2.4,
                }}
              />
            )}
          </svg>

          {/* "404" — rises from a clip mask, middle 0 inked gold (SectionHeading echo) */}
          <h1 className="relative z-10 flex items-end justify-center font-display leading-none tracking-tight text-almond-cream text-[clamp(5rem,25vw,17rem)]">
            {DIGITS.map((digit, i) => {
              const gold = i === 1;
              return (
                <span key={i} className="relative inline-flex overflow-hidden pb-[0.12em]">
                  <motion.span
                    className={`inline-block ${gold ? 'text-nature-brown' : ''}`}
                    initial={{ y: reduce ? 0 : '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.09 }}
                  >
                    {digit}
                  </motion.span>
                  {gold && (
                    <motion.span
                      aria-hidden
                      className="absolute bottom-[0.05em] left-0 h-[3px] w-full origin-left bg-nature-brown"
                      initial={{ scaleX: reduce ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.8 }}
                    />
                  )}
                </span>
              );
            })}
          </h1>
        </div>

        {/* Tagline — the site's headline mechanism, brand voice of reinvention */}
        <div className="mt-6 md:mt-8">
          <SectionHeading
            as="h2"
            align="center"
            className="text-almond-cream text-3xl md:text-5xl"
            lines={[
              [{ text: 'This thread leads nowhere.' }],
              [{ text: 'Reinvent', accent: true }, { text: ' your route.' }],
            ]}
          />
        </div>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.5 }}
          className="mt-8 max-w-md text-balance text-sm leading-relaxed text-almond-cream/70 md:text-base"
        >
          The page you&rsquo;re looking for slipped off the rail. But every loose end, at
          Ciallade, is simply another place to begin.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.7 }}
          className="mt-12 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row"
        >
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-3 border border-nature-brown bg-nature-brown px-10 py-4 text-xs text-dark-wood label-text transition-colors duration-300 hover:bg-transparent hover:text-nature-brown sm:w-auto"
          >
            <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Return Home
          </Link>
          <Link
            href="/collections"
            className="group inline-flex w-full items-center justify-center gap-3 border border-nature-brown/60 px-10 py-4 text-xs text-nature-brown label-text transition-colors duration-300 hover:bg-nature-brown hover:text-dark-wood sm:w-auto"
          >
            Browse Collections
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
