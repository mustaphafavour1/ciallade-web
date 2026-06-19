'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Product, formatPrice } from '@/data/products';
import { fadeUp, staggerContainer, scaleIn, reducedVariant } from '@/lib/animations';

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const shouldReduce = useReducedMotion();

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : fadeUp;
  const imageVariants = shouldReduce ? reducedVariant : scaleIn;

  return (
    <div className="min-h-screen bg-dark-wood pt-24">
      {/* Breadcrumb */}
      <div className="px-6 md:px-12 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link href="/" className="label-text text-[10px] text-almond-cream/40 hover:text-almond-cream transition-colors">Home</Link>
          <span className="text-almond-cream/20 text-xs">/</span>
          <Link href="/collections" className="label-text text-[10px] text-almond-cream/40 hover:text-almond-cream transition-colors">Collections</Link>
          <span className="text-almond-cream/20 text-xs">/</span>
          <span className="label-text text-[10px] text-nature-brown">{product.name}</span>
        </nav>
      </div>

      <div className="px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <div className="relative overflow-hidden bg-coffee-brown/20" style={{ aspectRatio: '3/4' }}>
            <Image
              src={product.images[activeImage]}
              alt={`${product.name} — view ${activeImage + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
              priority
              className="object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`relative flex-1 overflow-hidden border transition-all duration-300 ${
                    activeImage === i ? 'border-nature-brown' : 'border-almond-cream/10 hover:border-almond-cream/30'
                  }`}
                  style={{ aspectRatio: '1/1' }}
                >
                  <Image src={img} alt="" fill sizes="10vw" quality={60} className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product info */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-center lg:py-12"
        >
          <motion.p variants={itemVariants} className="label-text text-xs text-nature-brown mb-4">
            {product.category}
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-display text-almond-cream leading-tight mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}
          >
            {product.name}
          </motion.h1>

          <motion.p variants={itemVariants} className="font-body font-light text-almond-cream/60 text-3xl mb-8">
            {formatPrice(product.price)}
          </motion.p>

          <motion.p variants={itemVariants} className="font-body font-light text-almond-cream/70 text-base leading-relaxed mb-8">
            {product.description}
          </motion.p>

          {/* Size selection */}
          <motion.div variants={itemVariants} className="mb-8">
            <p className="label-text text-xs text-almond-cream/60 mb-4">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  className={`px-4 py-2.5 border font-body text-sm transition-all duration-300 ${
                    selectedSize === size
                      ? 'border-nature-brown bg-nature-brown text-dark-wood'
                      : 'border-almond-cream/20 text-almond-cream/70 hover:border-almond-cream/50 hover:text-almond-cream'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 bg-nature-brown text-dark-wood label-text text-xs py-4 px-8 hover:bg-ochre-brown transition-colors duration-300 disabled:opacity-40"
              disabled={!selectedSize && product.sizes[0] !== 'One Size'}
            >
              {selectedSize || product.sizes[0] === 'One Size' ? 'Add to Cart' : 'Select a Size'}
            </button>
            <button
              aria-label="Add to wishlist"
              className="border border-almond-cream/20 text-almond-cream/60 hover:border-almond-cream/50 hover:text-almond-cream transition-all duration-300 py-4 px-6"
            >
              <HeartIcon />
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-almond-cream/10">
            <p className="label-text text-[10px] text-almond-cream/30 mb-2">Care</p>
            <p className="font-body font-light text-almond-cream/50 text-sm">Dry clean recommended. Handle with intention.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}
