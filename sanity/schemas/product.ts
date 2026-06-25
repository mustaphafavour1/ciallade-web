import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Tops', value: 'Tops' },
          { title: 'Bottoms', value: 'Bottoms' },
          { title: 'Headwear', value: 'Headwear' },
          { title: 'Jackets', value: 'Jackets' },
          { title: 'Statement Pieces', value: 'Statement Pieces' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'price', title: 'Price (₦)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'S/M', 'L/XL'] },
    }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'images.0' },
  },
});
