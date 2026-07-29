#!/usr/bin/env node
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Ciallade — one-shot Sanity seed
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   npm run seed
 *   npm run seed -- --replace-images
 *
 * Fills a fresh Sanity dataset with everything the Ciallade site currently
 * shows, so the Studio opens fully populated instead of empty:
 *
 *   • the "Site Contents" singleton (id: siteContent) — every line of copy
 *   • 5 Explore collections
 *   • 10 pieces (each linked to its collection)
 *   • 4 testimonials
 *   • 6 journey milestones
 *
 * Safe to re-run. Every document uses a deterministic _id and createOrReplace,
 * so a second run updates rather than duplicating. Images the client has
 * uploaded in the Studio are preserved unless --replace-images is passed.
 */

import { createClient } from '@sanity/client';
import { Buffer } from 'node:buffer';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

const argv = process.argv.slice(2);
const REPLACE_IMAGES = argv.includes('--replace-images');
const WANTS_HELP = argv.includes('--help') || argv.includes('-h');

// ─── .env.local loader ────────────────────────────────────────────────────────
// Node does not read .env.local on its own. Tiny parser: skips blanks and
// comments, strips surrounding quotes, never overwrites an already-set var.

function loadEnvFile(file) {
  if (!existsSync(file)) return false;
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    return false;
  }
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const body = line.startsWith('export ') ? line.slice('export '.length).trim() : line;
    const eq = body.indexOf('=');
    if (eq === -1) continue;

    const key = body.slice(0, eq).trim();
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue;

    let value = body.slice(eq + 1).trim();
    const quoted =
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1);

    if (quoted) {
      value = value.slice(1, -1);
    } else {
      // Trailing ` # comment` only counts on unquoted values.
      const hash = value.indexOf(' #');
      if (hash !== -1) value = value.slice(0, hash).trim();
    }

    if (process.env[key] === undefined) process.env[key] = value;
  }
  return true;
}

const ENV_LOCAL = resolve(ROOT, '.env.local');
const foundEnvLocal = loadEnvFile(ENV_LOCAL);
loadEnvFile(resolve(ROOT, '.env')); // secondary, optional

// ─── Credentials + guard rails ────────────────────────────────────────────────

const PLACEHOLDER = /^replace-/i;
const usable = (v) =>
  typeof v === 'string' && v.trim().length > 0 && !PLACEHOLDER.test(v.trim());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const token = process.env.SANITY_API_TOKEN?.trim();

function printUsage() {
  console.log(`
  Ciallade — Sanity seed

    npm run seed                        Seed the dataset (keeps images already in the Studio)
    npm run seed -- --replace-images    Also re-upload every image, overwriting what's there

  Reads NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and
  SANITY_API_TOKEN from ${ENV_LOCAL}
`);
}

function printMissingCredentials(missing) {
  const line = '─'.repeat(72);
  console.error(`
${line}
  Ciallade seed — cannot run yet
${line}

  Missing or still a placeholder: ${missing.join(', ')}
${foundEnvLocal ? '' : `\n  No .env.local file was found at:\n    ${ENV_LOCAL}\n`}
  1. Create (or open) this file:

       ${ENV_LOCAL}

  2. Make sure it contains these three lines, with your own values:

       NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
       NEXT_PUBLIC_SANITY_DATASET=production
       SANITY_API_TOKEN=your-write-token

  Where each value comes from
  ---------------------------

  NEXT_PUBLIC_SANITY_PROJECT_ID
      Go to https://www.sanity.io/manage and click your project.
      The Project ID is on the project overview page — a short code
      like "8kf2p1qz". Copy it exactly.

  NEXT_PUBLIC_SANITY_DATASET
      Almost always "production". Check Datasets in the same project.

  SANITY_API_TOKEN   ← this one MUST allow writing
      Same project → API tab → Tokens → "Add API token".
      Name it "Seed script", choose the **Editor** role (Viewer is
      read-only and will not work), then Save.
      The token is shown ONCE — copy it straight into .env.local.

  3. Save the file and run:

       npm run seed

  Nothing was written to Sanity.
${line}
`);
}

