'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { fadeUp, slideInLeft, slideInRight, reducedVariant } from '@/lib/animations';
import BYRAPattern from './BYRAPattern';

export default function BrandPhilosophy() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduce = useReducedMotion();

  const leftVariant = shouldReduce ? reducedVariant : slideInLeft;
  const rightVariant = shouldReduce ? reducedVariant : slideInRight;
  const upVariant = shouldReduce ? reducedVariant : fadeUp;

  return (
    <section ref={ref} className="relative bg-almond-cream overflow-hidden">
      <BYRAPattern color="#1C1004" opacity={0.04} animated={false} />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        {/* Left: editorial image */}
        <motion.div
          variants={leftVariant}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative min-h-[50vh] lg:min-h-[80vh]"
        >
          <Image
            src="https://placehold.co/800x1000/75492B/FFEBCD?text=Ciallade+Story"
            alt="Ciallade brand editorial — warm tones, structured silhouette"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
            className="object-cover"
          />
        </motion.div>

        {/* Right: quote and text */}
        <motion.div
          variants={rightVariant}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col justify-center px-8 md:px-14 lg:px-16 py-20"
        >
          <motion.p
            variants={upVariant}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
            className="label-text text-xs text-coffee-brown mb-8"
          >
            Brand Philosophy
          </motion.p>

          <motion.blockquote
            variants={upVariant}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.35 }}
            className="font-display text-dark-wood leading-[0.92] mb-8"
            style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
          >
            &ldquo;Wear who<br />you are.<br />Wear it<br />
            <span className="text-nature-brown">boldly.&rdquo;</span>
          </motion.blockquote>

          <motion.p
            variants={upVariant}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.5 }}
            className="font-body font-light text-dark-wood/70 text-base leading-relaxed max-w-sm"
          >
            Ciallade was born from a conviction — that fashion is not a costume but a declaration. Every piece is designed to amplify the person wearing it, never to replace them.
          </motion.p>

          <motion.a
            variants={upVariant}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ delay: 0.65 }}
            href="/about"
            className="mt-10 inline-block label-text text-xs text-dark-wood border-b border-dark-wood/30 hover:border-nature-brown hover:text-nature-brown transition-all duration-300 pb-1 w-fit"
          >
            Our Story
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
