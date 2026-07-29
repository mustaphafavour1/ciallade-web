import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail, { type DetailPiece } from './ProductDetail';
import { getProductBySlug, products, formatPrice, type Product } from '@/data/products';
import { fetchPieceBySlug, fetchPieceSlugs, type SanityPiece } from '@/sanity/lib/fetch';

export const revalidate = 60; // Re-fetch Sanity content at most once a minute

type Props = { params: { slug: string } };

function fromSanity(piece: SanityPiece): DetailPiece {
  return {
    id: piece._id,
    slug: piece.slug,
    name: piece.name,
    category: piece.collectionLabel?.trim() || 'Ciallade',
    price: piece.price,
    compareAtPrice: piece.compareAtPrice,
    description: piece.description,
    images: piece.images ?? [],
    sizes: piece.sizes ?? [],
    details: piece.details ?? [],
    inStock: piece.inStock,
    sizeType: piece.sizeType ?? 'standard',
  };
}

function fromStatic(product: Product): DetailPiece {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description,
    images: product.images,
    sizes: product.sizes,
    sizeType: product.sizeType ?? 'standard',
  };
}

/** Sanity first, static mock data as the fallback, null when neither has it. */
async function resolvePiece(slug: string): Promise<DetailPiece | null> {
  const piece = await fetchPieceBySlug(slug);
  if (piece?.slug) return fromSanity(piece);
  const product = getProductBySlug(slug);
  return product ? fromStatic(product) : null;
}

export async function generateStaticParams() {
  const cmsSlugs = await fetchPieceSlugs();
  const all = products
    .map((p) => p.slug)
    .concat((cmsSlugs ?? []).map((s) => s.slug));

  // Union of both sources, de-duplicated without allocating a Set.
  const seen: Record<string, true> = {};
  const unique: string[] = [];
  for (const slug of all) {
    if (!slug || seen[slug]) continue;
    seen[slug] = true;
    unique.push(slug);
  }

  return unique.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const piece = await resolvePiece(params.slug);
  if (!piece) return { title: 'Not Found' };
  return {
    title: piece.name,
    description: piece.description
      ? `${piece.description} — ${formatPrice(piece.price)}`
      : `${piece.name} — ${formatPrice(piece.price)}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const piece = await resolvePiece(params.slug);
  if (!piece) notFound();
  return <ProductDetail product={piece} />;
}
