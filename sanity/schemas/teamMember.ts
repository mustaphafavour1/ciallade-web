import { defineType, defineField } from 'sanity';

/** TEAM MEMBER — one person shown in the About the Team section and /team page. */
export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', title: 'Role / Title', type: 'string' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Short bio', type: 'text', rows: 3 }),
    defineField({
      name: 'instagram',
      title: 'Instagram / link (optional)',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Show in the homepage team preview',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'order', title: 'Display order (0 = first)', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } },
});
