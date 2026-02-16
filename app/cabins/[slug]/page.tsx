import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCabinBySlug } from '@/lib/data/cabins';
import { Footer } from '@/components/footer';
import { CabinHero } from '@/components/cabin/cabin-hero';
import { CabinDetails } from '@/components/cabin/cabin-details';
import { CabinBookingCard } from '@/components/cabin/cabin-booking-card';
import { VirtualTour } from '@/components/cabin/virtual-tour';

interface CabinPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CabinPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cabin = getCabinBySlug(slug);

  if (!cabin) {
    return {
      title: 'Cabin Not Found',
    };
  }

  return {
    title: `${cabin.name} | The A-Frame`,
    description: cabin.description,
    openGraph: {
      title: `${cabin.name} | The A-Frame`,
      description: cabin.description,
      images: [cabin.heroImage],
    },
  };
}

export default async function CabinPage({ params }: CabinPageProps) {
  const { slug } = await params;
  const cabin = getCabinBySlug(slug);

  if (!cabin) {
    notFound();
  }

  return (
    <>
      <main className="pt-24">
        <CabinHero cabin={cabin} />

        <section className="py-12 md:py-16 bg-[var(--cream-warm)]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Virtual Tour Section */}
            <div className="mb-12 flex justify-center">
              <VirtualTour
                cabinName={cabin.name}
                images={cabin.images}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - Details */}
              <div className="lg:col-span-2">
                <CabinDetails cabin={cabin} />
              </div>

              {/* Right Column - Booking Card */}
              <div className="lg:col-span-1">
                <div className="lg:sticky lg:top-28">
                  <CabinBookingCard cabin={cabin} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  return [
    { slug: 'the-pine' },
    { slug: 'the-cedar' },
  ];
}
