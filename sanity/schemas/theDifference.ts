import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'theDifference',
  title: 'The Difference Section',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Comparison Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'symbol', title: 'Symbol/Glyph', type: 'string' },
            { name: 'ciallade', title: 'Ciallade Statement', type: 'string' },
            { name: 'contrast', title: 'Industry Statement (shown crossed out)', type: 'string' },
          ],
          preview: { select: { title: 'ciallade', subtitle: 'contrast' } },
        },
      ],
    }),
  ],
  preview: {
    select: { title: '_type' },
    prepare: () => ({ title: 'The Difference' }),
  },
});
