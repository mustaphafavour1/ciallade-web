'use client';

import { useState, useRef, useMemo } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { staggerContainer, fadeUp, reducedVariant } from '@/lib/animations';
import ProductCard, { type CardPiece } from '@/components/ProductCard';

/**
 * A card piece plus the slug used to match it against a category tab, and the
 * extra text fields (`description`, `tags`) that the search bar matches against.
 */
export type BrowsePiece = CardPiece & {
  categorySlug: string;
  description: string;
  tags: string[];
};

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
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const shouldReduce = useReducedMotion();

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();

  // Search is global across every piece's name, category, description and tags;
  // an active category tab (other than "All") is AND-combined with the query.
  const filtered = useMemo(() => {
    return pieces.filter((p) => {
      const inCategory = activeCategory === ALL_SLUG || p.categorySlug === activeCategory;
      if (!inCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = [p.name, p.category, p.description, ...p.tags]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [pieces, activeCategory, normalizedQuery]);

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

      {/* Search */}
      <div className="px-6 md:px-12 py-6 border-b border-almond-cream/10">
        <div className="relative w-full max-w-xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-almond-cream/40"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all pieces…"
            aria-label="Search all pieces"
            className="w-full border border-almond-cream/20 bg-dark-wood py-3 pl-11 pr-11 font-body text-sm font-light text-almond-cream placeholder:text-almond-cream/40 transition-colors duration-300 focus:border-nature-brown focus:outline-none focus:ring-1 focus:ring-nature-brown"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-almond-cream/50 transition-colors hover:text-almond-cream"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
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
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-body font-light text-almond-cream/60 text-base">
              {trimmedQuery
                ? `No pieces match “${trimmedQuery}”.`
                : 'No pieces here yet.'}
            </p>
            {trimmedQuery && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="label-text mt-4 text-xs text-nature-brown underline underline-offset-4 transition-colors hover:text-almond-cream"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
