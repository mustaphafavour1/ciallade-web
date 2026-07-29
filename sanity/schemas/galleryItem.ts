import { defineType, defineField } from 'sanity';

/**
 * GALLERY ITEM — one image or video shown in the Gallery section and /gallery.
 * For a video, upload an mp4 (or paste an external URL) and give it a poster
 * image so it looks good before it plays.
 */
export default defineType({
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Caption / title (optional)', type: 'string' }),
    defineField({
      name: 'mediaType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Image (for a video, this is the poster/thumbnail)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'video',
      title: 'Video file (mp4)',
      type: 'file',
      options: { accept: 'video/*' },
      hidden: ({ parent }) => parent?.mediaType !== 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Or external video URL (mp4 / hosted)',
      type: 'url',
      hidden: ({ parent }) => parent?.mediaType !== 'video',
      validation: (r) => r.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Show in the homepage gallery preview',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'order', title: 'Display order (0 = first)', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', mediaType: 'mediaType', media: 'image' },
    prepare: ({ title, mediaType, media }) => ({
      title: title || '(untitled)',
      subtitle: mediaType === 'video' ? 'Video' : 'Image',
      media,
    }),
  },
});
