import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, AtSign } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { toLines } from '@/lib/heading';
import { fetchTeam, fetchSiteContent, type SanityTeamMember } from '@/sanity/lib/fetch';

export const revalidate = 60;
export const metadata = { title: 'Team' };

// Editorial portraits, cropped to a 4:5 frame at request time.
const UNS = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=1000&q=80`;

// Local copy of the homepage sample house, so /team is fully populated before
// Sanity is wired up. (A server component can't cleanly borrow the client
// section's internals, so the list lives here too.)
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

export default async function TeamPage() {
  const [team, site] = await Promise.all([fetchTeam(), fetchSiteContent()]);

  const members = team?.length ? team : FALLBACK_TEAM;
  const section = site?.team;

  const eyebrow = section?.heading?.eyebrow ?? 'The People';
  const lines = toLines(section?.heading?.title, section?.heading?.titleAccent, 'About the', 'Team');
  const intro = section?.intro?.trim();

  return (
    <div className="min-h-screen bg-dark-wood wash-dark pt-28">
      <div className="px-6 pb-32 md:px-12 md:pb-44">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb back home */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-body text-xs text-almond-cream/50 transition-colors duration-300 hover:text-nature-brown"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back home
          </Link>

          {/* Header */}
          <header className="mt-10 max-w-3xl">
            <SectionHeading
              eyebrow={eyebrow}
              lines={lines}
              className="text-almond-cream text-5xl md:text-7xl"
              align="left"
              as="h1"
            />
            {intro && (
              <p className="mt-8 font-body text-lg font-light leading-relaxed text-almond-cream/70">
                {intro}
              </p>
            )}
          </header>

          {/* Full team — static cards with CSS hover (no motion on the RSC page) */}
          <ul className="mt-20 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((m) => (
              <li
                key={m._id}
                className="group transition-transform duration-500 ease-out hover:-translate-y-1"
              >
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
                  <h2 className="font-display text-xl leading-tight text-almond-cream transition-colors duration-300 group-hover:text-nature-brown">
                    {m.name}
                  </h2>
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
