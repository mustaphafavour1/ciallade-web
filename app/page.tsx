import Hero from '@/components/Hero';
import FeaturedStrip from '@/components/FeaturedStrip';
import BrandPhilosophy from '@/components/BrandPhilosophy';
import CollectionsGrid from '@/components/CollectionsGrid';
import EditorialSection from '@/components/EditorialSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedStrip />
      <BrandPhilosophy />
      <CollectionsGrid />
      <EditorialSection />
    </>
  );
}
