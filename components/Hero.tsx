'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fadeUp, staggerContainer, reducedVariant } from '@/lib/animations';
import BYRAPattern from './BYRAPattern';

export default function Hero() {
  const shouldReduce = useReducedMotion();

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : fadeUp;

  return (
    <section className="relative min-h-dvh bg-dark-wood overflow-hidden flex items-center">
      {/* BYRA Geometric Pattern overlay */}
      <div className="absolute inset-0 z-0">
        <BYRAPattern animated={!shouldReduce} />
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 min-h-dvh">
        {/* Left content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-20 pt-32 pb-16 lg:pt-24"
        >
          <motion.p
            variants={itemVariants}
            className="label-text text-xs text-nature-brown mb-6"
          >
            New Collection · 2026
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-display text-almond-cream leading-[0.9] mb-8"
            style={{ fontSize: 'clamp(56px, 8vw, 120px)' }}
          >
            Be{' '}
            <span className="text-nature-brown">Yourself.</span>
            <br />
            Reinvent{' '}
            <span className="relative">
              Always.
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-0 left-0 w-full h-[2px] bg-nature-brown origin-left"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-body font-light text-almond-cream/70 text-lg leading-relaxed max-w-sm mb-10"
          >
            A luxury Nigerian fashion brand crafted for those who define themselves. Wear who you are. Wear it boldly.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <Link
              href="/collections"
              className="inline-block border border-nature-brown text-nature-brown font-body font-medium label-text text-xs px-8 py-4 hover:bg-nature-brown hover:text-dark-wood transition-all duration-300"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="inline-block border border-almond-cream/30 text-almond-cream/60 font-body font-medium label-text text-xs px-8 py-4 hover:border-almond-cream/70 hover:text-almond-cream transition-all duration-300"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mt-16 hidden lg:flex items-center gap-3 text-almond-cream/40"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-12 bg-almond-cream/30"
            />
            <span className="label-text text-[10px] -rotate-90 translate-y-2">Scroll</span>
          </motion.div>
        </motion.div>

        {/* Right: Editorial image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[50vh] lg:min-h-dvh"
        >
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&h=1200&q=80"
            alt="Ciallade 2026 Collection — editorial campaign image"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />
          {/* Gradient overlay blending into left side on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-wood via-transparent to-transparent lg:block hidden" />
          {/* Bottom gradient on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-wood via-transparent to-transparent lg:hidden" />

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 right-8 bg-dark-wood/80 backdrop-blur-sm border border-nature-brown/30 p-4"
          >
            <p className="label-text text-[10px] text-nature-brown mb-1">SS 2026</p>
            <p className="font-display text-almond-cream text-sm">New Arrivals</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
