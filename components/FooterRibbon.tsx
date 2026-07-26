'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Camera,
  Link2,
  Mail,
  MessageCircle,
  Music2,
  Phone,
  PlaySquare,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import type { SanityFooter } from '@/sanity/lib/fetch';

const FOOTER_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// The installed lucide-react ships no brand marks, so each platform maps to a
// neutral glyph that reads as its medium. Unknown platforms get a generic link.
const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Camera,
  twitter: MessageCircle,
  x: MessageCircle,
  facebook: ThumbsUp,
  tiktok: Music2,
  youtube: PlaySquare,
  linkedin: Briefcase,
  whatsapp: Phone,
  email: Mail,
  mail: Mail,
};

const DEFAULT_SOCIALS = [{ platform: 'Instagram', url: '#' }];

function socialIcon(platform: string): LucideIcon {
  return SOCIAL_ICONS[platform.trim().toLowerCase()] ?? Link2;
}

// Two identical halves of the marquee track; translating the track by -50%
// swaps one half for the other, giving a seamless infinite loop.
const HALF = Array.from({ length: 3 }, (_, i) => i);

export default function FooterRibbon({ footer }: { footer?: SanityFooter | null }) {
  const reduce = useReducedMotion();

  const wordmark = footer?.wordmark?.trim() || 'CIALLADE';
  const eyebrow = footer?.eyebrow?.trim() || 'The Ciallade Promise';
  const headlineLine1 = footer?.headlineLine1?.trim() || 'Be Yourself.';
  const headlineLine2 = footer?.headlineLine2?.trim() || 'Reinvent Always.';
  const ctaText = footer?.ctaText?.trim() || 'Explore the Collection';
  const ctaLink = footer?.ctaLink?.trim() || '/collections';
  const tagline = footer?.tagline?.trim() || '© 2026 Ciallade. Be Yourself, Reinvent Always.';
  const navLinks = footer?.navLinks?.length ? footer.navLinks : FOOTER_LINKS;
  const socialLinks = footer?.socialLinks?.length ? footer.socialLinks : DEFAULT_SOCIALS;

  return (
    <section className="relative bg-near-black overflow-hidden py-40 md:py-56">
      {/* Giant wordmark — infinite horizontal marquee crawl (reserved primitive) */}
      <div className="pointer-events-none absolute inset-0 flex items-center select-none" aria-hidden>
        <motion.div
          className="flex w-max whitespace-nowrap"
          style={{ willChange: 'transform' }}
          animate={reduce ? undefined : { x: ['0%', '-50%'] }}
          transition={reduce ? undefined : { duration: 42, ease: 'linear', repeat: Infinity }}
        >
          {[0, 1].map((half) => (
            <div key={half} className="flex shrink-0">
              {HALF.map((w) => (
                <span
                  key={w}
                  className="font-display leading-none px-8"
                  style={{ fontSize: 'clamp(120px, 22vw, 340px)', color: 'rgba(255,235,205,0.05)' }}
                >
                  {wordmark}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Centered final CTA */}
      <div className="relative z-10 flex flex-col items-center px-6 md:px-12">
        <SectionHeading
          eyebrow={eyebrow}
          lines={[[{ text: headlineLine1 }], [{ text: headlineLine2, accent: true }]]}
          className="text-almond-cream text-5xl md:text-7xl"
          align="center"
          as="h2"
        />

        <motion.a
          href={ctaLink}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="group mt-12 inline-flex items-center gap-3 border border-nature-brown/60 text-nature-brown label-text text-xs px-10 py-4 transition-colors duration-300 hover:bg-nature-brown hover:text-dark-wood"
        >
          {ctaText}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </motion.a>
      </div>

      {/* Minimal footer row */}
      <div className="relative z-10 mt-24 md:mt-32 px-6 md:px-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 border-t border-almond-cream/10 pt-8 md:flex-row">
          <nav className="flex items-center gap-8 label-text text-[11px] text-almond-cream/60">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors duration-300 hover:text-nature-brown">
                {l.label}
              </a>
            ))}
            {socialLinks.map((s, i) => {
              const Icon = socialIcon(s.platform);
              // The built-in placeholder has no destination yet, so it stays in-tab.
              const placeholder = !s.url || s.url === '#';
              return (
                <a
                  key={`${s.platform}-${i}`}
                  href={s.url || '#'}
                  aria-label={s.platform}
                  {...(placeholder ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                  className="transition-colors duration-300 hover:text-nature-brown"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </nav>
          <p className="font-body text-[11px] tracking-wide text-almond-cream/40">{tagline}</p>
        </div>
      </div>
    </section>
  );
}
