import { defineType, defineField } from 'sanity';

/**
 * Reusable heading shape used by every section on the site.
 * `titleAccent` is the word/phrase rendered in gold with the draw-in underline
 * (the site-wide headline mechanism). It is appended after `title`.
 */
export default defineType({
  name: 'sectionHeading',
  title: 'Section Heading',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow (small label above the title)',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'titleAccent',
      title: 'Accent word (rendered in gold, underlined)',
      type: 'string',
      description: 'The final part of the title. Shown in gold with the underline animation.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'eyebrow' },
  },
});
