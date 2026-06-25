import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'theFocus',
  title: 'The Focus Section',
  type: 'document',
  fields: [
    defineField({
      name: 'audience',
      title: 'Audience Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Card Title', type: 'string' },
            { name: 'body', title: 'Card Description', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'label', subtitle: 'body' } },
        },
      ],
    }),
    defineField({ name: 'visionLabel', title: 'Vision Label (e.g. 10-Year Vision · 2035)', type: 'string' }),
    defineField({ name: 'visionHeadline', title: 'Vision Headline', type: 'string' }),
    defineField({ name: 'visionAccent', title: 'Vision Headline Accent (e.g. house.)', type: 'string' }),
    defineField({ name: 'visionBody1', title: 'Vision Body Paragraph 1', type: 'text', rows: 3 }),
    defineField({ name: 'visionBody2', title: 'Vision Body Paragraph 2', type: 'text', rows: 3 }),
    defineField({
      name: 'stats',
      title: 'Stats Row',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'stat', title: 'Stat Value (e.g. 10+)', type: 'string' },
            { name: 'label', title: 'Stat Label (e.g. Annual Drops)', type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'The Focus' }),
  },
});
