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

const IntroScreen = dynamic(() => import('@/components/IntroScreen'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <IntroScreen />
      <Hero />
      <FeaturedStrip />
      <BrandPhilosophy />
      <CollectionsGrid />
      <EditorialSection />
      <Testimonials />
      <JourneySoFar />
      <TheDifference />
      <TheFocus />
    </>
  );
}
