'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { fadeUp, staggerContainer, slideInLeft, slideInRight, reducedVariant } from '@/lib/animations';
import BYRAPattern from '@/components/BYRAPattern';

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: '-80px' });
  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' });
  const shouldReduce = useReducedMotion();

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : fadeUp;
  const leftVariants = shouldReduce ? reducedVariant : slideInLeft;
  const rightVariants = shouldReduce ? reducedVariant : slideInRight;

  const values = [
    { label: 'Authenticity', body: 'We build clothes that tell your truth, not ours. Every silhouette starts with you.' },
    { label: 'Craft', body: 'Precision finishing, quality materials, deliberate construction. Nothing is incidental.' },
    { label: 'Identity', body: 'Fashion as self-declaration. What you wear is who you choose to be today.' },
    { label: 'Culture', body: 'Rooted in Nigeria, speaking to the world. African luxury on its own terms.' },
  ];

  return (
    <div className="min-h-screen bg-dark-wood">
      {/* Hero */}
      <div ref={heroRef} className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/api/placeholder?w=1440&h=900&bg=1C1004&fg=CE8400&text=Ciallade+Story"
            alt="Ciallade brand heritage"
            fill
            sizes="100vw"
            quality={85}
            priority
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-wood via-dark-wood/50 to-transparent" />
          <BYRAPattern animated={false} />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? 'visible' : 'hidden'}
          className="relative z-10 px-6 md:px-12 pb-16 pt-36 max-w-3xl"
        >
          <motion.p variants={itemVariants} className="label-text text-xs text-nature-brown mb-6">
            Our Story
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="font-display text-almond-cream leading-none"
            style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
          >
            Wear who<br />
            <span className="text-nature-brown">you are.</span>
          </motion.h1>
        </motion.div>
      </div>

      {/* Story section */}
      <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-2 py-20">
        <motion.div
          variants={leftVariants}
          initial="hidden"
          animate={storyInView ? 'visible' : 'hidden'}
          className="px-6 md:px-12 lg:px-16 flex flex-col justify-center py-10"
        >
          <p className="label-text text-xs text-nature-brown mb-8">The Beginning</p>
          <div className="space-y-6 font-body font-light text-almond-cream/70 text-base leading-relaxed">
            <p>
              Ciallade began with a simple conviction: that luxury fashion in Africa didn&apos;t have to borrow its identity from anywhere else. It could be warm, geometric, bold — and entirely its own.
            </p>
            <p>
              Founded in Lagos, we set out to build a brand that treats clothing not as trend but as language. Every collection is a new vocabulary. Every piece, a sentence you choose to say.
            </p>
            <p>
              The name Ciallade is a mark of distinction. The comma is our icon — a pause, a breath, a choice made mid-sentence to change direction. To reinvent.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={rightVariants}
          initial="hidden"
          animate={storyInView ? 'visible' : 'hidden'}
          className="relative min-h-[50vh] lg:min-h-[60vh]"
        >
          <Image
            src="/api/placeholder?w=800&h=900&bg=75492B&fg=FFEBCD&text=Lagos+Studio"
            alt="Ciallade Lagos studio and atelier"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Values */}
      <div ref={valuesRef} className="relative bg-almond-cream py-20 overflow-hidden">
        <BYRAPattern color="#1C1004" opacity={0.04} animated={false} />
        <div className="relative z-10 px-6 md:px-12">
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="label-text text-xs text-coffee-brown mb-4"
          >
            What We Stand For
          </motion.p>
          <motion.h2
            variants={itemVariants}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.1 }}
            className="font-display text-dark-wood text-4xl md:text-5xl mb-16 leading-tight"
          >
            The Ciallade Pillars
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, i) => (
              <motion.div key={value.label} variants={itemVariants} transition={{ delay: i * 0.1 }}>
                <div className="w-8 h-px bg-nature-brown mb-6" />
                <h3 className="font-display text-dark-wood text-2xl mb-4">{value.label}</h3>
                <p className="font-body font-light text-dark-wood/60 text-sm leading-relaxed">{value.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative bg-dark-wood py-24 text-center overflow-hidden">
        <BYRAPattern animated={false} />
        <div className="relative z-10 px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-almond-cream mb-8 leading-tight"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            Be Yourself.<br />
            <span className="text-nature-brown">Reinvent Always.</span>
          </motion.h2>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            href="/collections"
            className="inline-block border border-nature-brown text-nature-brown label-text text-xs px-10 py-4 hover:bg-nature-brown hover:text-dark-wood transition-all duration-300"
          >
            Shop Now
          </motion.a>
        </div>
      </div>
    </div>
  );
}
