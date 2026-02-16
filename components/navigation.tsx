'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/language-provider';
import { LanguageToggle } from '@/components/language-toggle';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/#cabins', label: t.nav.ourCabins },
    { href: '/#gallery', label: t.nav.gallery },
    { href: '/#experience', label: t.nav.experience },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[var(--cream-warm)] shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              href="/"
              className={`font-[family-name:var(--font-heading)] text-2xl font-semibold transition-colors ${
                isScrolled ? 'text-[var(--brown-deep)]' : 'text-white'
              }`}
            >
              THE A-FRAME
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-[family-name:var(--font-body)] font-medium transition-colors group ${
                    isScrolled ? 'text-[var(--brown-deep)]' : 'text-white'
                  }`}
                >
                  {link.label}
                  <motion.span
                    className={`absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                      isScrolled ? 'bg-[var(--green-deep)]' : 'bg-white'
                    }`}
                  />
                </Link>
              ))}
              <div className={isScrolled ? 'text-[var(--brown-deep)]' : 'text-white'}>
                <LanguageToggle />
              </div>
              <Link href="/report-issue">
                <Button
                  size="lg"
                  className="bg-orange-600 text-white hover:bg-orange-700 rounded-full px-4 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Wrench size={18} />
                  {t.language === 'en' ? 'Report Issue' : 'Raportează'}
                </Button>
              </Link>
              <Link href="/#booking">
                <Button
                  size="lg"
                  className="bg-[var(--green-deep)] text-[var(--cream-warm)] hover:bg-[var(--green-sage)] rounded-full px-6"
                >
                  {t.nav.bookNow}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                isScrolled ? 'text-[var(--brown-deep)]' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[var(--cream-warm)] z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-[var(--brown-deep)]"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Mobile Nav Links */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                  className="flex flex-col gap-6"
                >
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-[family-name:var(--font-heading)] text-[var(--brown-deep)] hover:text-[var(--green-deep)] transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="mt-4 flex justify-center"
                  >
                    <LanguageToggle />
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="mt-4"
                  >
                    <Link href="/report-issue" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        size="lg"
                        className="w-full bg-orange-600 text-white hover:bg-orange-700 rounded-full flex items-center justify-center gap-2 mb-3"
                      >
                        <Wrench size={18} />
                        {t.language === 'en' ? 'Report Issue' : 'Raportează Problemă'}
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link href="/#booking" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button
                        size="lg"
                        className="w-full bg-[var(--green-deep)] text-[var(--cream-warm)] hover:bg-[var(--green-sage)] rounded-full"
                      >
                        {t.nav.bookNow}
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
