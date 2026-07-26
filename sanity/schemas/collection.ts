import { defineType, defineField } from 'sanity';

/**
 * COLLECTION — one item in the Explore section (Ready-to-Wear, Headwear, …).
 * Its children are the Pieces that reference it; in the Studio you can drill
 * into a collection to see and add the pieces that live under it.
 */
export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      title: 'Label (e.g. Ready-to-Wear)',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'label', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Collection image (portrait works best)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order (0 = first)',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'label', subtitle: 'slug.current', media: 'image' },
  },
});
