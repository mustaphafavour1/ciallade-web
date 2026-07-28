import { sanityClient } from './client';
import {
  siteContentQuery,
  piecesQuery,
  featuredPiecesQuery,
  pieceBySlugQuery,
  pieceSlugsQuery,
  collectionsQuery,
  testimonialsQuery,
  milestonesQuery,
} from './queries';

/**
 * Every fetch is failure-tolerant: with no credentials, an unreachable API, or
 * an empty dataset it resolves to null, and each component falls back to its
 * built-in sample content. The site therefore never hard-fails on Sanity.
 */
async function safeFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query, params ?? {});
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[sanity] query failed, using fallback content:', err);
    }
    return null;
  }
}

// ── Fetchers ──────────────────────────────────────────────────────────────────

export const fetchSiteContent = () => safeFetch<SanitySiteContent>(siteContentQuery);
export const fetchPieces = () => safeFetch<SanityPiece[]>(piecesQuery);
export const fetchFeaturedPieces = () => safeFetch<SanityPiece[]>(featuredPiecesQuery);
export const fetchPieceBySlug = (slug: string) =>
  safeFetch<SanityPiece>(pieceBySlugQuery, { slug });
export const fetchPieceSlugs = () => safeFetch<{ slug: string }[]>(pieceSlugsQuery);
export const fetchCollections = () => safeFetch<SanityCollection[]>(collectionsQuery);
export const fetchTestimonials = () => safeFetch<SanityTestimonial[]>(testimonialsQuery);
export const fetchMilestones = () => safeFetch<SanityMilestone[]>(milestonesQuery);

// ── Types ─────────────────────────────────────────────────────────────────────

export type SanityHeading = {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
};

export type SanityHero = {
  seasonBadge?: string;
  headlineLeft?: string;
  headlineLeftAccent?: string;
  headlineRight?: string;
  headlineRightAccent?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

export type SanityPhilosophy = {
  heading?: SanityHeading;
  innerHeading?: SanityHeading;
  philosophyText?: string;
  imageUrl?: string;
  linkText?: string;
  linkHref?: string;
};

export type SanityEditorial = {
  sectionLabel?: string;
  headline?: string;
  subheadline?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
};

export type SanityDifference = {
  heading?: SanityHeading;
  items?: { symbol?: string; ciallade: string; contrast: string }[];
};

export type SanityFocus = {
  heading?: SanityHeading;
  audience?: { label: string; body: string }[];
  visionLabel?: string;
  visionHeadline?: string;
  visionAccent?: string;
  visionBody1?: string;
  visionBody2?: string;
  stats?: { stat: string; label: string }[];
};

export type SanityFooter = {
  wordmark?: string;
  eyebrow?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  ctaText?: string;
  ctaLink?: string;
  tagline?: string;
  navLinks?: { label: string; href: string }[];
  socialLinks?: { platform: string; url: string }[];
};

export type SanitySiteContent = {
  hero?: SanityHero;
  featured?: SanityHeading;
  philosophy?: SanityPhilosophy;
  explore?: SanityHeading;
  editorial?: SanityEditorial;
  testimonials?: SanityHeading;
  journey?: SanityHeading;
  difference?: SanityDifference;
  focus?: SanityFocus;
  footer?: SanityFooter;
};

export type SanityPiece = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  sizes?: string[];
  inStock?: boolean;
  featured?: boolean;
  displayOrder?: number;
  tags?: string[];
  details?: { label: string; value: string }[];
  images?: string[];
  collectionLabel?: string;
  collectionSlug?: string;
};

export type SanityCollection = {
  _id: string;
  label: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  pieces?: SanityPiece[];
};

export type SanityTestimonial = {
  _id: string;
  name: string;
  location: string;
  quote: string;
  avatar: string;
};

export type SanityMilestone = {
  _id: string;
  year: string;
  title: string;
  body: string;
};
