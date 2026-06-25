import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'journeyMilestone',
  title: 'Journey Milestone',
  type: 'document',
  fields: [
    defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
  ],
  preview: {
    select: { title: 'year', subtitle: 'title' },
  },
});
