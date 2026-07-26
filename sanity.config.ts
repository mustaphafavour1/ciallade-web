import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';

const SINGLETON_ID = 'siteContent';

export default defineConfig({
  name: 'ciallade-studio',
  title: 'Ciallade Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'replace-with-your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  /**
   * Embedded in the Next.js site the Studio lives at /studio, but the
   * standalone Sanity-hosted Studio serves from the domain root. The deploy
   * script sets SANITY_STUDIO_BASEPATH=/ so one config serves both.
   */
  basePath: process.env.SANITY_STUDIO_BASEPATH || '/studio',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Ciallade')
          .items([
            // ── The singleton: every piece of text on the site ──
            S.listItem()
              .title('Site Contents')
              .id('siteContent')
              .child(
                S.editor()
                  .id('siteContent')
                  .schemaType('siteContent')
                  .documentId(SINGLETON_ID)
                  .title('Site Contents')
              ),

            S.divider(),

            // ── Explore collections, each drilling into its child pieces ──
            S.listItem()
              .title('Explore / Collections')
              .schemaType('collection')
              .child(
                S.documentTypeList('collection')
                  .title('Collections')
                  .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                  .child((collectionId) =>
                    S.list()
                      .title('Collection')
                      .items([
                        S.listItem()
                          .title('Edit collection')
                          .child(
                            S.document().schemaType('collection').documentId(collectionId)
                          ),
                        S.listItem()
                          .title('Pieces in this collection')
                          .child(
                            S.documentList()
                              .title('Pieces')
                              .schemaType('piece')
                              .filter('_type == "piece" && collection._ref == $collectionId')
                              .params({ collectionId })
                              .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
                              // New pieces created here are pre-linked to this collection
                              .initialValueTemplates([])
                          ),
                      ])
                  )
              ),

            // ── All pieces ──
            S.listItem()
              .title('Pieces')
              .schemaType('piece')
              .child(
                S.documentTypeList('piece')
                  .title('All Pieces')
                  .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
              ),

            // ── Featured subset shown in "The Edit" ──
            S.listItem()
              .title('Featured Pieces (The Edit)')
              .schemaType('piece')
              .child(
                S.documentList()
                  .title('Featured Pieces')
                  .schemaType('piece')
                  .filter('_type == "piece" && featured == true')
                  .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
              ),

            S.divider(),

            S.listItem()
              .title('Testimonials')
              .schemaType('testimonial')
              .child(
                S.documentTypeList('testimonial')
                  .title('Testimonials')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),

            S.listItem()
              .title('Journey Milestones')
              .schemaType('journeyMilestone')
              .child(
                S.documentTypeList('journeyMilestone')
                  .title('Journey Milestones')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // The singleton can't be created or duplicated from the "new document" menu
    templates: (prev) => prev.filter((t) => t.schemaType !== 'siteContent'),
  },
  document: {
    // Remove delete/duplicate actions on the singleton
    actions: (prev, ctx) =>
      ctx.schemaType === 'siteContent'
        ? prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : prev,
  },
});
