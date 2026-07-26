'use client';

import { useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { staggerContainer, fadeUp, reducedVariant } from '@/lib/animations';
import ProductCard, { type CardPiece } from '@/components/ProductCard';

/** A card piece plus the slug used to match it against a category tab. */
export type BrowsePiece = CardPiece & { categorySlug: string };

export type CategoryTab = { label: string; slug: string };

/** Slug of the tab that shows everything (mirrored by the server page). */
const ALL_SLUG = 'all';

export default function CollectionsBrowser({
  pieces,
  categories,
}: {
  pieces: BrowsePiece[];
  categories: CategoryTab[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_SLUG);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();

  const filtered = activeCategory === ALL_SLUG
    ? pieces
    : pieces.filter((p) => p.categorySlug === activeCategory);

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
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`label-text text-xs px-5 py-2.5 border transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat.slug
                  ? 'bg-nature-brown text-dark-wood border-nature-brown'
                  : 'border-almond-cream/20 text-almond-cream/60 hover:border-almond-cream/50 hover:text-almond-cream'
              }`}
            >
              {cat.label}
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
