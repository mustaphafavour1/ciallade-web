'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import SectionHeading, { toLines } from '@/components/SectionHeading';
import type { SanityGalleryItem, SanityGallerySection } from '@/sanity/lib/fetch';

const UNS = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/**
 * Built-in sample archive so the section reads as populated before any Sanity
 * gallery docs exist. Every photo id is one already proven-good elsewhere in the
 * repo; the lone video demonstrates the video path (poster + autoplay), and if
 * its host is ever unreachable the <video> simply shows its poster image.
 */
const SAMPLE_ITEMS: SanityGalleryItem[] = [
  { _id: 'g-sample-1', title: 'Atelier Light', mediaType: 'image', image: UNS('photo-1469334031218-e382a71b716b', 1200, 1500) },
  {
    _id: 'g-sample-2',
    title: 'Campaign Reel',
    mediaType: 'video',
    image: UNS('photo-1529139574466-a303027c1d8b', 1200, 1500),
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  { _id: 'g-sample-3', title: 'Structured Tailoring', mediaType: 'image', image: UNS('photo-1539109136881-3be0616acf4b', 1000, 1000) },
  { _id: 'g-sample-4', title: 'Golden Hour', mediaType: 'image', image: UNS('photo-1576871337622-98d48d1cf531', 900, 1300) },
  { _id: 'g-sample-5', title: 'Editorial Study', mediaType: 'image', image: UNS('photo-1509631179647-0177331693ae', 1200, 800) },
  { _id: 'g-sample-6', title: 'Statement Silhouette', mediaType: 'image', image: UNS('photo-1591047139829-d91aecb6caea', 900, 1300) },
];

// Editorial mosaic: each string is one tile's footprint — mobile (2-col) base
// with a desktop (4-col) override — so a few tiles read larger for premium
// rhythm. Fixed auto-row heights keep the grid from reflowing as media loads.
const MOSAIC = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1 md:col-span-2',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1 md:col-span-1 md:row-span-2',
  'col-span-1 row-span-1 md:col-span-2',
  'col-span-1 row-span-1',
];

const ZOOM = 'transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]';

export default function GalleryPreview({
  items,
  section,
}: {
  items?: SanityGalleryItem[] | null;
  section?: SanityGallerySection | null;
}) {
  const reduce = useReducedMotion();

  const source = items?.length ? items : SAMPLE_ITEMS;
  const featured = source.filter((i) => i.featuredOnHome !== false);
  const preview = (featured.length ? featured : source)
    .filter((i) => i.image || i.video || i.videoUrl)
    .slice(0, 6);

  const intro =
    section?.intro?.trim() ||
    'Moments from the atelier and the campaign — a living archive of the Ciallade world, in stills and motion.';

  return (
    <section className="relative bg-near-black wash-dark py-32 md:py-44 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 md:mb-16 max-w-2xl">
          <SectionHeading
            eyebrow={section?.heading?.eyebrow ?? 'In Focus'}
            lines={toLines(section?.heading?.title, section?.heading?.titleAccent, 'The', 'Gallery')}
            className="text-almond-cream text-5xl md:text-6xl"
            align="left"
            as="h2"
          />
          {intro && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.2 }}
              className="mt-6 font-body text-[15px] leading-relaxed text-almond-cream/55"
            >
              {intro}
            </motion.p>
          )}
        </div>

        {/* Mosaic */}
        <div className="grid grid-flow-dense grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3 auto-rows-[150px] md:auto-rows-[200px]">
          {preview.map((item, i) => {
            const isVideo = item.mediaType === 'video';
            const videoSrc = isVideo ? item.video || item.videoUrl : undefined;
            const title = item.title?.trim();

            return (
              <motion.div
                key={item._id}
                className={`${MOSAIC[i % MOSAIC.length]} min-w-0`}
                initial={{ opacity: 0, y: reduce ? 0 : 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : i * 0.08 }}
              >
                <Link
                  href="/gallery"
                  aria-label={title ? `${title} — open the gallery` : 'Open the gallery'}
                  className="group relative block h-full w-full overflow-hidden rounded-[2px] bg-dark-wood"
                >
                  {isVideo && videoSrc ? (
                    <video
                      className={`absolute inset-0 h-full w-full object-cover ${ZOOM}`}
                      poster={item.image}
                      src={videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : item.image ? (
                    <Image
                      src={item.image}
                      alt={title || 'Ciallade gallery'}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className={`object-cover ${ZOOM}`}
                    />
                  ) : null}

                  {/* Video badge */}
                  {isVideo && (
                    <span className="pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-dark-wood/70 px-2.5 py-1 label-text text-[9px] text-almond-cream backdrop-blur-sm">
                      <Play size={9} className="fill-current" />
                      Video
                    </span>
                  )}

                  {/* Hover scrim + title */}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-wood/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  {title && (
                    <span className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 translate-y-2 font-display text-lg leading-tight text-almond-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {title}
                    </span>
                  )}

                  {/* Gold hairline frame on hover */}
                  <span className="pointer-events-none absolute inset-0 z-20 border border-nature-brown/0 transition-colors duration-500 group-hover:border-nature-brown/60" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-3 border border-nature-brown/60 text-nature-brown label-text text-xs px-10 py-4 transition-colors duration-300 hover:bg-nature-brown hover:text-dark-wood"
          >
            View full gallery
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
