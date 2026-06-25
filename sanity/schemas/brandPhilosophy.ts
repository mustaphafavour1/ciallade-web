import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'brandPhilosophy',
  title: 'Brand Philosophy',
  type: 'document',
  fields: [
    defineField({ name: 'sectionLabel', title: 'Section Label (small text above title)', type: 'string' }),
    defineField({ name: 'title', title: 'Section Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Section Subtitle', type: 'string' }),
    defineField({ name: 'philosophyText', title: 'Philosophy Text', type: 'text', rows: 8, validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Side Image', type: 'image', options: { hotspot: true } }),
  ],
  preview: {
    select: { title: 'title' },
  },
});
