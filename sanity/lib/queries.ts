import { groq } from 'next-sanity';

/**
 * Sanity's CDN resizes on the fly via query params, so we append them right in
 * the projection. `auto=format` serves WebP/AVIF where supported.
 */
const IMG = (w: number) => `"?auto=format&fit=max&q=80&w=${w}"`;

const HEADING = `{ eyebrow, title, titleAccent }`;

/** The one singleton holding every piece of copy on the site. */
export const siteContentQuery = groq`
  *[_type == "siteContent"][0]{
    hero{
      seasonBadge, headlineLeft, headlineLeftAccent,
      headlineRight, headlineRightAccent, subtitle, ctaText, ctaLink
    },
    featured${HEADING},
    philosophy{
      heading${HEADING},
      innerHeading${HEADING},
      philosophyText,
      "imageUrl": image.asset->url + ${IMG(1200)},
      linkText, linkHref
    },
    explore${HEADING},
    editorial{
      sectionLabel, headline, subheadline,
      "imageUrl": image.asset->url + ${IMG(1200)},
      ctaText, ctaLink
    },
    testimonials${HEADING},
    journey${HEADING},
    difference{
      heading${HEADING},
      items[]{ symbol, ciallade, contrast }
    },
    focus{
      heading${HEADING},
      audience[]{ label, body },
      visionLabel, visionHeadline, visionAccent, visionBody1, visionBody2,
      stats[]{ stat, label },
      "visionBgUrl": visionBgImage.asset->url + ${IMG(1600)}
    },
    team{ heading${HEADING}, intro },
    gallery{ heading${HEADING}, intro },
    footer{
      wordmark, eyebrow, headlineLine1, headlineLine2,
      ctaText, ctaLink, tagline,
      navLinks[]{ label, href },
      socialLinks[]{ platform, url }
    },
    branding{
      "logoUrl": logo.asset->url,
      "faviconUrl": favicon.asset->url,
      "appleIconUrl": appleIcon.asset->url,
      "ogImageUrl": ogImage.asset->url,
      siteTitle, siteDescription
    }
  }
`;

/** Team members shown on the homepage preview + /team. */
export const teamQuery = groq`
  *[_type == "teamMember"] | order(order asc, name asc){
    _id, name, role, bio, instagram, featuredOnHome,
    "photo": photo.asset->url + ${IMG(800)}
  }
`;

/** Gallery items (images + videos) for the homepage preview + /gallery. */
export const galleryQuery = groq`
  *[_type == "galleryItem"] | order(order asc){
    _id, title, mediaType, featuredOnHome, videoUrl,
    "image": image.asset->url + ${IMG(1200)},
    "video": video.asset->url
  }
`;

const PIECE_FIELDS = `
  _id, name, "slug": slug.current, price, compareAtPrice, description,
  sizes, sizeType, inStock, featured, displayOrder, tags,
  details[]{ label, value },
  "images": images[].asset->url,
  "collectionLabel": collection->label,
  "collectionSlug": collection->slug.current
`;

export const piecesQuery = groq`
  *[_type == "piece"] | order(displayOrder asc, name asc){ ${PIECE_FIELDS} }
`;

export const featuredPiecesQuery = groq`
  *[_type == "piece" && featured == true] | order(displayOrder asc, name asc)[0...8]{ ${PIECE_FIELDS} }
`;

export const pieceBySlugQuery = groq`
  *[_type == "piece" && slug.current == $slug][0]{ ${PIECE_FIELDS} }
`;

export const pieceSlugsQuery = groq`
  *[_type == "piece" && defined(slug.current)]{ "slug": slug.current }
`;

/** Explore items, each with its child pieces nested underneath. */
export const collectionsQuery = groq`
  *[_type == "collection"] | order(displayOrder asc){
    _id, label, "slug": slug.current, description,
    "imageUrl": image.asset->url + ${IMG(1200)},
    "pieces": *[_type == "piece" && collection._ref == ^._id] | order(displayOrder asc, name asc){
      ${PIECE_FIELDS}
    }
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc){
    _id, name, location, quote,
    "avatar": avatar.asset->url + ${IMG(600)}
  }
`;

export const milestonesQuery = groq`
  *[_type == "journeyMilestone"] | order(order asc){ _id, year, title, body }
`;
