import CollectionsBrowser, { type BrowsePiece, type CategoryTab } from './CollectionsBrowser';
import { products, type Product } from '@/data/products';
import { fetchPieces, fetchCollections, type SanityPiece } from '@/sanity/lib/fetch';

export const revalidate = 60; // Re-fetch Sanity content at most once a minute

/** Category tabs used when Sanity has nothing — the original hardcoded list. */
const STATIC_CATEGORIES: Product['category'][] = [
  'Tops',
  'Bottoms',
  'Headwear',
  'Jackets',
  'Statement Pieces',
];

/** Must match ALL_SLUG in CollectionsBrowser. */
const ALL_SLUG = 'all';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fromSanity(piece: SanityPiece): BrowsePiece {
  const label = piece.collectionLabel?.trim() || 'Ciallade';
  return {
    id: piece._id,
    slug: piece.slug,
    name: piece.name,
    price: piece.price,
    images: piece.images ?? [],
    category: label,
    categorySlug: piece.collectionSlug?.trim() || slugify(label),
    description: piece.description ?? '',
    tags: piece.tags ?? [],
  };
}

function fromStatic(product: Product): BrowsePiece {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    images: product.images,
    category: product.category,
    categorySlug: slugify(product.category),
    description: product.description,
    tags: product.tags ?? [],
  };
}

/** Last-resort tabs: derive them from the pieces when no collection docs exist. */
function tabsFromPieces(pieces: BrowsePiece[]): CategoryTab[] {
  const seen: Record<string, true> = {};
  const tabs: CategoryTab[] = [];
  for (const piece of pieces) {
    if (!piece.categorySlug || seen[piece.categorySlug]) continue;
    seen[piece.categorySlug] = true;
    tabs.push({ label: piece.category, slug: piece.categorySlug });
  }
  return tabs;
}

export default async function CollectionsPage() {
  const [cmsPieces, cmsCollections] = await Promise.all([fetchPieces(), fetchCollections()]);

  const hasCmsPieces = !!cmsPieces?.length;
  const pieces: BrowsePiece[] = hasCmsPieces
    ? cmsPieces.map(fromSanity)
    : products.map(fromStatic);

  let tabs: CategoryTab[];
  if (!hasCmsPieces) {
    tabs = STATIC_CATEGORIES.map((label) => ({ label, slug: slugify(label) }));
  } else if (cmsCollections?.length) {
    tabs = cmsCollections.map((c) => ({ label: c.label, slug: c.slug?.trim() || slugify(c.label) }));
  } else {
    tabs = tabsFromPieces(pieces);
  }

  const categories: CategoryTab[] = [{ label: 'All', slug: ALL_SLUG }, ...tabs];

  return <CollectionsBrowser pieces={pieces} categories={categories} />;
}
