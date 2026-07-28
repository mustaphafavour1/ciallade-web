'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import SectionHeading from '@/components/SectionHeading';
import type { SanityEditorial } from '@/sanity/lib/fetch';

// Blinds / mask wipe: a set of vertical bars that slide away in sequence,
// uncovering the editorial photo. ~7 bars stays inside the 6–8 spec range.
const BLIND_COUNT = 7;
const BLINDS = Array.from({ length: BLIND_COUNT }, (_, i) => i);

export default function EditorialSection({ editorial }: { editorial?: SanityEditorial | null }) {
  const sectionLabel = editorial?.sectionLabel ?? 'SS 2026 Campaign';
  const headline = editorial?.headline ?? 'Define the moment.';
  const subheadline = editorial?.subheadline ?? 'Own the frame.';
  const imageUrl =
    editorial?.imageUrl ??
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&h=1000&q=80';
  const ctaText = editorial?.ctaText ?? 'Explore the Campaign';
  const ctaLink = editorial?.ctaLink ?? '/collections';

  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative bg-near-black wash-dark overflow-hidden py-32 md:py-44 px-6 md:px-12"
    >
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        {/* Title above — routed through the shared headline mechanism */}
        <SectionHeading
          eyebrow={sectionLabel}
          align="center"
          as="h2"
          lines={[[{ text: headline }], [{ text: subheadline, accent: true }]]}
          className="text-almond-cream text-5xl md:text-7xl lg:text-8xl mb-3.5 md:mb-5"
        />

        {/* Concept centered below: cinematic framed photo revealed by a blinds wipe */}
        <div className="relative mx-auto w-full max-w-[640px]">
          <div
            className="relative overflow-hidden bg-near-black"
            style={{ aspectRatio: '4 / 5' }}
          >
            <Image
              src={imageUrl}
              alt="Ciallade editorial campaign"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 640px, 100vw"
            />

            {/* Blinds / mask wipe — vertical bars slide away, staggered.
                Not rendered under reduced motion so the photo shows cleanly. */}
            {!reduce && (
              <div className="absolute inset-0 z-10 flex" aria-hidden>
                {BLINDS.map((i) => (
                  <motion.div
                    key={i}
                    className="h-full flex-1 bg-near-black"
                    initial={{ y: '0%' }}
                    animate={inView ? { y: i % 2 === 0 ? '-101%' : '101%' } : { y: '0%' }}
                    transition={{
                      duration: 0.75,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.15 + i * 0.08,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Kept signature accent: quiet registration / crosshair marks framing the photo.
              Corner ticks + thin center marks in low-opacity gold hairlines. */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: reduce ? 0 : 0.9 }}
            aria-hidden
          >
            {/* Corner ticks (L-brackets) */}
            <span className="absolute -top-2 -left-2 h-5 w-5 border-l border-t border-nature-brown/40" />
            <span className="absolute -top-2 -right-2 h-5 w-5 border-r border-t border-nature-brown/40" />
            <span className="absolute -bottom-2 -left-2 h-5 w-5 border-l border-b border-nature-brown/40" />
            <span className="absolute -bottom-2 -right-2 h-5 w-5 border-r border-b border-nature-brown/40" />
            {/* Thin center registration marks on each edge */}
            <span className="absolute -top-2 left-1/2 h-3 w-px -translate-x-1/2 bg-nature-brown/40" />
            <span className="absolute -bottom-2 left-1/2 h-3 w-px -translate-x-1/2 bg-nature-brown/40" />
            <span className="absolute -left-2 top-1/2 h-px w-3 -translate-y-1/2 bg-nature-brown/40" />
            <span className="absolute -right-2 top-1/2 h-px w-3 -translate-y-1/2 bg-nature-brown/40" />
          </motion.div>
        </div>

        {/* CTA */}
        <motion.a
          href={ctaLink}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, delay: reduce ? 0 : 0.4 }}
          className="mt-14 md:mt-16 inline-block border border-nature-brown text-nature-brown font-body label-text text-xs px-10 py-4 transition-colors duration-300 hover:bg-nature-brown hover:text-dark-wood"
        >
          {ctaText}
        </motion.a>
      </div>
    </section>
  );
}
