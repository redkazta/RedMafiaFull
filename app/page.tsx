import { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedArtists } from '@/components/home/FeaturedArtists';
import { FeaturedMusic } from '@/components/home/FeaturedMusic';
import { UpcomingEvents } from '@/components/home/UpcomingEvents';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Content */}
        <div className="container mx-auto px-4 py-16 space-y-16">
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedArtists />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedMusic />
          </Suspense>
          
          <Suspense fallback={<LoadingSpinner />}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}