import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import FeaturedStrip from '@/components/FeaturedStrip';
import BrandPhilosophy from '@/components/BrandPhilosophy';
import CollectionsGrid from '@/components/CollectionsGrid';
import EditorialSection from '@/components/EditorialSection';
import Testimonials from '@/components/Testimonials';
import JourneySoFar from '@/components/JourneySoFar';
import TheDifference from '@/components/TheDifference';
import TheFocus from '@/components/TheFocus';
import AboutTeam from '@/components/AboutTeam';
import GalleryPreview from '@/components/GalleryPreview';
import FooterRibbon from '@/components/FooterRibbon';
import {
  fetchSiteContent,
  fetchFeaturedPieces,
  fetchCollections,
  fetchTestimonials,
  fetchMilestones,
  fetchTeam,
  fetchGallery,
} from '@/sanity/lib/fetch';

const IntroScreen = dynamic(() => import('@/components/IntroScreen'), { ssr: false });

export const revalidate = 60; // Re-fetch Sanity content at most once a minute

// Fallback for the 10-Year Vision background: a file dropped in /public still
// works, but a Sanity upload (focus.visionBgUrl) takes priority.
function detectVisionBg(): string | undefined {
  for (const file of ['vision-bg.png', 'vision-bg.jpg', 'vision-bg.jpeg']) {
    if (fs.existsSync(path.join(process.cwd(), 'public', file))) return `/${file}`;
  }
  return undefined;
}

export default async function HomePage() {
  const [site, featured, collections, testimonials, milestones, team, gallery] = await Promise.all([
    fetchSiteContent(),
    fetchFeaturedPieces(),
    fetchCollections(),
    fetchTestimonials(),
    fetchMilestones(),
    fetchTeam(),
    fetchGallery(),
  ]);

  const visionBgUrl = site?.focus?.visionBgUrl || detectVisionBg();

  return (
    <>
      <IntroScreen />
      <Hero heroData={site?.hero} />
      <FeaturedStrip products={featured} heading={site?.featured} />
      <BrandPhilosophy philosophy={site?.philosophy} />
      <CollectionsGrid collections={collections} heading={site?.explore} />
      <EditorialSection editorial={site?.editorial} />
      <Testimonials testimonials={testimonials} heading={site?.testimonials} />
      <JourneySoFar milestones={milestones} heading={site?.journey} />
      <TheDifference items={site?.difference?.items} heading={site?.difference?.heading} />
      <TheFocus focus={site?.focus} visionBgUrl={visionBgUrl} />
      <AboutTeam members={team} section={site?.team} />
      <GalleryPreview items={gallery} section={site?.gallery} />
      <FooterRibbon footer={site?.footer} />
    </>
  );
}
