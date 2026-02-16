'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Bed, Bath, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn } from '@/components/animations/fade-in';
import { StaggerContainer, StaggerItem, staggerItemVariants } from '@/components/animations/stagger-container';
import { cabins } from '@/lib/data/cabins';
import { useLanguage } from '@/components/providers/language-provider';

export function CabinsSection() {
  const { language } = useLanguage();

  return (
    <section id="cabins" className="py-20 md:py-32 bg-[var(--linen-soft)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[var(--brown-deep)] font-semibold mb-4">
            {language === 'en' ? 'Our Cabins' : 'Cabanele Noastre'}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-lg text-[var(--text-body)]">
            {language === 'en' ? 'Choose your escape' : 'Alege-ți evadarea'}
          </p>
        </FadeIn>

        {/* Cabin Cards */}
        <StaggerContainer className="grid md:grid-cols-2 gap-8 md:gap-12">
          {cabins.map((cabin) => (
            <StaggerItem key={cabin.id} variants={staggerItemVariants}>
              <Card className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2 cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden cabin-image-container">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    <Image
                      src={cabin.heroImage}
                      alt={cabin.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                      quality={85}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-[var(--brown-deep)] font-semibold mb-3">
                    {cabin.name}
                  </h3>

                  <p className="text-[var(--text-body)] mb-6 line-clamp-2">
                    {cabin.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-[var(--text-body)]">
                      <Users size={20} className="text-[var(--green-deep)]" />
                      <span className="text-sm">{cabin.guests} {language === 'en' ? 'Guests' : 'Oaspeți'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-body)]">
                      <Bed size={20} className="text-[var(--green-deep)]" />
                      <span className="text-sm">{cabin.bedrooms} {language === 'en' ? (cabin.bedrooms > 1 ? 'Bedrooms' : 'Bedroom') : (cabin.bedrooms > 1 ? 'Dormitoare' : 'Dormitor')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-body)]">
                      <Bath size={20} className="text-[var(--green-deep)]" />
                      <span className="text-sm">{cabin.bathrooms} {language === 'en' ? (cabin.bathrooms > 1 ? 'Bathrooms' : 'Bathroom') : (cabin.bathrooms > 1 ? 'Băi' : 'Baie')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-body)]">
                      <Maximize size={20} className="text-[var(--green-deep)]" />
                      <span className="text-sm">{cabin.sqft} {language === 'en' ? 'sqft' : 'mp'}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-[var(--green-deep)] text-xl font-semibold">
                      {language === 'en' ? 'From' : 'De la'} {cabin.price} RON
                    </span>
                    <span className="text-[var(--text-body)]"> / {language === 'en' ? 'night' : 'noapte'}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      asChild
                      className="flex-1 bg-[var(--green-deep)] text-white hover:bg-[var(--green-sage)] rounded-full"
                    >
                      <Link href={`/cabins/${cabin.slug}`}>
                        {language === 'en' ? 'View Details' : 'Vezi Detalii'}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-[var(--green-deep)] text-white hover:bg-[var(--green-sage)] rounded-full"
                    >
                      <Link href={`/cabins/${cabin.slug}#booking`}>
                        {language === 'en' ? 'Book Now' : 'Rezervă Acum'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
