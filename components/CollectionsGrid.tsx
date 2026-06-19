'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { staggerContainer, scaleIn, reducedVariant } from '@/lib/animations';

const categories = [
  {
    label: 'Ready-to-Wear',
    slug: 'tops',
    image: '/api/placeholder?w=600&h=800&bg=CE8400&fg=1C1004&text=Ready+to+Wear',
    span: 'row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    label: 'Headwear',
    slug: 'headwear',
    image: '/api/placeholder?w=600&h=400&bg=1C1004&fg=CE8400&text=Headwear',
    span: '',
    aspect: 'aspect-[4/3]',
  },
  {
    label: 'Statement Pieces',
    slug: 'statement-pieces',
    image: '/api/placeholder?w=600&h=400&bg=7C1C12&fg=FFEBCD&text=Statement+Pieces',
    span: '',
    aspect: 'aspect-[4/3]',
  },
  {
    label: 'Bottoms',
    slug: 'bottoms',
    image: '/api/placeholder?w=600&h=800&bg=75492B&fg=FFEBCD&text=Bottoms',
    span: 'row-span-2',
    aspect: 'aspect-[3/4]',
  },
  {
    label: 'Jackets',
    slug: 'jackets',
    image: '/api/placeholder?w=600&h=800&bg=CC7722&fg=1C1004&text=Jackets',
    span: 'row-span-2',
    aspect: 'aspect-[3/4]',
  },
];

export default function CollectionsGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduce = useReducedMotion();

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : scaleIn;

  return (
    <section ref={ref} className="bg-dark-wood py-20">
      <div className="px-6 md:px-12 mb-12">
        <p className="label-text text-xs text-nature-brown mb-3">Explore</p>
        <h2 className="font-display text-almond-cream text-4xl md:text-5xl leading-tight">
          Collections
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="px-6 md:px-12 grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]"
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.slug}
            variants={itemVariants}
            className={`relative overflow-hidden group ${cat.span}`}
          >
            <Link href={`/collections?category=${cat.slug}`} className="block w-full h-full">
              <div className="relative w-full h-full">
                <Image
                  src={cat.image}
                  alt={`Ciallade ${cat.label} collection`}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  quality={85}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-dark-wood/40 group-hover:bg-dark-wood/60 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <motion.div
                    initial={{ y: 10, opacity: 0.7 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-display text-almond-cream text-xl md:text-2xl leading-tight mb-2">
                      {cat.label}
                    </p>
                    <p className="label-text text-[10px] text-nature-brown opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View →
                    </p>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
