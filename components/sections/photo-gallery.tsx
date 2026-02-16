'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { FadeIn } from '@/components/animations/fade-in';

const galleryImages = [
  { id: 1, src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', alt: 'Cozy living room' },
  { id: 2, src: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1200&q=80', alt: 'A-Frame exterior' },
  { id: 3, src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', alt: 'Modern kitchen' },
  { id: 4, src: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&q=80', alt: 'Cabin in winter' },
  { id: 5, src: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80', alt: 'Comfortable bedroom' },
  { id: 6, src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', alt: 'Mountain views' },
];

export function PhotoGallery() {
  const { language } = useLanguage();
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const content = {
    en: { title: 'Gallery', subtitle: 'A glimpse of your mountain retreat' },
    ro: { title: 'Galerie', subtitle: 'O privire asupra refugiului tău montan' }
  };

  const t = content[language];

  const openLightbox = (imageId: number) => setLightboxImage(imageId);
  const closeLightbox = () => setLightboxImage(null);

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxImage === null) return;
    const currentIndex = galleryImages.findIndex(img => img.id === lightboxImage);
    const newIndex = direction === 'prev'
      ? (currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1)
      : (currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1);
    setLightboxImage(galleryImages[newIndex].id);
  };

  const currentLightboxImage = galleryImages.find(img => img.id === lightboxImage);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <FadeIn className="text-center mb-12">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--brown-deep)] font-semibold mb-3">
            {t.title}
          </h2>
          <p className="text-[var(--text-body)]">{t.subtitle}</p>
        </FadeIn>

        {/* Simple Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(image.id)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImage !== null && currentLightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-[var(--green-sage)] transition-colors"
              >
                <X size={32} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                className="absolute left-4 text-white hover:text-[var(--green-sage)] transition-colors"
              >
                <ChevronLeft size={48} />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                className="absolute right-4 text-white hover:text-[var(--green-sage)] transition-colors"
              >
                <ChevronRight size={48} />
              </button>

              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="relative max-w-5xl max-h-[85vh] w-full h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={currentLightboxImage.src}
                  alt={currentLightboxImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
