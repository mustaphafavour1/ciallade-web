'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeading, { toLines } from '@/components/SectionHeading';
import type { SanityPhilosophy } from '@/sanity/lib/fetch';

const DEFAULT_PHILOSOPHY_TEXT = `Ciallade exists at the intersection of identity and craft.

We believe clothing is not decoration — it is declaration. Every silhouette we design begins not with a sketch but with a question: who is this person, and what do they need the world to know about them?

Fashion, in its truest form, is a private language made public. The choice of fabric, the fall of a collar, the weight of a lapel — these are not accidents. They are arguments. Arguments for presence. For particularity. For the right to take up space in the world as you truly are.

Nigeria gave us our roots, our palette, our hunger. Africa gave us our proportion — our understanding that beauty is not a size, a shade, or a silhouette borrowed from elsewhere. It is earned, learned, and worn with the confidence of someone who needed no permission to arrive.

We are not competing with the houses of Milan or Paris. We are building something they cannot replicate: a house built on a different inheritance. One that knows the weight of aso-oke and the precision of a bespoke Lagos tailor at midnight before a ceremony. One that carries both.

Ciallade is for those who already know who they are — and simply need clothing that agrees.`;

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=1000&q=80';

// Slightly larger than the original clamp(28px,3vw,40px). The text now lives in
// a normally-scrolling column (the image is pinned), so it no longer has to fit
// one screen and can breathe at full size.
const FONT = 'clamp(30px, 3.4vw, 46px)';

/**
 * One word of the passage: a gold outline that fills solid as it scrolls up
 * through the reading zone. The base (stroked, transparent) layer and the gold
 * fill layer render the same glyphs in the same box, so they stay registered.
 */
function FillWord({
  word,
  progress,
  range,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative inline-block">
      <span aria-hidden style={{ WebkitTextStroke: '0.6px rgba(206,132,0,0.5)', color: 'transparent' }}>
        {word}
      </span>
      <motion.span aria-hidden className="absolute inset-0" style={{ color: '#CE8400', opacity }}>
        {word}
      </motion.span>
    </span>
  );
}

export default function BrandPhilosophy({ philosophy }: { philosophy?: SanityPhilosophy | null }) {
  const philosophyText = philosophy?.philosophyText?.trim() || DEFAULT_PHILOSOPHY_TEXT;
  const imageUrl = philosophy?.imageUrl?.trim() || DEFAULT_IMAGE;
  const linkText = philosophy?.linkText?.trim() || 'Our Story';
  const linkHref = philosophy?.linkHref?.trim() || '/about';

  const eyebrow = philosophy?.heading?.eyebrow?.trim() || 'Our Foundation';
  const lines = toLines(
    philosophy?.heading?.title,
    philosophy?.heading?.titleAccent,
    'The philosophy\nbehind every',
    'stitch.'
  );

  const innerEyebrow = philosophy?.innerHeading?.eyebrow?.trim() || 'Brand Philosophy';
  const innerLines = toLines(
    philosophy?.innerHeading?.title,
    philosophy?.innerHeading?.titleAccent,
    'Wear who',
    'you are.'
  );

  const reduce = useReducedMotion();

  // Fill progress is tied to the text column scrolling through the viewport.
  const textRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 0.85', 'end 0.55'],
  });

  const paragraphs = philosophyText.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const totalWords = paragraphs.reduce((n, p) => n + p.split(/\s+/).length, 0);
  let wordCursor = 0;

  return (
    <section className="bg-dark-wood">
      {/* Section title */}
      <div className="px-6 md:px-12 pt-32 md:pt-44 pb-12 md:pb-16">
        <SectionHeading
          eyebrow={eyebrow}
          lines={lines}
          className="text-almond-cream text-5xl md:text-6xl lg:text-7xl"
          align="left"
          as="h2"
        />
      </div>

      {/* Pinned image (left) + fully-scrolling text (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-start">
        {/* Left: image pins for the length of the text scroll */}
        <div
          className="relative h-[45vh] overflow-hidden lg:sticky lg:top-0 lg:h-screen"
          style={{ borderRight: '3px solid #CE8400' }}
        >
          <motion.div
            className="relative h-full w-full"
            animate={reduce ? undefined : { scale: [1, 1.08, 1], x: ['0%', '1%', '0%'], y: ['0%', '-1%', '0%'] }}
            transition={reduce ? undefined : { duration: 24, ease: 'easeInOut', repeat: Infinity }}
          >
            <Image
              src={imageUrl}
              alt="Ciallade brand editorial — warm tones, structured silhouette"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </div>

        {/* Right: scrolling text with the outline→gold fill effect */}
        <div ref={textRef} className="px-6 md:px-12 py-16 md:py-24 lg:py-28">
          <SectionHeading
            eyebrow={innerEyebrow}
            lines={innerLines}
            className="text-almond-cream text-3xl md:text-4xl mb-10 md:mb-12"
            align="left"
            as="h2"
          />

          <div className="font-body font-light" style={{ fontSize: FONT, lineHeight: 1.45 }}>
            {reduce
              ? paragraphs.map((p, i) => (
                  <p key={i} className={i > 0 ? 'mt-8' : ''} style={{ color: '#CE8400' }}>
                    {p}
                  </p>
                ))
              : paragraphs.map((para, pi) => {
                  const words = para.split(/\s+/);
                  return (
                    <p key={pi} className={pi > 0 ? 'mt-8' : ''}>
                      {words.map((w, wi) => {
                        const start = wordCursor / totalWords;
                        const end = (wordCursor + 1) / totalWords;
                        wordCursor += 1;
                        return (
                          <span key={wi}>
                            <FillWord word={w} progress={scrollYProgress} range={[start, end]} />{' '}
                          </span>
                        );
                      })}
                    </p>
                  );
                })}
          </div>

          <a
            href={linkHref}
            className="mt-12 inline-flex items-center gap-2 label-text text-xs text-almond-cream/50 hover:text-nature-brown border-b border-almond-cream/20 hover:border-nature-brown transition-all duration-300 pb-1 w-fit"
          >
            {linkText}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
