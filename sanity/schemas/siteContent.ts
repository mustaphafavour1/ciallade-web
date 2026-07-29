import { defineType, defineField } from 'sanity';

/**
 * SITE CONTENTS — the single source of truth for every piece of text on the site.
 * A singleton: exactly one of these documents exists (id: "siteContent").
 * Organised into tabs (groups) so the editor isn't one endless scroll.
 */
export default defineType({
  name: 'siteContent',
  title: 'Site Contents',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'featured', title: 'The Edit' },
    { name: 'philosophy', title: 'Philosophy' },
    { name: 'explore', title: 'Explore' },
    { name: 'editorial', title: 'Editorial' },
    { name: 'testimonials', title: 'Testimonials' },
    { name: 'journey', title: 'Journey' },
    { name: 'difference', title: 'The Difference' },
    { name: 'focus', title: 'The Focus' },
    { name: 'team', title: 'Team' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'footer', title: 'Footer & Social' },
    { name: 'branding', title: 'Branding & SEO' },
  ],
  fields: [
    // ─── HERO ────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'seasonBadge', title: 'Season badge (e.g. NEW COLLECTION · SS 2026)', type: 'string' }),
        defineField({ name: 'headlineLeft', title: 'Left headline (e.g. "Be")', type: 'string' }),
        defineField({ name: 'headlineLeftAccent', title: 'Left headline accent (e.g. "Yourself.")', type: 'string' }),
        defineField({ name: 'headlineRight', title: 'Right headline (e.g. "Reinvent")', type: 'string' }),
        defineField({ name: 'headlineRightAccent', title: 'Right headline accent (e.g. "Always.")', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle (use line breaks)', type: 'text', rows: 2 }),
        defineField({ name: 'ctaText', title: 'CTA button text', type: 'string' }),
        defineField({ name: 'ctaLink', title: 'CTA link', type: 'string', initialValue: '/collections' }),
      ],
    }),

    // ─── THE EDIT (featured pieces) ──────────────────────────────────────────
    defineField({
      name: 'featured',
      title: 'The Edit — section heading',
      type: 'sectionHeading',
      group: 'featured',
      description: 'The featured pieces shown here are managed under "Featured Pieces".',
    }),

    // ─── BRAND PHILOSOPHY ────────────────────────────────────────────────────
    defineField({
      name: 'philosophy',
      title: 'Brand Philosophy',
      type: 'object',
      group: 'philosophy',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Section heading', type: 'sectionHeading' }),
        defineField({ name: 'innerHeading', title: 'Inner heading (beside the text)', type: 'sectionHeading' }),
        defineField({
          name: 'philosophyText',
          title: 'Philosophy text (the long scroll-filled passage)',
          type: 'text',
          rows: 12,
        }),
        defineField({ name: 'image', title: 'Side image', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'linkText', title: 'Link text', type: 'string', initialValue: 'Our Story' }),
        defineField({ name: 'linkHref', title: 'Link href', type: 'string', initialValue: '/about' }),
      ],
    }),

    // ─── EXPLORE / COLLECTIONS ───────────────────────────────────────────────
    defineField({
      name: 'explore',
      title: 'Explore — section heading',
      type: 'sectionHeading',
      group: 'explore',
      description: 'The categories shown here are managed under "Explore / Collections".',
    }),

    // ─── EDITORIAL CAMPAIGN ──────────────────────────────────────────────────
    defineField({
      name: 'editorial',
      title: 'Editorial Campaign',
      type: 'object',
      group: 'editorial',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'sectionLabel', title: 'Eyebrow (e.g. SS 2026 Campaign)', type: 'string' }),
        defineField({ name: 'headline', title: 'Headline (first line)', type: 'string' }),
        defineField({ name: 'subheadline', title: 'Second line (gold accent)', type: 'string' }),
        defineField({ name: 'image', title: 'Campaign image (portrait 4:5)', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'ctaText', title: 'CTA text', type: 'string' }),
        defineField({ name: 'ctaLink', title: 'CTA link', type: 'string', initialValue: '/collections' }),
      ],
    }),

    // ─── TESTIMONIALS ────────────────────────────────────────────────────────
    defineField({
      name: 'testimonials',
      title: 'Testimonials — section heading',
      type: 'sectionHeading',
      group: 'testimonials',
      description: 'The individual testimonials are managed under "Testimonials".',
    }),

    // ─── JOURNEY ─────────────────────────────────────────────────────────────
    defineField({
      name: 'journey',
      title: 'Journey — section heading',
      type: 'sectionHeading',
      group: 'journey',
      description: 'The milestones are managed under "Journey Milestones".',
    }),

    // ─── THE DIFFERENCE ──────────────────────────────────────────────────────
    defineField({
      name: 'difference',
      title: 'The Difference',
      type: 'object',
      group: 'difference',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Section heading', type: 'sectionHeading' }),
        defineField({
          name: 'items',
          title: 'Comparison statements',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'symbol', title: 'Symbol / glyph', type: 'string' },
                { name: 'ciallade', title: 'Ciallade statement (shown above the line)', type: 'string' },
                { name: 'contrast', title: 'Industry statement (shown struck through, below)', type: 'string' },
              ],
              preview: { select: { title: 'ciallade', subtitle: 'contrast' } },
            },
          ],
        }),
      ],
    }),

    // ─── THE FOCUS ───────────────────────────────────────────────────────────
    defineField({
      name: 'focus',
      title: 'The Focus',
      type: 'object',
      group: 'focus',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Section heading', type: 'sectionHeading' }),
        defineField({
          name: 'audience',
          title: 'Audience cards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Card title', type: 'string' },
                { name: 'body', title: 'Card description', type: 'text', rows: 3 },
              ],
              preview: { select: { title: 'label', subtitle: 'body' } },
            },
          ],
        }),
        defineField({ name: 'visionLabel', title: 'Vision eyebrow (e.g. 10-Year Vision · 2035)', type: 'string' }),
        defineField({ name: 'visionHeadline', title: 'Vision headline (use line breaks)', type: 'text', rows: 2 }),
        defineField({ name: 'visionAccent', title: 'Vision headline accent (gold)', type: 'string' }),
        defineField({ name: 'visionBody1', title: 'Vision paragraph 1', type: 'text', rows: 3 }),
        defineField({ name: 'visionBody2', title: 'Vision paragraph 2', type: 'text', rows: 3 }),
        defineField({
          name: 'stats',
          title: 'Stats (numbers count up on scroll)',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'stat', title: 'Value (e.g. 50+)', type: 'string' },
                { name: 'label', title: 'Label (e.g. Countries Reached)', type: 'string' },
              ],
              preview: { select: { title: 'stat', subtitle: 'label' } },
            },
          ],
        }),
        defineField({
          name: 'visionBgImage',
          title: 'Vision background image / pattern (optional)',
          type: 'image',
          description: 'Sits behind the 10-Year Vision block, dimmed for legibility. Falls back to the built-in treatment when empty.',
          options: { hotspot: true },
        }),
      ],
    }),

    // ─── TEAM ────────────────────────────────────────────────────────────────
    defineField({
      name: 'team',
      title: 'About the Team',
      type: 'object',
      group: 'team',
      options: { collapsible: true, collapsed: false },
      description: 'The people are managed under "Team Members". This is just the section heading + intro.',
      fields: [
        defineField({ name: 'heading', title: 'Section heading', type: 'sectionHeading' }),
        defineField({ name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3 }),
      ],
    }),

    // ─── GALLERY ─────────────────────────────────────────────────────────────
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'object',
      group: 'gallery',
      options: { collapsible: true, collapsed: false },
      description: 'The images/videos are managed under "Gallery Items". This is just the section heading + intro.',
      fields: [
        defineField({ name: 'heading', title: 'Section heading', type: 'sectionHeading' }),
        defineField({ name: 'intro', title: 'Intro paragraph', type: 'text', rows: 3 }),
      ],
    }),

    // ─── FOOTER & SOCIAL ─────────────────────────────────────────────────────
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'wordmark', title: 'Giant background wordmark', type: 'string', initialValue: 'CIALLADE' }),
        defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
        defineField({ name: 'headlineLine1', title: 'Closing headline — line 1', type: 'string' }),
        defineField({ name: 'headlineLine2', title: 'Closing headline — line 2 (gold accent)', type: 'string' }),
        defineField({ name: 'ctaText', title: 'CTA button text', type: 'string' }),
        defineField({ name: 'ctaLink', title: 'CTA link', type: 'string', initialValue: '/collections' }),
        defineField({ name: 'tagline', title: 'Tagline / copyright line', type: 'string' }),
        defineField({
          name: 'navLinks',
          title: 'Footer links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'href', title: 'Href', type: 'string' },
              ],
              preview: { select: { title: 'label', subtitle: 'href' } },
            },
          ],
        }),
        defineField({
          name: 'socialLinks',
          title: 'Social media links',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'platform',
                  title: 'Platform',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Instagram', value: 'instagram' },
                      { title: 'X / Twitter', value: 'twitter' },
                      { title: 'Facebook', value: 'facebook' },
                      { title: 'TikTok', value: 'tiktok' },
                      { title: 'YouTube', value: 'youtube' },
                      { title: 'LinkedIn', value: 'linkedin' },
                      { title: 'WhatsApp', value: 'whatsapp' },
                      { title: 'Email', value: 'email' },
                    ],
                  },
                },
                { name: 'url', title: 'URL', type: 'url', validation: (r) => r.uri({ scheme: ['http', 'https', 'mailto'] }) },
              ],
              preview: { select: { title: 'platform', subtitle: 'url' } },
            },
          ],
        }),
      ],
    }),

    // ─── BRANDING & SEO ──────────────────────────────────────────────────────
    defineField({
      name: 'branding',
      title: 'Branding & SEO',
      type: 'object',
      group: 'branding',
      options: { collapsible: true, collapsed: false },
      description: 'Logo powers the browser-tab icon, Apple touch icon, and social share image unless you upload dedicated ones below.',
      fields: [
        defineField({
          name: 'logo',
          title: 'Logo (master — used as the fallback for all icons)',
          type: 'image',
          description: 'A square logo works best. Used for the browser tab, Apple icon, and social image unless overridden below.',
        }),
        defineField({ name: 'favicon', title: 'Browser-tab icon (optional — overrides logo)', type: 'image' }),
        defineField({ name: 'appleIcon', title: 'Apple touch icon (optional — overrides logo)', type: 'image' }),
        defineField({ name: 'ogImage', title: 'Social share image / Open Graph (optional — falls back to logo)', type: 'image' }),
        defineField({ name: 'siteTitle', title: 'Site title (browser tab text)', type: 'string' }),
        defineField({ name: 'siteDescription', title: 'Site description (for search & social)', type: 'text', rows: 2 }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Contents' }),
  },
});
