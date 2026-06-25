import { groq } from 'next-sanity';

export const productsQuery = groq`
  *[_type == "product"] | order(name asc) {
    _id, name, "slug": slug.current, category, price, inStock, featured,
    "images": images[].asset->url,
    description, sizes
  }
`;

export const featuredProductsQuery = groq`
  *[_type == "product" && featured == true] | order(name asc)[0...6] {
    _id, name, "slug": slug.current, category, price,
    "images": images[].asset->url,
    description, sizes
  }
`;

export const testimonialQuery = groq`
  *[_type == "testimonial"] | order(order asc) {
    _id, name, location, quote,
    "avatar": avatar.asset->url
  }
`;

export const milestonesQuery = groq`
  *[_type == "journeyMilestone"] | order(order asc) {
    _id, year, title, body
  }
`;

export const heroQuery = groq`
  *[_type == "heroSection"][0] {
    seasonBadge, headlineLeft, headlineLeftAccent,
    headlineRight, headlineRightAccent, subtitle, ctaText
  }
`;

export const philosophyQuery = groq`
  *[_type == "brandPhilosophy"][0] {
    sectionLabel, title, subtitle, philosophyText,
    "imageUrl": image.asset->url
  }
`;

export const collectionsQuery = groq`
  *[_type == "collection"] | order(displayOrder asc) {
    _id, label, "slug": slug.current,
    "imageUrl": image.asset->url
  }
`;

export const editorialQuery = groq`
  *[_type == "editorial"][0] {
    sectionLabel, headline, subheadline,
    "imageUrl": image.asset->url,
    ctaText, ctaLink
  }
`;

export const differenceQuery = groq`
  *[_type == "theDifference"][0] {
    items[] { symbol, ciallade, contrast }
  }
`;

export const focusQuery = groq`
  *[_type == "theFocus"][0] {
    audience[] { label, body },
    visionLabel, visionHeadline, visionAccent,
    visionBody1, visionBody2,
    stats[] { stat, label }
  }
`;
