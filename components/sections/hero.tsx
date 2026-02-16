'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/language-provider';

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { t } = useLanguage();

  // Parallax effect - image moves slower than scroll
  const y = useTransform(scrollY, [0, 800], [0, 400]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden grain-texture"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=1920&q=80"
          alt="A-frame cabin in Azuga"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
            className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            {t.hero.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="font-[family-name:var(--font-body)] text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[var(--brown-deep)] rounded-full px-8 min-w-[200px]"
            >
              <Link href="/#cabins">
                {t.hero.exploreCabins}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-[var(--green-deep)] text-[var(--cream-warm)] hover:bg-[var(--green-sage)] rounded-full px-8 min-w-[200px]"
            >
              <Link href="/#cabins">
                {t.hero.bookYourStay}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-white/80 cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-sm font-[family-name:var(--font-body)] tracking-wider">
            {t.hero.scroll}
          </span>
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
