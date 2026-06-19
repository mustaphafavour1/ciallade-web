'use client';

import { useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { products, Product } from '@/data/products';
import { staggerContainer, fadeUp, reducedVariant } from '@/lib/animations';
import ProductCard from '@/components/ProductCard';

type Category = 'All' | Product['category'];

const categories: Category[] = ['All', 'Tops', 'Bottoms', 'Headwear', 'Jackets', 'Statement Pieces'];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();

  const filtered = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : fadeUp;

  return (
    <div className="min-h-screen bg-dark-wood pt-28">
      {/* Header */}
      <div className="px-6 md:px-12 py-12 border-b border-almond-cream/10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="label-text text-xs text-nature-brown mb-4"
        >
          Shop All
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-almond-cream leading-none"
          style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
        >
          Collections
        </motion.h1>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 md:px-12 py-6 border-b border-almond-cream/10 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`label-text text-xs px-5 py-2.5 border transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-nature-brown text-dark-wood border-nature-brown'
                  : 'border-almond-cream/20 text-almond-cream/60 hover:border-almond-cream/50 hover:text-almond-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div ref={ref} className="px-6 md:px-12 py-12">
        <p className="font-body font-light text-almond-cream/40 text-sm mb-8">
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
        </p>
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
        >
          {filtered.map((product, i) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
