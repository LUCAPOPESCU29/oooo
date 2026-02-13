'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Shield, Menu, X, Settings, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/components/providers/language-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { Button } from '@/components/ui/button';
import ProfileDropdown from '@/components/ProfileDropdown';

export function NavHeader() {
  const { user, signOut, isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleSignOut = () => {
    signOut();
    router.push('/');
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left Side: Language Toggle */}
            <div className={`hidden md:block ${isScrolled ? 'text-[var(--brown-deep)]' : 'text-white'}`}>
              <LanguageToggle />
            </div>

            {/* Center: Logo */}
            <Link
              href="/"
              className={`font-[family-name:var(--font-heading)] text-2xl font-semibold transition-colors ${
                isScrolled ? 'text-[var(--brown-deep)]' : 'text-white'
              }`}
            >
              THE A-FRAME
            </Link>

            {/* Right Side: Navigation & Auth */}
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

              {user ? (
                <>
                  {/* Profile Dropdown */}
                  <ProfileDropdown />

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-full font-semibold transition-all duration-300 text-sm ${
                      isScrolled
                        ? 'border-2 border-red-500 text-red-500 hover:bg-red-50'
                        : 'border-2 border-white text-white hover:bg-white/20'
                    }`}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Sign In Button */}
                  <Link
                    href="/signin"
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                      isScrolled
                        ? 'border-2 border-[var(--green-deep)] text-[var(--green-deep)] hover:bg-[var(--green-soft)] hover:text-white'
                        : 'border-2 border-white text-white hover:bg-white/20'
                    }`}
                  >
                    Sign In
                  </Link>

                  {/* Sign Up Button */}
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-sage)] text-[var(--cream-warm)] hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 transition-colors ${
                isScrolled ? 'text-[var(--brown-deep)]' : 'text-white'
              }`}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-[var(--brown-deep)]"
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
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.href}
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        visible: { opacity: 1, x: 0 },
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
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

                  {user ? (
                    <>
                      {/* User Info - Clickable for Admin */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        {isAdmin ? (
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[var(--tan-light)] hover:bg-[var(--tan-base)] transition-colors"
                          >
                            <User size={18} className="text-[var(--brown-deep)]" />
                            <span className="text-sm font-medium text-[var(--brown-deep)]">
                              {user.fullName}
                            </span>
                            <span className="ml-2 px-2 py-0.5 bg-[var(--green-sage)] text-white text-xs font-semibold rounded-full">
                              ADMIN
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-[var(--tan-light)]">
                            <User size={18} className="text-[var(--brown-deep)]" />
                            <span className="text-sm font-medium text-[var(--brown-deep)]">
                              {user.fullName}
                            </span>
                          </div>
                        )}
                      </motion.div>

                      {/* My Bookings Link */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href="/my-bookings"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--green-deep)] text-white font-semibold hover:bg-[var(--green-sage)] transition-colors"
                        >
                          <BookOpen size={18} />
                          <span>My Bookings</span>
                        </Link>
                      </motion.div>

                      {/* Settings Link */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href="/settings"
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg bg-[var(--accent-color)] text-white font-semibold hover:opacity-90 transition-opacity"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>
                      </motion.div>

                      {/* Sign Out Button */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Sign In Button */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href="/signin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-2 rounded-lg border-2 border-[var(--green-deep)] text-[var(--green-deep)] font-semibold text-center"
                        >
                          Sign In
                        </Link>
                      </motion.div>

                      {/* Sign Up Button */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: { opacity: 1, x: 0 },
                        }}
                      >
                        <Link
                          href="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-soft)] text-white font-semibold text-center"
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
