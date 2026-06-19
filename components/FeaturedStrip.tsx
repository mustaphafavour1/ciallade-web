'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations';
import ProductCard from './ProductCard';
import { featuredProducts } from '@/data/products';

export default function FeaturedStrip() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduce = useReducedMotion();

  const containerVariants = shouldReduce ? {} : staggerContainer;

  return (
    <section ref={ref} className="bg-dark-wood py-20 overflow-hidden">
      <div className="px-6 md:px-12 mb-10 flex items-end justify-between">
        <div>
          <p className="label-text text-xs text-nature-brown mb-3">Featured Pieces</p>
          <h2 className="font-display text-almond-cream text-4xl md:text-5xl leading-tight">
            The Edit
          </h2>
        </div>
        <a
          href="/collections"
          className="hidden md:inline-block label-text text-xs text-almond-cream/50 hover:text-nature-brown transition-colors duration-300 border-b border-almond-cream/20 hover:border-nature-brown pb-1"
        >
          View All
        </a>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="flex gap-6 px-6 md:px-12 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featuredProducts.map((product, i) => (
          <div key={product.id} className="min-w-[280px] md:min-w-[320px] snap-start">
            <ProductCard product={product} index={i} />
          </div>
        ))}
      </motion.div>

      <div className="px-6 md:px-12 mt-6 md:hidden">
        <a
          href="/collections"
          className="label-text text-xs text-almond-cream/50 hover:text-nature-brown transition-colors duration-300 border-b border-almond-cream/20 hover:border-nature-brown pb-1"
        >
          View All
        </a>
      </div>
    </section>
  );
}