if (WANTS_HELP) {
  printUsage();
  process.exit(0);
}

{
  const missing = [];
  if (!usable(projectId)) missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID');
  if (!usable(token)) missing.push('SANITY_API_TOKEN');
  if (missing.length) {
    printMissingCredentials(missing);
    process.exit(1);
  }
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// ─── Content ──────────────────────────────────────────────────────────────────
// Everything below is the site's current copy, lifted verbatim from the
// component fallbacks and data/products.ts.

/** Same Unsplash helper data/products.ts uses. */
const uns = (id, w = 800, h = 1067) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const PHILOSOPHY_TEXT = `Ciallade exists at the intersection of identity and craft.

We believe clothing is not decoration — it is declaration. Every silhouette we design begins not with a sketch but with a question: who is this person, and what do they need the world to know about them?

Fashion, in its truest form, is a private language made public. The choice of fabric, the fall of a collar, the weight of a lapel — these are not accidents. They are arguments. Arguments for presence. For particularity. For the right to take up space in the world as you truly are.

Nigeria gave us our roots, our palette, our hunger. Africa gave us our proportion — our understanding that beauty is not a size, a shade, or a silhouette borrowed from elsewhere. It is earned, learned, and worn with the confidence of someone who needed no permission to arrive.

We are not competing with the houses of Milan or Paris. We are building something they cannot replicate: a house built on a different inheritance. One that knows the weight of aso-oke and the precision of a bespoke Lagos tailor at midnight before a ceremony. One that carries both.

Ciallade is for those who already know who they are — and simply need clothing that agrees.`;

const PHILOSOPHY_IMAGE = uns('photo-1490481651871-ab68de25d43d', 800, 1000);
const EDITORIAL_IMAGE = uns('photo-1469334031218-e382a71b716b', 800, 1000);

/** Explore categories — labels/slugs/images mirror components/CollectionsGrid.tsx. */
const COLLECTIONS = [
  {
    _id: 'collection-tops',
    label: 'Ready-to-Wear',
    slug: 'tops',
    displayOrder: 0,
    image: uns('photo-1529139574466-a303027c1d8b', 800, 1100),
    description:
      'Everyday silhouettes cut with intention — tops and shirting made to carry a whole day without asking for it.',
  },
  {
    _id: 'collection-headwear',
    label: 'Headwear',
    slug: 'headwear',
    displayOrder: 1,
    image: uns('photo-1576871337622-98d48d1cf531', 800, 1100),
    description:
      'Caps and crowns finished by hand. The last thing you put on, and the first thing anyone sees.',
  },
  {
    _id: 'collection-statement-pieces',
    label: 'Statement Pieces',
    slug: 'statement-pieces',
    displayOrder: 2,
    image: uns('photo-1539109136881-3be0616acf4b', 800, 1100),
    description: 'The centrepieces. Cut for the moments that deserve an entrance.',
  },
  {
    _id: 'collection-bottoms',
    label: 'Bottoms',
    slug: 'bottoms',
    displayOrder: 3,
    image: uns('photo-1509631179647-0177331693ae', 800, 1100),
    description: 'Trousers and shorts drafted for movement — wide, easy, deliberate.',
  },
  {
    _id: 'collection-jackets',
    label: 'Jackets',
    slug: 'jackets',
    displayOrder: 4,
    image: uns('photo-1591047139829-d91aecb6caea', 800, 1100),
    description: 'Outerwear with architecture. Structure you can feel from across the room.',
  },
];

const CATEGORY_TO_COLLECTION = {
  Tops: 'collection-tops',
  Bottoms: 'collection-bottoms',
  Headwear: 'collection-headwear',
  Jackets: 'collection-jackets',
  'Statement Pieces': 'collection-statement-pieces',
};

/**
 * Which size selector each piece shows on its product page. Tops use the top
 * measurement chart, trousers/shorts the bottom chart, caps/headwear are
 * one-size (no size UI), everything else keeps the standard S/M/L chips.
 */
const CATEGORY_TO_SIZE_TYPE = {
  Tops: 'top',
  Bottoms: 'bottom',
  Headwear: 'none',
  Jackets: 'standard',
  'Statement Pieces': 'standard',
};

const MADE_IN = { label: 'Made in', value: 'Lagos, Nigeria' };

/** The 10 products from data/products.ts, plus spec rows for the product page. */
const PIECES = [
  {
    slug: 'ochre-linen-top',
    name: 'Ochre Linen Top',
    category: 'Tops',
    price: 55000,
    images: [uns('photo-1529139574466-a303027c1d8b')],
    description:
      'Structured linen top in warm ochre. Cut for confidence, finished with precision.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
    tags: ['ochre', 'linen', 'top', 'warm', 'minimal'],
    details: [
      { label: 'Material', value: '100% Nigerian-woven linen' },
      { label: 'Care', value: 'Cold hand wash, line dry in shade' },
      MADE_IN,
    ],
  },
  {
    slug: 'dark-wood-oversized-jacket',
    name: 'Dark Wood Oversized Jacket',
    category: 'Jackets',
    price: 145000,
    images: [uns('photo-1591047139829-d91aecb6caea')],
    description:
      'Oversized silhouette in deep dark wood tones. The jacket that speaks before you do.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    tags: ['dark wood', 'brown', 'jacket', 'oversized', 'wool', 'statement'],
    details: [
      { label: 'Material', value: 'Structured wool-cotton blend, fully lined' },
      { label: 'Care', value: 'Dry clean only' },
      MADE_IN,
    ],
  },
  {
    slug: 'woven-cap-caramel',
    name: 'Woven Cap — Caramel',
    category: 'Headwear',
    price: 35000,
    images: [uns('photo-1588850561407-ed78c282e89b', 800, 800)],
    description: 'Hand-woven cap in rich caramel tones. One size, every story.',
    sizes: ['One Size'],
    featured: true,
    tags: ['caramel', 'brown', 'cap', 'headwear', 'raffia', 'summer'],
    details: [
      { label: 'Material', value: 'Hand-woven raffia straw' },
      { label: 'Care', value: 'Spot clean, store flat' },
      MADE_IN,
    ],
  },
  {
    slug: 'maroon-wide-leg-trousers',
    name: 'Maroon Wide-Leg Trousers',
    category: 'Bottoms',
    price: 78000,
    images: [uns('photo-1509631179647-0177331693ae')],
    description: 'Wide-leg cut in deep maroon. Effortless movement, deliberate presence.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
    tags: ['maroon', 'red', 'trousers', 'bottoms', 'wide-leg', 'viscose'],
    details: [
      { label: 'Material', value: 'Fluid viscose twill' },
      { label: 'Care', value: 'Cool machine wash, warm iron' },
      MADE_IN,
    ],
  },
  {
    slug: 'almond-draped-shirt',
    name: 'Almond Draped Shirt',
    category: 'Tops',
    price: 62000,
    images: [uns('photo-1515886657613-9f3515b0c78f')],
    description: 'Fluid draped shirt in almond cream. Softness with structure.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    tags: ['almond', 'cream', 'shirt', 'top', 'silk', 'draped', 'soft'],
    details: [
      { label: 'Material', value: 'Washed silk-cotton' },
      { label: 'Care', value: 'Cold hand wash, cool iron' },
      MADE_IN,
    ],
  },
  {
    slug: 'autumn-orange-bucket-hat',
    name: 'Autumn Orange Bucket Hat',
    category: 'Headwear',
    price: 28000,
    images: [uns('photo-1556306535-38febf6782dc', 800, 800)],
    description: 'Bold bucket hat in autumn orange. Make your entrance from the crown down.',
    sizes: ['S/M', 'L/XL'],
    featured: false,
    tags: ['orange', 'bucket hat', 'headwear', 'cotton', 'bold', 'summer'],
    details: [
      { label: 'Material', value: 'Garment-dyed cotton canvas' },
      { label: 'Care', value: 'Spot clean only' },
      MADE_IN,
    ],
  },
  {
    slug: 'coffee-linen-shorts',
    name: 'Coffee Linen Shorts',
    category: 'Bottoms',
    price: 45000,
    images: [uns('photo-1485230895905-ec40ba36b9bc')],
    description: 'Tailored linen shorts in warm coffee. Relaxed silhouette, refined finish.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
    tags: ['coffee', 'brown', 'shorts', 'bottoms', 'linen', 'relaxed', 'summer'],
    details: [
      { label: 'Material', value: '100% linen' },
      { label: 'Care', value: 'Cool machine wash, line dry' },
      MADE_IN,
    ],
  },
  {
    slug: 'byra-cap-nature-brown',
    name: 'BYRA Cap — Nature Brown',
    category: 'Headwear',
    price: 32000,
    images: [uns('photo-1576871337622-98d48d1cf531', 800, 800)],
    description:
      'Signature BYRA cap embroidered with the geometric line motif. A crown for the self-defined.',
    sizes: ['One Size'],
    featured: true,
    tags: ['nature brown', 'brown', 'cap', 'headwear', 'byra', 'embroidered', 'signature'],
    details: [
      { label: 'Material', value: 'Brushed cotton twill, embroidered BYRA motif' },
      { label: 'Care', value: 'Spot clean, air dry' },
      MADE_IN,
    ],
  },
  {
    slug: 'reinvent-statement-coat',
    name: 'Reinvent Statement Coat',
    category: 'Statement Pieces',
    price: 180000,
    images: [uns('photo-1539109136881-3be0616acf4b')],
    description: 'The centerpiece. An ochre statement coat cut to command every room.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    tags: ['ochre', 'coat', 'statement', 'wool', 'formal', 'occasion'],
    details: [
      { label: 'Material', value: 'Ochre wool melton, satin lined' },
      { label: 'Care', value: 'Dry clean only' },
      MADE_IN,
    ],
  },
  {
    slug: 'structured-boxy-tee',
    name: 'Structured Boxy Tee',
    category: 'Tops',
    price: 38000,
    images: [uns('photo-1503342394128-c104d54dba01')],
    description: 'Heavyweight jersey tee in a boxy silhouette. The foundation of every look.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    tags: ['tee', 't-shirt', 'top', 'cotton', 'boxy', 'everyday', 'minimal'],
    details: [
      { label: 'Material', value: '240gsm heavyweight cotton jersey' },
      { label: 'Care', value: 'Cool machine wash, tumble dry low' },
      MADE_IN,
    ],
  },
];

/** From components/Testimonials.tsx. */
const TESTIMONIALS = [
  {
    _id: 'testimonial-amara-okafor',
    name: 'Amara Okafor',
    location: 'Lagos, Nigeria',
    quote:
      "I wore the Ochre Linen Top to my presentation and walked in feeling like myself for the first time in years. Ciallade doesn't just dress you — it declares you.",
    avatar: uns('photo-1531746020798-e6953c6e8e04', 400, 500),
  },
  {
    _id: 'testimonial-kwame-asante',
    name: 'Kwame Asante',
    location: 'Accra, Ghana',
    quote:
      "The craftsmanship on the Dark Wood Jacket is unlike anything I've found locally or internationally. Structured, warm, and entirely mine.",
    avatar: uns('photo-1506794778202-cad84cf45f1d', 400, 500),
  },
  {
    _id: 'testimonial-zara-bello',
    name: 'Zara Bello',
    location: 'Abuja, Nigeria',
    quote:
      "Every piece feels like it was made for the version of me I'm always becoming. The BYRA Cap is my identity on display.",
    avatar: uns('photo-1531123897727-8f129e1688ce', 400, 500),
  },
  {
    _id: 'testimonial-david-mensah',
    name: 'David Mensah',
    location: 'London, UK',
    quote:
      'I visited Lagos and discovered Ciallade. Brought the Statement Coat back to London and nothing has started more conversations.',
    avatar: uns('photo-1507003211169-0a1dd7228f2d', 400, 500),
  },
];

/** From components/JourneySoFar.tsx. */
const MILESTONES = [
  {
    _id: 'milestone-2020',
    year: '2020',
    title: 'The Conviction',
    body: 'Founded in Lagos on a single belief: African luxury on its own terms, borrowing nothing from anywhere.',
  },
  {
    _id: 'milestone-2021',
    year: '2021',
    title: 'First Stitch',
    body: 'The inaugural collection — 12 pieces, each one a vocabulary word in a new fashion language.',
  },
  {
    _id: 'milestone-2022',
    year: '2022',
    title: 'The Atelier',
    body: 'Our Lagos studio opened. A space where every pattern is deliberate and every cut is a sentence.',
  },
  {
    _id: 'milestone-2023',
    year: '2023',
    title: 'Beyond Borders',
    body: 'First international stockists. Ciallade began speaking to the world from its own ground.',
  },
  {
    _id: 'milestone-2024',
    year: '2024',
    title: 'Digital Flagship',
    body: 'Launched online. A luxury experience now accessible globally, permanently rooted locally.',
  },
  {
    _id: 'milestone-2026',
    year: '2026',
    title: 'SS 2026 Campaign',
    body: 'Define the moment. Own the frame. A new vocabulary for a new season.',
  },
];

/** From components/TheDifference.tsx. */
const DIFFERENCE_ITEMS = [
  {
    symbol: '⊙',
    ciallade: 'Crafted with deliberate intention.',
    contrast: 'Mass-produced. Silent. Assumed.',
  },
  {
    symbol: '◈',
    ciallade: 'African luxury, on its own terms.',
    contrast: 'European luxury as the standard.',
  },
  {
    symbol: '∿',
    ciallade: 'Fashion as language. You are what you wear.',
    contrast: 'Fashion as trend. Follow or fade.',
  },
  {
    symbol: '⊕',
    ciallade: 'Defining your own silhouette.',
    contrast: 'Fitting into the mold.',
  },
];

/** From components/TheFocus.tsx. */
const FOCUS_AUDIENCE = [
  {
    label: 'The Self-Defined',
    body: '25–45 year-olds who know who they are and want clothes that agree.',
  },
  {
    label: 'The Culturally Rooted',
    body: 'Those who carry Africa with them and want luxury that does the same.',
  },
  {
    label: 'The Intentional Dresser',
    body: 'People who choose, never follow. Every piece purchased is a declaration.',
  },
];

const FOCUS_STATS = [
  { stat: '3', label: 'Flagship Cities' },
  { stat: '10+', label: 'Annual Drops' },
  { stat: '50+', label: 'Countries Reached' },
];

/** From components/FooterRibbon.tsx. */
const FOOTER_NAV = [
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// Placeholder handles — the owner replaces these in Studio → Footer & Social.
const FOOTER_SOCIAL = [
  { platform: 'instagram', url: 'https://instagram.com/ciallade' },
  { platform: 'whatsapp', url: 'https://wa.me/2348000000000' },
  { platform: 'email', url: 'mailto:hello@ciallade.com' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const counters = {
  created: 0,
  updated: 0,
  uploaded: 0,
  keptImages: 0,
  skippedImages: [],
};

/** url → asset _id (or null when the upload failed). One upload per URL per run. */
const assetCache = new Map();

/** Every id we touch, so we can tell "created" from "updated" and reuse images. */
const ALL_IDS = [
  'siteContent',
  ...COLLECTIONS.map((c) => c._id),
  ...PIECES.map((p) => `piece-${p.slug}`),
  ...TESTIMONIALS.map((t) => t._id),
  ...MILESTONES.map((m) => m._id),
];

/** Published + draft snapshots of everything we're about to write. */
const existingDocs = new Map();

function snapshot(id) {
  return existingDocs.get(id) ?? existingDocs.get(`drafts.${id}`) ?? null;
}

function alreadyExists(id) {
  return existingDocs.has(id) || existingDocs.has(`drafts.${id}`);
}

const hasAsset = (v) => Boolean(v && v.asset && v.asset._ref);

/**
 * Keep an image the client may have uploaded in the Studio. Returns the stored
 * value when one exists (and --replace-images was not passed), else null.
 */
function keepExistingImage(id, pick) {
  if (REPLACE_IMAGES) return null;
  const doc = snapshot(id);
  if (!doc) return null;
  const value = pick(doc);
  if (hasAsset(value)) {
    counters.keptImages++;
    return value;
  }
  return null;
}

function keepExistingImageArray(id, pick) {
  if (REPLACE_IMAGES) return null;
  const doc = snapshot(id);
  if (!doc) return null;
  const arr = pick(doc);
  if (Array.isArray(arr) && arr.some(hasAsset)) {
    counters.keptImages += arr.filter(hasAsset).length;
    return arr;
  }
  return null;
}

/** Fetch the bytes and push them into Sanity's asset store. Never fatal. */
async function uploadImage(url, filename) {
  if (assetCache.has(url)) return assetCache.get(url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (!buffer.length) throw new Error('empty response body');

    const asset = await client.assets.upload('image', buffer, { filename });
    assetCache.set(url, asset._id);
    counters.uploaded++;
    return asset._id;
  } catch (err) {
    assetCache.set(url, null);
    counters.skippedImages.push({ filename, url, reason: err?.message ?? String(err) });
    console.warn(`      ! image skipped — ${filename}: ${err?.message ?? err}`);
    return null;
  }
}

/** Turn an asset id into the image value Sanity stores. */
function imageValue(assetId, key) {
  if (!assetId) return null;
  const value = { _type: 'image', asset: { _type: 'reference', _ref: assetId } };
  return key ? { _key: key, ...value } : value;
}

/** Upload `url` and return an image field value — or the existing/kept one. */
async function resolveImage(kept, url, filename, key) {
  if (kept) return key && !kept._key ? { ...kept, _key: key } : kept;
  return imageValue(await uploadImage(url, filename), key);
}

const withKeys = (items, prefix) =>
  items.map((item, i) => ({ _key: `${prefix}-${i}`, ...item }));

const heading = (eyebrow, title, titleAccent) => ({
  _type: 'sectionHeading',
  eyebrow,
  title,
  titleAccent,
});

/** Drop null/undefined fields so we never write empty image objects. */
function clean(obj) {
  if (Array.isArray(obj)) return obj.map(clean);
  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === null || v === undefined) continue;
      out[k] = clean(v);
    }
    return out;
  }
  return obj;
}

async function writeDoc(doc, label) {
  const isNew = !alreadyExists(doc._id);
  await client.createOrReplace(clean(doc));
  if (isNew) counters.created++;
  else counters.updated++;
  console.log(`   ${isNew ? '+' : '↻'} ${label}`);
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function preload() {
  const ids = [...ALL_IDS, ...ALL_IDS.map((id) => `drafts.${id}`)];
  const docs = await client.fetch('*[_id in $ids]', { ids }, { perspective: 'raw' });
  for (const doc of docs) existingDocs.set(doc._id, doc);
  return docs.length;
}

async function seedCollections() {
  console.log('\nExplore / Collections');
  for (const c of COLLECTIONS) {
    const image = await resolveImage(
      keepExistingImage(c._id, (d) => d.image),
      c.image,
      `ciallade-collection-${c.slug}.jpg`
    );
    await writeDoc(
      {
        _id: c._id,
        _type: 'collection',
        label: c.label,
        slug: { _type: 'slug', current: c.slug },
        description: c.description,
        displayOrder: c.displayOrder,
        image,
      },
      c.label
    );
  }
}

async function seedPieces() {
  console.log('\nPieces');
  for (const [i, p] of PIECES.entries()) {
    const _id = `piece-${p.slug}`;
    const collectionRef = CATEGORY_TO_COLLECTION[p.category];
    if (!collectionRef) throw new Error(`No collection mapped for category "${p.category}"`);

    let images = keepExistingImageArray(_id, (d) => d.images);
    if (!images) {
      const resolved = [];
      for (const [j, url] of p.images.entries()) {
        const value = imageValue(
          await uploadImage(url, `ciallade-${p.slug}-${j + 1}.jpg`),
          `img-${j}`
        );
        if (value) resolved.push(value);
      }
      images = resolved.length ? resolved : null;
    }

    await writeDoc(
      {
        _id,
        _type: 'piece',
        name: p.name,
        slug: { _type: 'slug', current: p.slug },
        collection: { _type: 'reference', _ref: collectionRef },
        description: p.description,
        tags: p.tags,
        details: withKeys(p.details, 'det'),
        featured: p.featured,
        displayOrder: i,
        price: p.price,
        sizes: p.sizes,
        sizeType: CATEGORY_TO_SIZE_TYPE[p.category] ?? 'standard',
        inStock: true,
        images,
      },
      `${p.name}${p.featured ? '  ★ featured' : ''}`
    );
  }
}

async function seedTestimonials() {
  console.log('\nTestimonials');
  for (const [i, t] of TESTIMONIALS.entries()) {
    const avatar = await resolveImage(
      keepExistingImage(t._id, (d) => d.avatar),
      t.avatar,
      `ciallade-${t._id}.jpg`
    );
    await writeDoc(
      {
        _id: t._id,
        _type: 'testimonial',
        name: t.name,
        location: t.location,
        quote: t.quote,
        order: i,
        avatar,
      },
      `${t.name} — ${t.location}`
    );
  }
}

async function seedMilestones() {
  console.log('\nJourney Milestones');
  for (const [i, m] of MILESTONES.entries()) {
    await writeDoc(
      {
        _id: m._id,
        _type: 'journeyMilestone',
        year: m.year,
        title: m.title,
        body: m.body,
        order: i,
      },
      `${m.year} — ${m.title}`
    );
  }
}

async function seedSiteContent() {
  console.log('\nSite Contents (singleton)');

  const philosophyImage = await resolveImage(
    keepExistingImage('siteContent', (d) => d.philosophy?.image),
    PHILOSOPHY_IMAGE,
    'ciallade-philosophy.jpg'
  );
  const editorialImage = await resolveImage(
    keepExistingImage('siteContent', (d) => d.editorial?.image),
    EDITORIAL_IMAGE,
    'ciallade-editorial-ss26.jpg'
  );

  await writeDoc(
    {
      _id: 'siteContent',
      _type: 'siteContent',

      hero: {
        seasonBadge: 'NEW COLLECTION · SS 2026',
        headlineLeft: 'Be',
        headlineLeftAccent: 'Yourself.',
        headlineRight: 'Reinvent',
        headlineRightAccent: 'Always.',
        subtitle:
          'A luxury Nigerian fashion brand\ncrafted for those who define themselves.',
        ctaText: "Explore Ciallade's Collection",
        ctaLink: '/collections',
      },

      featured: heading('Featured Pieces', 'The', 'Edit'),

      philosophy: {
        heading: heading('Our Foundation', 'The philosophy\nbehind every', 'stitch.'),
        innerHeading: heading('Brand Philosophy', 'Wear who', 'you are.'),
        philosophyText: PHILOSOPHY_TEXT,
        image: philosophyImage,
        linkText: 'Our Story',
        linkHref: '/about',
      },

      explore: heading('Explore', '', 'Collections'),

      editorial: {
        sectionLabel: 'SS 2026 Campaign',
        headline: 'Define the moment.',
        subheadline: 'Own the frame.',
        image: editorialImage,
        ctaText: 'Explore the Campaign',
        ctaLink: '/collections',
      },

      testimonials: heading('Worn & Witnessed', 'What our', 'customers say'),

      journey: heading('Since 2020', 'The Journey So', 'Far'),

      difference: {
        heading: heading('Why Ciallade', 'The', 'Difference'),
        items: withKeys(DIFFERENCE_ITEMS, 'diff'),
      },

      focus: {
        heading: heading("Who We're For", 'The', 'Focus'),
        audience: withKeys(FOCUS_AUDIENCE, 'aud'),
        visionLabel: '10-Year Vision · 2035',
        visionHeadline: 'The definitive\nAfrican luxury',
        visionAccent: 'house.',
        visionBody1:
          'By 2035, Ciallade will be recognized globally as the definitive African luxury fashion house — not a brand that competes with European houses, but one that has built its own category entirely.',
        visionBody2:
          'Rooted in Nigeria. Worn across continents. Belonging to no trend, no season, no movement but its own.',
        stats: withKeys(FOCUS_STATS, 'stat'),
      },

      footer: {
        wordmark: 'CIALLADE',
        eyebrow: 'The Ciallade Promise',
        headlineLine1: 'Be Yourself.',
        headlineLine2: 'Reinvent Always.',
        ctaText: 'Explore the Collection',
        ctaLink: '/collections',
        tagline: '© 2026 Ciallade. Be Yourself, Reinvent Always.',
        navLinks: withKeys(FOOTER_NAV, 'nav'),
        socialLinks: withKeys(FOOTER_SOCIAL, 'social'),
      },
    },
    'Site Contents'
  );
}

function printSummary() {
  const line = '─'.repeat(72);
  const total = counters.created + counters.updated;

  console.log(`\n${line}`);
  console.log('  Done.');
  console.log(`${line}`);
  console.log(`  Documents   ${total} written · ${counters.created} created · ${counters.updated} updated`);
  console.log(
    `  Images      ${counters.uploaded} uploaded · ${counters.keptImages} kept from Studio · ${counters.skippedImages.length} skipped`
  );

  if (counters.skippedImages.length) {
    console.log('\n  Skipped images (documents were still saved, just without them):');
    for (const s of counters.skippedImages) {
      console.log(`    · ${s.filename} — ${s.reason}`);
    }
    console.log('\n  Re-run `npm run seed -- --replace-images` to try those uploads again,');
    console.log('  or just add the images by hand in the Studio.');
  }

  if (!REPLACE_IMAGES && counters.keptImages > 0) {
    console.log('\n  Images already in the Studio were left untouched.');
    console.log('  Pass --replace-images to overwrite them with the originals.');
  }

  console.log(`\n  Open the Studio at /studio to see everything.`);
  console.log(`${line}\n`);
}

async function main() {
  const line = '─'.repeat(72);
  console.log(`\n${line}`);
  console.log('  Ciallade → Sanity seed');
  console.log(`${line}`);
  console.log(`  Project   ${projectId}`);
  console.log(`  Dataset   ${dataset}`);
  console.log(
    `  Images    ${REPLACE_IMAGES ? 're-uploading everything (--replace-images)' : 'keeping any already in the Studio'}`
  );

  let found;
  try {
    found = await preload();
  } catch (err) {
    const status = err?.statusCode ?? err?.response?.statusCode;
    console.error('\n  Could not reach Sanity.\n');
    if (status === 401 || status === 403) {
      console.error('  The API token was rejected. Check that:');
      console.error('    · SANITY_API_TOKEN was copied in full, with no spaces or quotes');
      console.error('    · the token has the **Editor** role (Viewer cannot write)');
      console.error('    · the token belongs to project ' + projectId);
    } else if (status === 404) {
      console.error(`  Project "${projectId}" or dataset "${dataset}" was not found.`);
      console.error('  Check both values in https://www.sanity.io/manage');
    } else {
      console.error(`  ${err?.message ?? err}`);
    }
    console.error('\n  Nothing was written.\n');
    process.exit(1);
  }

  console.log(`  Existing  ${found} matching document${found === 1 ? '' : 's'} in the dataset\n`);

  await seedCollections();
  await seedPieces();
  await seedTestimonials();
  await seedMilestones();
  await seedSiteContent();

  printSummary();
}

main().catch((err) => {
  console.error('\n  Seed failed.\n');
  console.error(`  ${err?.message ?? err}`);
  if (err?.details?.description) console.error(`  ${err.details.description}`);
  console.error('\n  Some documents may already have been written — the script is safe');
  console.error('  to re-run once the problem is fixed.\n');
  process.exit(1);
});
