import createImageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export function urlFor(source: any): string {
  if (!builder || !source) return '';
  return builder.image(source).auto('format').url();
}

export function urlForSize(source: any, width: number, height: number): string {
  if (!builder || !source) return '';
  return builder.image(source).width(width).height(height).auto('format').fit('crop').url();
}
