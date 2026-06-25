import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'collection',
  title: 'Collection Category',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label (e.g. Ready-to-Wear)', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'URL Slug (e.g. tops)',
      type: 'slug',
      options: { source: 'label', maxLength: 50 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'image', title: 'Category Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'displayOrder', title: 'Display Order (0 = first)', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'slug.current', media: 'image' },
  },
});
