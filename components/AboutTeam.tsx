'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, AtSign } from 'lucide-react';
import SectionHeading, { toLines } from '@/components/SectionHeading';
import { fadeUp, staggerContainer, reducedVariant } from '@/lib/animations';
import type { SanityTeamMember, SanityTeamSection } from '@/sanity/lib/fetch';

// Editorial portraits, cropped to a 4:5 frame at request time.
const UNS = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=1000&q=80`;

// Sample house so the section reads fully before Sanity is wired up. Kept in
// sync with the copy on /team (which carries its own local copy of this list).
const FALLBACK_TEAM: SanityTeamMember[] = [
  {
    _id: 'sample-amara',
    name: 'Amara Okonkwo',
    role: 'Creative Director',
    bio: 'Sets the house vision — where heritage meets the runway.',
    instagram: '@amara.ciallade',
    featuredOnHome: true,
    photo: UNS('photo-1524504388940-b1c1722653e1'),
  },
  {
    _id: 'sample-tunde',
    name: 'Tunde Bakare',
    role: 'Head of Design',
    bio: 'Draws every silhouette before it meets the atelier floor.',
    instagram: '@tunde.designs',
    featuredOnHome: true,
    photo: UNS('photo-1506794778202-cad84cf45f1d'),
  },
  {
    _id: 'sample-ngozi',
    name: 'Ngozi Adeyemi',
    role: 'Atelier Lead',
    bio: 'Guards the finishing — the hand-work that earns the label.',
    featuredOnHome: true,
    photo: UNS('photo-1517841905240-472988babdf9'),
  },
  {
    _id: 'sample-emeka',
    name: 'Emeka Nwosu',
    role: 'Brand Direction',
    bio: 'Carries Ciallade from Lagos to the wider world.',
    instagram: '@emeka.n',
    featuredOnHome: true,
    photo: UNS('photo-1500648767791-00dcc994a43e'),
  },
];

/** First initials of the first two words — for the no-photo placeholder. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** Accepts a raw handle, an @handle, or a full URL and returns a safe link. */
function instagramHref(handle: string): string {
  const h = handle.trim();
  if (/^https?:\/\//i.test(h)) return h;
  return `https://instagram.com/${h.replace(/^@/, '')}`;
}

/** Normalises any of the above forms to a display "@handle". */
function instagramHandle(handle: string): string {
  const h = handle
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .replace(/\/+$/, '');
  return `@${h}`;
}

type Props = {
  members?: SanityTeamMember[] | null;
  section?: SanityTeamSection | null;
};

export default function AboutTeam({ members, section }: Props) {
  const reduce = useReducedMotion();

  // Preview the flagged members (capped at four); fall back to the full list
  // when none are flagged, and to the sample house when Sanity is empty.
  const source = members?.length ? members : FALLBACK_TEAM;
  const flagged = source.filter((m) => m.featuredOnHome !== false);
  const preview = (flagged.length ? flagged : source).slice(0, 4);

  const eyebrow = section?.heading?.eyebrow ?? 'The People';
  const lines = toLines(section?.heading?.title, section?.heading?.titleAccent, 'About the', 'Team');
  const intro = section?.intro?.trim();

  const container = reduce ? {} : staggerContainer;
  const item = reduce ? reducedVariant : fadeUp;

  return (
    <section className="relative bg-dark-wood wash-dark py-32 md:py-44 px-6 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Heading + optional intro */}
        <div className="max-w-3xl">
          <SectionHeading
            eyebrow={eyebrow}
            lines={lines}
            className="text-almond-cream text-4xl md:text-6xl"
            align="left"
            as="h2"
          />
          {intro && (
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className="mt-8 font-body font-light text-almond-cream/70 text-lg leading-relaxed"
            >
              {intro}
            </motion.p>
          )}
        </div>

        {/* Member preview — staggered entrance */}
        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {preview.map((m) => (
            <motion.li key={m._id} variants={item} className="group">
              {/* Portrait — 4:5, image zoom + gold hairline on hover */}
              <div
                className="relative overflow-hidden bg-dark-wood"
                style={{ aspectRatio: '4 / 5' }}
              >
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-coffee-brown/40 to-dark-wood">
                    <span className="font-display text-5xl text-almond-cream/40">
                      {initials(m.name)}
                    </span>
                  </div>
                )}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-nature-brown transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <div className="pointer-events-none absolute inset-0 bg-dark-wood/0 transition-colors duration-500 group-hover:bg-dark-wood/20" />
              </div>

              {/* Identity */}
              <div className="pt-5">
                <h3 className="font-display text-xl leading-tight text-almond-cream transition-colors duration-300 group-hover:text-nature-brown">
                  {m.name}
                </h3>
                {m.role && (
                  <p className="mt-1.5 label-text text-[11px] text-nature-brown">{m.role}</p>
                )}
                {m.bio && (
                  <p className="mt-3 font-body text-sm font-light leading-relaxed text-almond-cream/60">
                    {m.bio}
                  </p>
                )}
                {m.instagram && (
                  <a
                    href={instagramHref(m.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${m.name} on Instagram`}
                    className="mt-4 inline-flex items-center gap-1.5 font-body text-xs text-almond-cream/50 transition-colors duration-300 hover:text-nature-brown"
                  >
                    <AtSign size={13} />
                    {instagramHandle(m.instagram)}
                  </a>
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>

        {/* Full-team CTA — the site's outline button */}
        <div className="mt-16">
          <Link
            href="/team"
            className="group inline-flex items-center gap-3 border border-nature-brown/60 px-10 py-4 label-text text-xs text-nature-brown transition-colors duration-300 hover:bg-nature-brown hover:text-dark-wood"
          >
            Meet the full team
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
