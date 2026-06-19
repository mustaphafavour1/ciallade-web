// ---------------------------------------------------------------------------
// Cloudinary URL builder for Ciallade
// ---------------------------------------------------------------------------
// Usage:
//   import { cld } from '@/lib/cloudinary'
//   <Image src={cld('ciallade/products/ochre-linen-top', { w: 800, h: 1067 })} />
//
// To activate: set NEXT_PUBLIC_CLOUDINARY_URL in .env.local and remove the
// `unoptimized: true` line from next.config.mjs.
// ---------------------------------------------------------------------------

const BASE = process.env.NEXT_PUBLIC_CLOUDINARY_URL ?? '';

type CldOptions = {
  w?: number;
  h?: number;
  q?: number | 'auto';
  crop?: 'fill' | 'fit' | 'pad' | 'thumb' | 'scale';
  gravity?: 'auto' | 'auto:faces' | 'face' | 'center' | 'north' | 'south';
  format?: 'auto' | 'webp' | 'avif' | 'jpg';
};

export function cld(publicId: string, opts: CldOptions = {}): string {
  const {
    w = 800,
    h = 1067,
    q = 'auto',
    crop = 'fill',
    gravity = 'auto:faces',
    format = 'auto',
  } = opts;

  const transforms = [
    `c_${crop}`,
    `g_${gravity}`,
    `w_${w}`,
    `h_${h}`,
    `q_${q}`,
    `f_${format}`,
    `dpr_auto`,
  ].join(',');

  return `${BASE}/image/upload/${transforms}/${publicId}`;
}

// Presets for common use cases
export const cldProduct = (id: string) => cld(id, { w: 800, h: 1067, gravity: 'auto:faces' });
export const cldHero    = (id: string) => cld(id, { w: 1200, h: 1600, gravity: 'auto' });
export const cldWide    = (id: string) => cld(id, { w: 1440, h: 810, gravity: 'auto', crop: 'fill' });
export const cldSquare  = (id: string) => cld(id, { w: 800, h: 800, gravity: 'auto:faces' });
