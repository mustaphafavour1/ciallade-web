import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

const SINGLETONS = new Set(['heroSection', 'brandPhilosophy', 'editorial', 'theDifference', 'theFocus']);

export default defineConfig({
  name: 'ciallade-studio',
  title: 'Ciallade Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'replace-with-your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Products').schemaType('product').child(S.documentTypeList('product')),
            S.listItem().title('Collections').schemaType('collection').child(S.documentTypeList('collection')),
            S.divider(),
            S.listItem().title('Testimonials').schemaType('testimonial').child(S.documentTypeList('testimonial')),
            S.listItem().title('Journey Milestones').schemaType('journeyMilestone').child(S.documentTypeList('journeyMilestone')),
            S.divider(),
            S.listItem().title('Hero Section').child(S.editor().schemaType('heroSection').documentId('heroSection')),
            S.listItem().title('Brand Philosophy').child(S.editor().schemaType('brandPhilosophy').documentId('brandPhilosophy')),
            S.listItem().title('Editorial Campaign').child(S.editor().schemaType('editorial').documentId('editorial')),
            S.listItem().title('The Difference').child(S.editor().schemaType('theDifference').documentId('theDifference')),
            S.listItem().title('The Focus').child(S.editor().schemaType('theFocus').documentId('theFocus')),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => prev.filter((t) => !SINGLETONS.has(t.schemaType)),
  },
  document: {
    actions: (prev, ctx) =>
      SINGLETONS.has(ctx.schemaType)
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
});
