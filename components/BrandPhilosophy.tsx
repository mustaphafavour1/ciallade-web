'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
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

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=1000&q=80';

export default function BrandPhilosophy({ philosophy }: { philosophy?: SanityPhilosophy | null }) {
  const philosophyText = philosophy?.philosophyText?.trim() || DEFAULT_PHILOSOPHY_TEXT;
  const imageUrl = philosophy?.imageUrl?.trim() || DEFAULT_IMAGE;
  const linkText = philosophy?.linkText?.trim() || 'Our Story';
  const linkHref = philosophy?.linkHref?.trim() || '/about';

  // Outer section heading (above the sticky container).
  const eyebrow = philosophy?.heading?.eyebrow?.trim() || 'Our Foundation';
  const lines = toLines(
    philosophy?.heading?.title,
    philosophy?.heading?.titleAccent,
    'The philosophy\nbehind every',
    'stitch.'
  );

  // Inner heading, beside the philosophy text.
  const innerEyebrow = philosophy?.innerHeading?.eyebrow?.trim() || 'Brand Philosophy';
  const innerLines = toLines(
    philosophy?.innerHeading?.title,
    philosophy?.innerHeading?.titleAccent,
    'Wear who',
    'you are.'
  );

  const reduce = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // clipPath reveals the filled text from top to bottom as scroll progresses
  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ['inset(0 0 100% 0)', 'inset(0 0 0% 0)']
  );

  // Subtle scroll-tied parallax drift on the living left image (disabled on reduce).
  const imageParallax = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ['0%', '0%'] : ['-5%', '5%']
  );

  return (
    <>
      {/* Section title above sticky container — routed through SectionHeading */}
      <div className="bg-dark-wood px-6 md:px-12 pt-32 md:pt-44 pb-16">
        <SectionHeading
          eyebrow={eyebrow}
          lines={lines}
          className="text-almond-cream text-5xl md:text-6xl lg:text-7xl"
          align="left"
          as="h2"
        />
      </div>

      {/* Outer scroll container — tall so there's room to scroll through the text */}
      <div ref={outerRef} className="relative" style={{ minHeight: '250vh' }}>
        {/* Sticky inner: left image + right text, stays in viewport while scrolling */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            {/* Left half: LIVING editorial image — infinite Ken-Burns + scroll parallax */}
            <div
              className="relative min-h-[45vh] lg:min-h-0 overflow-hidden"
              style={{ borderRight: '3px solid #CE8400' }}
            >
              {/* Parallax layer (scroll-tied), oversized so the drift never reveals an edge */}
              <motion.div className="absolute -inset-[12%]" style={{ y: imageParallax }}>
                {/* Ken-Burns layer — continuous slow zoom + gentle pan */}
                <motion.div
                  className="relative h-full w-full"
                  animate={
                    reduce
                      ? undefined
                      : { scale: [1, 1.08, 1], x: ['0%', '1%', '0%'], y: ['0%', '-1%', '0%'] }
                  }
                  transition={
                    reduce
                      ? undefined
                      : { duration: 24, ease: 'easeInOut', repeat: Infinity }
                  }
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
              </motion.div>
            </div>

            {/* Right half: dark background, scroll-fill text */}
            <div
              className="flex flex-col justify-start h-full px-6 md:px-12 py-12 overflow-y-auto max-h-[55vh] lg:max-h-none"
              style={{ background: '#1C1004' }}
            >
              <SectionHeading
                eyebrow={innerEyebrow}
                lines={innerLines}
                className="text-almond-cream text-3xl md:text-4xl mb-8"
                align="left"
                as="h2"
              />

              {/* Scroll-driven outline-fill text effect. Both layers MUST share the
                  exact same font-size + leading so the outline and the gold fill stay
                  pixel-registered. Sized down (from clamp(28px,3vw,40px)/1.6) so the
                  whole 6-paragraph passage + inner heading fit the sticky screen. */}
              <div className="relative mb-8">
                {/* Outline layer — always visible */}
                <p
                  className="font-body font-light leading-[1.5] whitespace-pre-line"
                  style={{
                    fontSize: 'clamp(13px, 1.4vw, 16px)',
                    WebkitTextStroke: '0.5px #CE8400',
                    color: 'transparent',
                    userSelect: 'none',
                  }}
                >
                  {philosophyText}
                </p>

                {/* Filled layer — clips from top to bottom as you scroll */}
                <motion.p
                  className="font-body font-light leading-[1.5] whitespace-pre-line absolute top-0 left-0 w-full"
                  style={{
                    fontSize: 'clamp(13px, 1.4vw, 16px)',
                    color: '#CE8400',
                    clipPath,
                    pointerEvents: 'none',
                  }}
                >
                  {philosophyText}
                </motion.p>
              </div>

              <a
                href={linkHref}
                className="inline-flex items-center gap-2 label-text text-xs text-almond-cream/50 hover:text-nature-brown border-b border-almond-cream/20 hover:border-nature-brown transition-all duration-300 pb-1 w-fit"
              >
                {linkText}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
