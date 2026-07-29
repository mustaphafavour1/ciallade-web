'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Ruler } from 'lucide-react';
import { formatPrice } from '@/data/products';
import { fadeUp, staggerContainer, scaleIn, reducedVariant } from '@/lib/animations';
import OrderOverlay from '@/components/checkout/OrderOverlay';
import EnquiryOverlay from '@/components/checkout/EnquiryOverlay';
import SizePicker from '@/components/checkout/SizePicker';
import {
  countChosen,
  isMeasurementType,
  summarizeMeasurements,
  type MeasurementSelection,
  type SizeType,
} from '@/lib/sizeCharts';

/**
 * One shape for the detail view. Sanity pieces and the static mock products are
 * both normalized into it by the page, so this component never branches on
 * where the data came from — every CMS-only field is optional.
 */
export type DetailPiece = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  images: string[];
  sizes: string[];
  details?: { label: string; value: string }[];
  inStock?: boolean;
  /** Which size UI to show. Defaults to 'standard' (the S/M/L chips). */
  sizeType?: 'standard' | 'top' | 'bottom' | 'both' | 'none';
};

/** Rendered when a CMS piece has no image yet, so <Image> always has a src. */
const FALLBACK_IMAGE = '/api/placeholder?w=900&h=1200&text=Ciallade';

export default function ProductDetail({ product }: { product: DetailPiece }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [orderOpen, setOrderOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [measurements, setMeasurements] = useState<MeasurementSelection>({});
  const [orderNudged, setOrderNudged] = useState(false);
  const shouldReduce = useReducedMotion();

  const containerVariants = shouldReduce ? {} : staggerContainer;
  const itemVariants = shouldReduce ? reducedVariant : fadeUp;
  const imageVariants = shouldReduce ? reducedVariant : scaleIn;

  const images = product.images.length ? product.images : [FALLBACK_IMAGE];
  const sizes = product.sizes ?? [];
  const details = product.details ?? [];
  const outOfStock = product.inStock === false;
  // Only strike through a compare-at price that is genuinely higher.
  const compareAtPrice =
    product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice : null;

  const sizeType: SizeType = product.sizeType ?? 'standard';
  const measurementBased = isMeasurementType(sizeType);
  const isNone = sizeType === 'none';

  // Title-cased summary for the page, uppercase for the forwarded order record.
  const pageSummary = measurementBased ? summarizeMeasurements(sizeType, measurements) : null;
  const orderSummary = measurementBased
    ? summarizeMeasurements(sizeType, measurements, { uppercase: true })
    : null;
  const anyMeasurementChosen = measurementBased && countChosen(sizeType, measurements) > 0;

  // Standard S/M/L chips only gate the order button. "One Size" or measurement /
  // one-size pieces can be ordered straight away.
  const requiresSize = sizeType === 'standard' && sizes.length > 0 && sizes[0] !== 'One Size';
  const orderDisabled = outOfStock || (requiresSize && !selectedSize);
  const orderLabel = outOfStock
    ? 'Out of Stock'
    : requiresSize && !selectedSize
      ? 'Select a Size'
      : 'Order This Piece';

  // Measurements never hard-block payment. The one nudge: the first order click
  // with nothing measured opens the picker instead of the order overlay.
  const handleOrderClick = () => {
    if (measurementBased && !anyMeasurementChosen && !orderNudged) {
      setOrderNudged(true);
      setPickerOpen(true);
      return;
    }
    setOrderOpen(true);
  };

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
              src={images[activeImage] ?? images[0]}
              alt={`${product.name} — view ${activeImage + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={85}
              priority
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
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
            {compareAtPrice && (
              <span className="ml-3 align-middle text-xl text-almond-cream/30 line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
          </motion.p>

          {product.description && (
            <motion.p variants={itemVariants} className="font-body font-light text-almond-cream/70 text-base leading-relaxed mb-8">
              {product.description}
            </motion.p>
          )}

          {/* Size selection — standard S/M/L chips */}
          {sizeType === 'standard' && sizes.length > 0 && (
            <motion.div variants={itemVariants} className="mb-8">
              <p className="label-text text-xs text-almond-cream/60 mb-4">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
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
          )}

          {/* Size selection — measurement-based (top / bottom / both) */}
          {measurementBased && (
            <motion.div variants={itemVariants} className="mb-8">
              <p className="label-text text-xs text-almond-cream/60 mb-4">Your Measurements</p>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-2.5 border border-almond-cream/25 text-almond-cream/85 label-text text-[11px] py-3.5 px-6 hover:border-nature-brown hover:text-nature-brown transition-all duration-300"
              >
                <Ruler size={15} strokeWidth={1.5} />
                {anyMeasurementChosen ? 'Edit Your Measurements' : 'Specify Your Measurements'}
              </button>

              {anyMeasurementChosen && pageSummary ? (
                <div className="mt-4 border-l-2 border-nature-brown/60 pl-4 py-1">
                  <p className="font-body font-light text-almond-cream/75 text-sm leading-relaxed">
                    {pageSummary.text}
                  </p>
                  {!pageSummary.complete && (
                    <p className="mt-1.5 text-[11px] text-almond-cream/45 font-body">
                      Some measurements aren&apos;t set yet — we&apos;ll confirm them with you.
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-almond-cream/45 font-body max-w-md">
                  Recommended — set your measurements for a tailored fit. You can also confirm
                  them with us after ordering.
                </p>
              )}
            </motion.div>
          )}

          {/* CTA — order + enquiry */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleOrderClick}
              disabled={orderDisabled}
              className="flex-1 bg-nature-brown text-dark-wood label-text text-xs py-4 px-8 hover:bg-ochre-brown transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {orderLabel}
            </button>
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="flex-1 border border-almond-cream/25 text-almond-cream/80 label-text text-xs py-4 px-8 hover:border-nature-brown hover:text-nature-brown transition-all duration-300"
            >
              Make an Enquiry
            </button>
          </motion.div>

          {/* CMS spec rows */}
          {details.length > 0 && (
            <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-almond-cream/10">
              <p className="label-text text-[10px] text-almond-cream/30 mb-4">Details</p>
              <dl className="flex flex-col">
                {details.map((row, i) => (
                  <div
                    key={`${row.label}-${i}`}
                    className="flex items-baseline justify-between gap-6 py-2.5 border-b border-almond-cream/5 last:border-b-0"
                  >
                    <dt className="label-text text-[10px] text-almond-cream/40">{row.label}</dt>
                    <dd className="font-body font-light text-almond-cream/60 text-sm text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-almond-cream/10">
            <p className="label-text text-[10px] text-almond-cream/30 mb-2">Care</p>
            <p className="font-body font-light text-almond-cream/50 text-sm">Dry clean recommended. Handle with intention.</p>
          </motion.div>
        </motion.div>
      </div>

      <OrderOverlay
        open={orderOpen}
        onClose={() => setOrderOpen(false)}
        piece={{
          name: product.name,
          price: product.price,
          slug: product.slug,
          size: measurementBased ? null : isNone ? 'One Size' : selectedSize,
          category: product.category,
          sizeSummary: orderSummary?.text ?? null,
          sizeComplete: orderSummary ? orderSummary.complete : undefined,
          sizeMissing: orderSummary?.missing,
        }}
      />
      {measurementBased && (
        <SizePicker
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          sizeType={sizeType}
          value={measurements}
          onChange={(selection) => setMeasurements(selection)}
        />
      )}
      <EnquiryOverlay
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        piece={{ name: product.name, category: product.category }}
      />
    </div>
  );
}
