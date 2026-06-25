import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'editorial',
  title: 'Editorial Section',
  type: 'document',
  fields: [
    defineField({ name: 'sectionLabel', title: 'Section Label (e.g. SS 2026 Campaign)', type: 'string' }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'subheadline', title: 'Sub-headline (accent text)', type: 'string' }),
    defineField({ name: 'image', title: 'Campaign Image (square)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
    defineField({ name: 'ctaLink', title: 'CTA Link (e.g. /collections)', type: 'string' }),
  ],
  preview: {
    select: { title: 'headline', media: 'image' },
  },
});
