import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { toLines } from '@/lib/heading';
import { fetchGallery, fetchSiteContent, type SanityGalleryItem } from '@/sanity/lib/fetch';

export const revalidate = 60; // Re-fetch Sanity content at most once a minute
export const metadata: Metadata = { title: 'Gallery' };

const UNS = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/**
 * Same built-in archive the homepage preview falls back to, so /gallery is never
 * empty before Sanity holds any galleryItem docs. Photo ids are all proven-good
 * in-repo; the single video shows the video path and degrades to its poster if
 * the external mp4 host is unreachable.
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

// Varied aspect ratios cycled across tiles give the masonry its editorial rhythm;
// CSS columns then flow any number of tiles with no gaps.
const ASPECTS = ['3 / 4', '4 / 5', '1 / 1', '5 / 6', '3 / 4', '4 / 5', '1 / 1', '5 / 4'];

export default async function GalleryPage() {
  const [gallery, site] = await Promise.all([fetchGallery(), fetchSiteContent()]);

  const heading = site?.gallery?.heading;
  const intro =
    site?.gallery?.intro?.trim() ||
    'The full Ciallade archive — campaign stills, atelier studies and moving image. Every frame, be yourself, reinvent always.';

  const source = gallery?.length ? gallery : SAMPLE_ITEMS;
  const items = source.filter((i) => i.image || i.video || i.videoUrl);

  return (
    <main className="min-h-screen bg-dark-wood wash-dark pt-28">
      <div className="px-6 md:px-12 pb-24 md:pb-32">
        {/* Header */}
        <header className="mx-auto max-w-6xl mb-14 md:mb-20">
          <Link
            href="/"
            className="group mb-8 inline-flex items-center gap-2 label-text text-[11px] text-almond-cream/60 transition-colors duration-300 hover:text-nature-brown"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Back home
          </Link>

          <SectionHeading
            eyebrow={heading?.eyebrow ?? 'In Focus'}
            lines={toLines(heading?.title, heading?.titleAccent, 'The', 'Gallery')}
            className="text-almond-cream text-5xl md:text-7xl"
            align="left"
            as="h1"
          />

          <p className="mt-6 max-w-xl font-body text-[15px] leading-relaxed text-almond-cream/55">
            {intro}
          </p>
        </header>

        {/* Masonry — images + videos */}
        <div className="mx-auto max-w-6xl [column-gap:0.75rem] columns-1 sm:columns-2 lg:columns-3">
          {items.map((item) => {
            const isVideo = item.mediaType === 'video';
            const videoSrc = isVideo ? item.video || item.videoUrl : undefined;
            const title = item.title?.trim();
            const aspect = ASPECTS[hashIndex(item._id) % ASPECTS.length];

            return (
              <figure
                key={item._id}
                className="group relative mb-3 block break-inside-avoid overflow-hidden rounded-[2px] bg-near-black"
                style={{ aspectRatio: aspect }}
              >
                {isVideo && videoSrc ? (
                  <video
                    className="absolute inset-0 h-full w-full object-cover"
                    poster={item.image}
                    src={videoSrc}
                    controls
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
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                ) : null}

                {/* Video badge */}
                {isVideo && (
                  <figcaption className="pointer-events-none absolute left-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-dark-wood/70 px-2.5 py-1 label-text text-[9px] text-almond-cream backdrop-blur-sm">
                    <Play size={9} className="fill-current" />
                    Video
                  </figcaption>
                )}

                {/* Title on hover (images only — videos keep their native controls clear) */}
                {title && !isVideo && (
                  <>
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-wood/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 translate-y-2 font-display text-lg leading-tight text-almond-cream opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {title}
                    </span>
                  </>
                )}

                {/* Gold hairline frame on hover */}
                <span className="pointer-events-none absolute inset-0 z-20 border border-nature-brown/0 transition-colors duration-500 group-hover:border-nature-brown/50" />
              </figure>
            );
          })}
        </div>
      </div>
    </main>
  );
}

/** Stable per-item aspect pick: a tiny string hash keeps the same tile the same
 *  shape across renders without needing the array index. */
function hashIndex(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}
