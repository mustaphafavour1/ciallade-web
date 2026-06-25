import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'document',
  fields: [
    defineField({ name: 'seasonBadge', title: 'Season Badge (e.g. NEW COLLECTION · SS 2026)', type: 'string' }),
    defineField({ name: 'headlineLeft', title: 'Left Headline (e.g. Be Yourself.)', type: 'string' }),
    defineField({ name: 'headlineLeftAccent', title: 'Left Headline Accent Word (e.g. Yourself.)', type: 'string' }),
    defineField({ name: 'headlineRight', title: 'Right Headline (e.g. Reinvent Always.)', type: 'string' }),
    defineField({ name: 'headlineRightAccent', title: 'Right Headline Accent Word (e.g. Always.)', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }),
    defineField({ name: 'ctaText', title: 'CTA Button Text', type: 'string' }),
  ],
  preview: {
    select: { title: 'headlineLeft', subtitle: 'headlineRight' },
  },
});
