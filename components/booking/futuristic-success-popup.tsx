'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Copy, ExternalLink, Sparkles, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BookingDetails {
  bookingReference: string;
  cabinName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  guestName: string;
  guestEmail: string;
}

interface FuturisticSuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails;
  language: 'en' | 'ro';
}

export function FuturisticSuccessPopup({
  isOpen,
  onClose,
  bookingDetails,
  language
}: FuturisticSuccessPopupProps) {
  const { showToast } = useToast();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate random particles for celebration effect
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingDetails.bookingReference);
    showToast(
      language === 'en' ? 'Booking ID copied!' : 'ID copiat!',
      'success'
    );
  };

  const content = {
    en: {
      title: 'Booking Confirmed!',
      subtitle: 'Your mountain escape awaits',
      bookingId: 'Booking ID',
      saveThis: 'Save this ID to track your reservation',
      details: 'Booking Details',
      cabin: 'Cabin',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      nights: 'Nights',
      total: 'Total',
      confirmation: 'Confirmation email sent to',
      nextSteps: 'Next Steps',
      step1: 'Check your email for payment instructions',
      step2: 'Complete payment to confirm your booking',
      step3: 'Use your Booking ID to track your reservation',
      viewBooking: 'View Booking Details',
      close: 'Close'
    },
    ro: {
      title: 'Rezervare Confirmată!',
      subtitle: 'Evadarea ta în munte te așteaptă',
      bookingId: 'ID Rezervare',
      saveThis: 'Salvează acest ID pentru a-ți urmări rezervarea',
      details: 'Detalii Rezervare',
      cabin: 'Cabană',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Oaspeți',
      nights: 'Nopți',
      total: 'Total',
      confirmation: 'Email de confirmare trimis la',
      nextSteps: 'Pașii Următori',
      step1: 'Verifică emailul pentru instrucțiuni de plată',
      step2: 'Completează plata pentru a confirma rezervarea',
      step3: 'Folosește ID-ul de rezervare pentru a urmări rezervarea',
      viewBooking: 'Vezi Detalii Rezervare',
      close: 'Închide'
    }
  };

  const t = content[language];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
            onClick={onClose}
          />

          {/* Popup Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
              className="relative w-full max-w-3xl pointer-events-auto"
            >
              {/* Animated particles in background */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                {particles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0, scale: 0 }}
                    animate={{
                      y: [null, '-100%'],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: particle.id * 0.1,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="absolute w-2 h-2 bg-[var(--green-sage)] rounded-full"
                    style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
                  />
                ))}
              </div>

              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-[var(--green-sage)]/30">
                {/* Animated gradient border effect */}
                <motion.div
                  animate={{
                    background: [
                      'linear-gradient(0deg, rgba(127,168,118,0.2) 0%, transparent 100%)',
                      'linear-gradient(360deg, rgba(127,168,118,0.2) 0%, transparent 100%)',
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 pointer-events-none"
                />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="relative p-8 md:p-12">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          boxShadow: [
                            '0 0 20px rgba(127, 168, 118, 0.3)',
                            '0 0 60px rgba(127, 168, 118, 0.6)',
                            '0 0 20px rgba(127, 168, 118, 0.3)',
                          ],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="p-6 bg-[var(--green-sage)]/20 rounded-full"
                      >
                        <CheckCircle className="w-16 h-16 text-[var(--green-sage)]" strokeWidth={2.5} />
                      </motion.div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
                      {t.title}
                    </h2>
                    <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
                      <Star className="w-5 h-5 text-[var(--green-sage)]" />
                      {t.subtitle}
                      <Star className="w-5 h-5 text-[var(--green-sage)]" />
                    </p>
                  </motion.div>

                  {/* Booking ID Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-[var(--green-sage)]/20 to-[var(--green-deep)]/20 border border-[var(--green-sage)]/40 rounded-2xl p-6 mb-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-2">{t.bookingId}</p>
                        <p className="text-3xl font-bold text-white font-mono tracking-wider">
                          {bookingDetails.bookingReference}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">{t.saveThis}</p>
                      </div>
                      <Button
                        onClick={copyBookingId}
                        variant="ghost"
                        size="icon"
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                      >
                        <Copy className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>

                  {/* Booking Details Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid md:grid-cols-2 gap-4 mb-6"
                  >
                    <DetailCard label={t.cabin} value={bookingDetails.cabinName} />
                    <DetailCard label={t.total} value={`${bookingDetails.total} RON`} highlight />
                    <DetailCard
                      label={t.checkIn}
                      value={new Date(bookingDetails.checkIn).toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                    <DetailCard
                      label={t.checkOut}
                      value={new Date(bookingDetails.checkOut).toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    />
                    <DetailCard label={t.guests} value={`${bookingDetails.guests} ${language === 'en' ? 'guests' : 'oaspeți'}`} />
                    <DetailCard label={t.nights} value={`${bookingDetails.nights} ${language === 'en' ? 'nights' : 'nopți'}`} />
                  </motion.div>

                  {/* Confirmation Email */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6 text-center"
                  >
                    <p className="text-blue-200 text-sm">
                      {t.confirmation} <span className="font-semibold">{bookingDetails.guestEmail}</span>
                    </p>
                  </motion.div>

                  {/* Next Steps */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6"
                  >
                    <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-[var(--green-sage)]" />
                      {t.nextSteps}
                    </h3>
                    <div className="space-y-3">
                      <StepItem number="1" text={t.step1} />
                      <StepItem number="2" text={t.step2} />
                      <StepItem number="3" text={t.step3} />
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <Link href="/booking-lookup" className="flex-1">
                      <Button className="w-full h-12 bg-[var(--green-sage)] hover:bg-[var(--green-deep)] text-white rounded-full">
                        {t.viewBooking}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Button
                      onClick={onClose}
                      variant="outline"
                      className="flex-1 h-12 border-white/30 text-white hover:bg-white/10 rounded-full"
                    >
                      {t.close}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function DetailCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`bg-white/5 border ${highlight ? 'border-[var(--green-sage)]/40' : 'border-white/10'} rounded-xl p-4`}>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-[var(--green-sage)] text-xl' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function StepItem({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-6 h-6 bg-[var(--green-sage)]/20 border border-[var(--green-sage)]/40 rounded-full flex items-center justify-center">
        <span className="text-[var(--green-sage)] text-xs font-bold">{number}</span>
      </div>
      <p className="text-gray-300 text-sm">{text}</p>
    </div>
  );
}
