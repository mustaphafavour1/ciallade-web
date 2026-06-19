'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Image from 'next/image';
import { fadeUp, staggerContainer, reducedVariant } from '@/lib/animations';

export default function EditorialSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduce = useReducedMotion();

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : fadeUp;

  const strokeVariant: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.4,
      transition: { duration: 2, ease: 'easeInOut' as const },
    },
  };

  return (
    <section ref={ref} className="relative bg-dark-wood overflow-hidden py-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.p variants={itemVariants} className="label-text text-xs text-nature-brown mb-6">
          SS 2026 Campaign
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="font-display text-almond-cream text-4xl md:text-6xl lg:text-7xl text-center leading-tight mb-12 max-w-2xl"
        >
          Define the moment.<br />
          <span className="text-nature-brown">Own the frame.</span>
        </motion.h2>

        {/* Campaign image with geometric frame */}
        <motion.div
          variants={itemVariants}
          className="relative w-full max-w-4xl mx-auto px-6 md:px-12"
        >
          {/* Animated geometric frame */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {!shouldReduce && (
              <>
                <motion.rect
                  x="2" y="2" width="96" height="96"
                  fill="none" stroke="#CE8400" strokeWidth="0.3"
                  variants={strokeVariant}
                  initial="hidden"
                  animate={inView ? 'visible' : 'hidden'}
                />
                <motion.line
                  x1="2" y1="2" x2="15" y2="2"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.6, ease: 'easeOut' }}
                />
                <motion.line
                  x1="2" y1="2" x2="2" y2="15"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
                />
                <motion.line
                  x1="98" y1="2" x2="85" y2="2"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.0, duration: 0.6, ease: 'easeOut' }}
                />
                <motion.line
                  x1="98" y1="2" x2="98" y2="15"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.1, duration: 0.6, ease: 'easeOut' }}
                />
                <motion.line
                  x1="2" y1="98" x2="15" y2="98"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.2, duration: 0.6, ease: 'easeOut' }}
                />
                <motion.line
                  x1="2" y1="98" x2="2" y2="85"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.3, duration: 0.6, ease: 'easeOut' }}
                />
                <motion.line
                  x1="98" y1="98" x2="85" y2="98"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.4, duration: 0.6, ease: 'easeOut' }}
                />
                <motion.line
                  x1="98" y1="98" x2="98" y2="85"
                  stroke="#CE8400" strokeWidth="0.8"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ delay: 1.5, duration: 0.6, ease: 'easeOut' }}
                />
              </>
            )}
          </svg>

          <div className="relative" style={{ aspectRatio: '16/9' }}>
            <Image
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&h=675&q=80"
              alt="Ciallade SS 2026 editorial campaign"
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <motion.a
          variants={itemVariants}
          href="/collections"
          className="mt-12 inline-block border border-nature-brown text-nature-brown font-body label-text text-xs px-10 py-4 hover:bg-nature-brown hover:text-dark-wood transition-all duration-300"
        >
          Explore the Campaign
        </motion.a>
      </motion.div>
    </section>
  );
}
