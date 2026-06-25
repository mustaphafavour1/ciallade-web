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
import {
  fetchHero, fetchFeaturedProducts, fetchPhilosophy, fetchCollections,
  fetchEditorial, fetchTestimonials, fetchMilestones, fetchDifference, fetchFocus,
} from '@/sanity/lib/fetch';

const IntroScreen = dynamic(() => import('@/components/IntroScreen'), { ssr: false });

export const revalidate = 60; // Re-fetch Sanity data at most every 60 seconds

export default async function HomePage() {
  const [hero, featured, philosophy, collections, editorial, testimonials, milestones, difference, focus] =
    await Promise.all([
      fetchHero(),
      fetchFeaturedProducts(),
      fetchPhilosophy(),
      fetchCollections(),
      fetchEditorial(),
      fetchTestimonials(),
      fetchMilestones(),
      fetchDifference(),
      fetchFocus(),
    ]);

  return (
    <>
      <IntroScreen />
      <Hero heroData={hero} />
      <FeaturedStrip products={featured} />
      <BrandPhilosophy philosophy={philosophy} />
      <CollectionsGrid collections={collections} />
      <EditorialSection editorial={editorial} />
      <Testimonials testimonials={testimonials} />
      <JourneySoFar milestones={milestones} />
      <TheDifference items={difference?.items} />
      <TheFocus focus={focus} />
    </>
  );
}
