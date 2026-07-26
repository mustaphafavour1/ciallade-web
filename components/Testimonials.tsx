'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Variants } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeading, { toLines, type Segment } from '@/components/SectionHeading';
import type { SanityHeading, SanityTestimonial } from '@/sanity/lib/fetch';

const FALLBACK: SanityTestimonial[] = [
  {
    _id: '1',
    name: 'Amara Okafor',
    location: 'Lagos, Nigeria',
    quote: "I wore the Ochre Linen Top to my presentation and walked in feeling like myself for the first time in years. Ciallade doesn't just dress you — it declares you.",
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&h=500&q=80',
  },
  {
    _id: '2',
    name: 'Kwame Asante',
    location: 'Accra, Ghana',
    quote: "The craftsmanship on the Dark Wood Jacket is unlike anything I've found locally or internationally. Structured, warm, and entirely mine.",
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&h=500&q=80',
  },
  {
    _id: '3',
    name: 'Zara Bello',
    location: 'Abuja, Nigeria',
    quote: "Every piece feels like it was made for the version of me I'm always becoming. The BYRA Cap is my identity on display.",
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&h=500&q=80',
  },
  {
    _id: '4',
    name: 'David Mensah',
    location: 'London, UK',
    quote: 'I visited Lagos and discovered Ciallade. Brought the Statement Coat back to London and nothing has started more conversations.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=500&q=80',
  },
];

/** An angled, de-emphasized quote card that sits partly behind the active portrait. */
function SideCard({ t, side, reduce }: { t: SanityTestimonial; side: 'left' | 'right'; reduce: boolean }) {
  const isLeft = side === 'left';
  const tilt = reduce
    ? `scale(0.82) translateX(${isLeft ? '18%' : '-18%'})`
    : `perspective(1000px) rotateY(${isLeft ? 22 : -22}deg) scale(0.82) translateX(${isLeft ? '22%' : '-22%'})`;

  return (
    <div
      aria-hidden
      className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-0' : 'right-0'} z-0 w-56 lg:w-64`}
    >
      <div style={{ transform: tilt, transformOrigin: isLeft ? 'right center' : 'left center' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={t._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl bg-white/[0.03] ring-1 ring-nature-brown/10 p-6"
          >
            <span className="font-display text-nature-brown/60 text-4xl leading-none block mb-1">
              &ldquo;
            </span>
            <p className="font-body font-light text-almond-cream/70 text-sm leading-relaxed line-clamp-4">
              {t.quote}
            </p>
            <p className="font-display text-almond-cream/80 text-sm mt-4">{t.name}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Testimonials({
  testimonials,
  heading,
}: {
  testimonials?: SanityTestimonial[] | null;
  heading?: SanityHeading | null;
}) {
  const quotes = testimonials?.length ? testimonials : FALLBACK;
  const n = quotes.length;

  // Default headline reads "What our customers say" — toLines can't place text
  // after the accent word, so the trailing " say" is appended only while the CMS
  // supplies no headline. Any CMS title/accent then drives the line on its own.
  const usingCmsHeadline = Boolean(heading?.title?.trim() || heading?.titleAccent?.trim());
  const built = toLines(heading?.title, heading?.titleAccent, 'What our', 'customers');
  const headingLines: Segment[][] = usingCmsHeadline
    ? built
    : built.map((line, i) => (i === built.length - 1 ? [...line, { text: ' say' }] : line));
  const reduce = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (dir: number) => {
    setDirection(dir);
    setActiveIdx((i) => (i + dir + n) % n);
  };
  const goTo = (i: number) => {
    setDirection(i >= activeIdx ? 1 : -1);
    setActiveIdx(i);
  };

  // Auto-cycle every 5s; timer restarts after any change (manual or automatic).
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setActiveIdx((i) => (i + 1) % n);
    }, 5000);
    return () => clearInterval(id);
  }, [activeIdx, n]);

  const active = quotes[activeIdx];
  const prev = quotes[(activeIdx - 1 + n) % n];
  const next = quotes[(activeIdx + 1) % n];

  // Carousel shuffle with a slight Y-rotation — the single animation primitive here.
  const portraitVariants: Variants = {
    enter: (d: number) => ({ opacity: 0, rotateY: reduce ? 0 : d * 35, x: reduce ? 0 : d * 70, scale: 0.85 }),
    center: {
      opacity: 1,
      rotateY: 0,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
    exit: (d: number) => ({
      opacity: 0,
      rotateY: reduce ? 0 : d * -35,
      x: reduce ? 0 : d * -70,
      scale: 0.85,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section className="relative bg-dark-wood overflow-hidden py-32 md:py-44 px-6 md:px-12">
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
        {/* Centered title, concept surrounds it below */}
        <SectionHeading
          eyebrow={heading?.eyebrow ?? 'Worn & Witnessed'}
          align="center"
          as="h2"
          lines={headingLines}
          className="text-almond-cream text-4xl md:text-6xl mb-16 md:mb-20"
        />

        {/* Stage: angled prev/next cards flanking the centered active portrait */}
        <div className="relative flex h-80 md:h-96 w-full items-center justify-center">
          <SideCard t={prev} side="left" reduce={!!reduce} />
          <SideCard t={next} side="right" reduce={!!reduce} />

          <div className="relative z-10 aspect-[4/5] w-56 md:w-64" style={{ perspective: 1000 }}>
            <AnimatePresence custom={direction}>
              <motion.div
                key={active._id}
                custom={direction}
                variants={portraitVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-nature-brown/20 shadow-2xl shadow-black/40"
              >
                <Image
                  src={active.avatar}
                  alt={active.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 256px, 224px"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Hanging gold quote glyph above the active quote */}
        <div className="relative mt-12 md:mt-14 w-full max-w-2xl text-center">
          <span aria-hidden className="font-display text-nature-brown text-6xl md:text-7xl leading-none block mb-2">
            &ldquo;
          </span>
          <div className="relative min-h-[180px] md:min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active._id}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -12 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote
                  className="font-display text-almond-cream leading-snug"
                  style={{ fontSize: 'clamp(20px, 2.4vw, 30px)' }}
                >
                  {active.quote}
                </blockquote>
                <p className="font-display text-almond-cream text-lg md:text-xl mt-6">{active.name}</p>
                <p className="label-text text-[10px] text-nature-brown/70 mt-1">{active.location}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls: prev/next arrows + avatar dots */}
        <div className="mt-10 md:mt-12 flex items-center justify-center gap-5 md:gap-6">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous testimonial"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-nature-brown ring-1 ring-nature-brown/30 transition-colors duration-300 hover:bg-nature-brown hover:text-dark-wood"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-3">
            {quotes.map((q, i) => (
              <button
                key={q._id}
                onClick={() => goTo(i)}
                aria-label={`View testimonial from ${q.name}`}
                className="relative rounded-full transition-opacity duration-300"
                style={{ opacity: i === activeIdx ? 1 : 0.45 }}
              >
                <span
                  className="relative block h-9 w-9 md:h-10 md:w-10 overflow-hidden rounded-full"
                  style={{
                    outline: i === activeIdx ? '2px solid #CE8400' : '2px solid rgba(206,132,0,0.2)',
                    outlineOffset: '2px',
                  }}
                >
                  <Image src={q.avatar} alt={q.name} fill className="object-cover" sizes="40px" />
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            aria-label="Next testimonial"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-nature-brown ring-1 ring-nature-brown/30 transition-colors duration-300 hover:bg-nature-brown hover:text-dark-wood"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
