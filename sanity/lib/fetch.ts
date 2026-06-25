import { sanityClient } from './client';
import {
  productsQuery, featuredProductsQuery, testimonialQuery, milestonesQuery,
  heroQuery, philosophyQuery, collectionsQuery, editorialQuery,
  differenceQuery, focusQuery,
} from './queries';

async function safeFetch<T>(query: string): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query);
  } catch {
    return null;
  }
}

export const fetchProducts = () => safeFetch<SanityProduct[]>(productsQuery);
export const fetchFeaturedProducts = () => safeFetch<SanityProduct[]>(featuredProductsQuery);
export const fetchTestimonials = () => safeFetch<SanityTestimonial[]>(testimonialQuery);
export const fetchMilestones = () => safeFetch<SanityMilestone[]>(milestonesQuery);
export const fetchHero = () => safeFetch<SanityHero>(heroQuery);
export const fetchPhilosophy = () => safeFetch<SanityPhilosophy>(philosophyQuery);
export const fetchCollections = () => safeFetch<SanityCollection[]>(collectionsQuery);
export const fetchEditorial = () => safeFetch<SanityEditorial>(editorialQuery);
export const fetchDifference = () => safeFetch<SanityDifference>(differenceQuery);
export const fetchFocus = () => safeFetch<SanityFocus>(focusQuery);

// ── Shared Sanity types ───────────────────────────────────────────────────────

export type SanityProduct = {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
  description: string;
  sizes: string[];
  featured: boolean;
  inStock: boolean;
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

export type SanityHero = {
  seasonBadge: string;
  headlineLeft: string;
  headlineLeftAccent: string;
  headlineRight: string;
  headlineRightAccent: string;
  subtitle: string;
  ctaText: string;
};

export type SanityPhilosophy = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  philosophyText: string;
  imageUrl: string;
};

export type SanityCollection = {
  _id: string;
  label: string;
  slug: string;
  imageUrl: string;
};

export type SanityEditorial = {
  sectionLabel: string;
  headline: string;
  subheadline: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
};

export type SanityDifference = {
  items: { symbol: string; ciallade: string; contrast: string }[];
};

export type SanityFocus = {
  audience: { label: string; body: string }[];
  visionLabel: string;
  visionHeadline: string;
  visionAccent: string;
  visionBody1: string;
  visionBody2: string;
  stats: { stat: string; label: string }[];
};
