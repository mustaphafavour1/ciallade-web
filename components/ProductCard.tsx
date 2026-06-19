'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product, formatPrice } from '@/data/products';
import { fadeUp, reducedVariant } from '@/lib/animations';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const shouldReduce = useReducedMotion();

  const variant = shouldReduce ? reducedVariant : fadeUp;

  return (
    <motion.article
      variants={variant}
      transition={{ delay: index * 0.1 }}
      className="group flex-shrink-0"
    >
      <Link href={`/collections/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-dark-wood" style={{ aspectRatio: '3/4' }}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 25vw"
            quality={85}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-dark-wood/0 group-hover:bg-dark-wood/30 transition-all duration-500" />
        </div>
        <div className="pt-4 pb-2">
          <p className="label-text text-xs text-nature-brown mb-1">{product.category}</p>
          <h3 className="font-display text-almond-cream text-xl leading-tight group-hover:text-nature-brown transition-colors duration-300">
            {product.name}
          </h3>
          <p className="mt-1 font-body font-light text-almond-cream/70 text-sm">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
