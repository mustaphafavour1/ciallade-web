import { defineType, defineField } from 'sanity';

/**
 * PIECE — a single garment/product.
 * Every piece belongs to one Explore collection (its parent) and can be
 * flagged as featured to appear in "The Edit" on the homepage.
 */
export default defineType({
  name: 'piece',
  title: 'Piece',
  type: 'document',
  groups: [
    { name: 'main', title: 'Details', default: true },
    { name: 'commerce', title: 'Price & Stock' },
    { name: 'media', title: 'Images' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'main',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'collection',
      title: 'Collection (parent)',
      type: 'reference',
      group: 'main',
      to: [{ type: 'collection' }],
      description: 'Which Explore collection this piece belongs to.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'main',
    }),
    defineField({
      name: 'details',
      title: 'Additional details',
      type: 'array',
      group: 'main',
      description: 'Free-form spec rows, e.g. "Material" → "100% Nigerian cotton".',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'value', title: 'Value', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured in "The Edit"',
      type: 'boolean',
      group: 'main',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order (0 = first)',
      type: 'number',
      group: 'main',
      initialValue: 0,
    }),

    // ─── Commerce ────────────────────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Price (₦)',
      type: 'number',
      group: 'commerce',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at price (₦, optional — shows as struck through)',
      type: 'number',
      group: 'commerce',
      validation: (r) => r.min(0),
    }),
    defineField({
      name: 'sizes',
      title: 'Available sizes',
      type: 'array',
      group: 'commerce',
      of: [{ type: 'string' }],
      options: {
        list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'S/M', 'L/XL'],
      },
    }),
    defineField({
      name: 'inStock',
      title: 'In stock',
      type: 'boolean',
      group: 'commerce',
      initialValue: true,
    }),

    // ─── Media ───────────────────────────────────────────────────────────────
    defineField({
      name: 'images',
      title: 'Images (first one is the main image)',
      type: 'array',
      group: 'media',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.min(1),
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
    { title: 'Name A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Price high→low', name: 'priceDesc', by: [{ field: 'price', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'name', collection: 'collection.label', price: 'price', media: 'images.0' },
    prepare: ({ title, collection, price, media }) => ({
      title,
      subtitle: [collection, price != null ? `₦${Number(price).toLocaleString('en-NG')}` : null]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
});
