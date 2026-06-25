'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import type { SanityPhilosophy } from '@/sanity/lib/fetch';

const DEFAULT_PHILOSOPHY_TEXT = `Ciallade exists at the intersection of identity and craft.

We believe clothing is not decoration — it is declaration. Every silhouette we design begins not with a sketch but with a question: who is this person, and what do they need the world to know about them?

Fashion, in its truest form, is a private language made public. The choice of fabric, the fall of a collar, the weight of a lapel — these are not accidents. They are arguments. Arguments for presence. For particularity. For the right to take up space in the world as you truly are.

Nigeria gave us our roots, our palette, our hunger. Africa gave us our proportion — our understanding that beauty is not a size, a shade, or a silhouette borrowed from elsewhere. It is earned, learned, and worn with the confidence of someone who needed no permission to arrive.

We are not competing with the houses of Milan or Paris. We are building something they cannot replicate: a house built on a different inheritance. One that knows the weight of aso-oke and the precision of a bespoke Lagos tailor at midnight before a ceremony. One that carries both.

Ciallade is for those who already know who they are — and simply need clothing that agrees.`;

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&h=1000&q=80';

export default function BrandPhilosophy({ philosophy }: { philosophy?: SanityPhilosophy | null }) {
  const philosophyText = philosophy?.philosophyText ?? DEFAULT_PHILOSOPHY_TEXT;
  const imageUrl = philosophy?.imageUrl ?? DEFAULT_IMAGE;
  const sectionLabel = philosophy?.sectionLabel ?? 'Our Foundation';
  const title = philosophy?.title ?? 'The philosophy\nbehind every stitch.';
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

  return (
    <>
      {/* Section title + subtitle above sticky container */}
      <div className="bg-dark-wood px-8 md:px-14 lg:px-16 pt-40 pb-16">
        <p className="label-text text-xs text-nature-brown tracking-widest mb-4">{sectionLabel}</p>
        <h2 className="font-display text-almond-cream leading-tight" style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}>
          {title.split('\n').map((line, i) => (
            <span key={i}>{line}{i < title.split('\n').length - 1 && <br />}</span>
          ))}
        </h2>
      </div>

      {/* Outer scroll container — tall so there's room to scroll through the text */}
      <div ref={outerRef} className="relative" style={{ minHeight: '250vh' }}>
        {/* Sticky inner: left image + right text, stays in viewport while scrolling */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

            {/* Left half: editorial image, fills full height */}
            <div className="relative min-h-[45vh] lg:min-h-0" style={{ borderRight: '3px solid #CE8400' }}>
              <Image
                src={imageUrl}
                alt="Ciallade brand editorial — warm tones, structured silhouette"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Right half: dark background, scroll-fill text */}
            <div
              className="flex flex-col justify-center h-full px-8 md:px-12 py-20 overflow-y-auto lg:overflow-hidden"
              style={{ background: '#1C1004' }}
            >
              <p className="label-text text-xs text-nature-brown tracking-widest mb-6">
                Brand Philosophy
              </p>

              <h2
                className="font-display text-almond-cream leading-tight mb-10"
                style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}
              >
                Wear who you are.
              </h2>

              {/* Scroll-driven outline-fill text effect */}
              <div className="relative mb-10">
                {/* Outline layer — always visible */}
                <p
                  className="font-body font-light leading-[1.6] whitespace-pre-line"
                  style={{
                    fontSize: 'clamp(28px, 3vw, 40px)',
                    WebkitTextStroke: '0.5px #CE8400',
                    color: 'transparent',
                    userSelect: 'none',
                  }}
                >
                  {philosophyText}
                </p>

                {/* Filled layer — clips from top to bottom as you scroll */}
                <motion.p
                  className="font-body font-light leading-[1.6] whitespace-pre-line absolute top-0 left-0 w-full"
                  style={{
                    fontSize: 'clamp(28px, 3vw, 40px)',
                    color: '#CE8400',
                    clipPath,
                    pointerEvents: 'none',
                  }}
                >
                  {philosophyText}
                </motion.p>
              </div>

              <a
                href="/about"
                className="inline-block label-text text-xs text-almond-cream/50 hover:text-nature-brown border-b border-almond-cream/20 hover:border-nature-brown transition-all duration-300 pb-1 w-fit"
              >
                Our Story →
              </a>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
