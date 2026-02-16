'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, User, Mail, Phone, CreditCard, CheckCircle, Clock, AlertCircle, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/providers/language-provider';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

interface BookingData {
  bookingReference: string;
  cabinName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  specialRequests: string;
}

export default function BookingLookupPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [bookingId, setBookingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [error, setError] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!bookingId.trim()) {
      const msg = language === 'en' ? 'Please enter a booking ID' : 'Introdu ID-ul rezervării';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setLoading(true);
    setError('');
    setBookingData(null);

    try {
      const response = await fetch(`/api/booking/lookup?bookingId=${bookingId.trim()}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        showToast(data.error, 'error');
        setLoading(false);
        return;
      }

      setBookingData(data.booking);
      showToast(
        language === 'en' ? 'Booking found!' : 'Rezervare găsită!',
        'success'
      );
    } catch (err) {
      const msg = language === 'en' ? 'Failed to retrieve booking' : 'Nu s-a putut găsi rezervarea';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingData) return;

    const confirmed = confirm(
      language === 'en'
        ? 'Are you sure you want to cancel this reservation? This action cannot be undone.'
        : 'Sigur dorești să anulezi această rezervare? Această acțiune nu poate fi anulată.'
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/booking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: bookingData.bookingReference }),
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          language === 'en' ? 'Booking cancelled successfully' : 'Rezervare anulată cu succes',
          'success'
        );
        // Refresh booking data
        setBookingData({ ...bookingData, status: 'cancelled' });
      } else {
        showToast(data.error || 'Failed to cancel booking', 'error');
      }
    } catch (error) {
      showToast(
        language === 'en' ? 'Failed to cancel booking' : 'Nu s-a putut anula rezervarea',
        'error'
      );
    }
  };

  const handleContactAdmin = () => {
    setShowMessageModal(true);
    setMessage('');
  };

  const submitMessage = async () => {
    if (!bookingData || !message.trim()) {
      showToast(
        language === 'en' ? 'Please enter a message' : 'Introdu un mesaj',
        'error'
      );
      return;
    }

    try {
      const response = await fetch('/api/booking/contact-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.bookingReference,
          guestName: bookingData.guestName,
          guestEmail: bookingData.guestEmail,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          language === 'en'
            ? 'Message sent! An admin will contact you soon.'
            : 'Mesaj trimis! Un administrator te va contacta în curând.',
          'success'
        );
        setShowMessageModal(false);
        setMessage('');
      } else {
        showToast(data.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      showToast(
        language === 'en' ? 'Failed to send message' : 'Nu s-a putut trimite mesajul',
        'error'
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px rgba(127, 168, 118, 0.3)',
                '0 0 40px rgba(127, 168, 118, 0.5)',
                '0 0 20px rgba(127, 168, 118, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block p-4 rounded-full bg-[var(--green-sage)]/10 mb-6"
          >
            <Search className="w-12 h-12 text-[var(--green-sage)]" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            {language === 'en' ? 'Booking Lookup' : 'Verificare Rezervare'}
          </h1>
          <p className="text-gray-300 text-lg">
            {language === 'en'
              ? 'Enter your booking ID to view your reservation details'
              : 'Introdu ID-ul rezervării pentru a vedea detaliile'}
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                placeholder={language === 'en' ? 'Enter Booking ID (e.g., AF123ABC)' : 'ID Rezervare (ex: AF123ABC)'}
                className="h-14 text-lg bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-14 px-8 text-lg bg-[var(--green-sage)] hover:bg-[var(--green-deep)] text-white rounded-full"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Search className="w-6 h-6" />
                </motion.div>
              ) : (
                <>
                  <Search className="w-6 h-6 mr-2" />
                  {language === 'en' ? 'Search' : 'Caută'}
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Booking Details */}
        <AnimatePresence mode="wait">
          {bookingData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Header with Status */}
              <div className="bg-gradient-to-r from-[var(--green-sage)] to-[var(--green-deep)] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1 font-[family-name:var(--font-heading)]">
                      {bookingData.cabinName}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {language === 'en' ? 'Booking ID:' : 'ID Rezervare:'} {bookingData.bookingReference}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(bookingData.status)}`}>
                    {getStatusIcon(bookingData.status)}
                    <span className="font-semibold capitalize">{bookingData.status}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Guest Information */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[var(--green-sage)]" />
                    {language === 'en' ? 'Guest Information' : 'Informații Oaspete'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoCard icon={<User />} label={language === 'en' ? 'Name' : 'Nume'} value={bookingData.guestName} />
                    <InfoCard icon={<Mail />} label="Email" value={bookingData.guestEmail} />
                    <InfoCard icon={<Phone />} label={language === 'en' ? 'Phone' : 'Telefon'} value={bookingData.guestPhone} />
                    <InfoCard icon={<User />} label={language === 'en' ? 'Guests' : 'Oaspeți'} value={`${bookingData.guests} ${language === 'en' ? 'guests' : 'oaspeți'}`} />
                  </div>
                </div>

                {/* Booking Dates */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[var(--green-sage)]" />
                    {language === 'en' ? 'Stay Details' : 'Detalii Sejur'}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <InfoCard
                      icon={<Calendar />}
                      label={language === 'en' ? 'Check-in' : 'Check-in'}
                      value={new Date(bookingData.checkIn).toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    />
                    <InfoCard
                      icon={<Calendar />}
                      label={language === 'en' ? 'Check-out' : 'Check-out'}
                      value={new Date(bookingData.checkOut).toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    />
                    <InfoCard
                      icon={<Clock />}
                      label={language === 'en' ? 'Nights' : 'Nopți'}
                      value={`${bookingData.nights} ${language === 'en' ? 'nights' : 'nopți'}`}
                    />
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[var(--green-sage)]" />
                    {language === 'en' ? 'Payment Summary' : 'Sumar Plată'}
                  </h3>
                  <div className="bg-white/5 rounded-xl p-6 space-y-3">
                    <div className="flex justify-between text-gray-300">
                      <span>{language === 'en' ? 'Base Price' : 'Preț de bază'}</span>
                      <span>{bookingData.basePrice} RON</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>{language === 'en' ? 'Cleaning Fee' : 'Taxă curățenie'}</span>
                      <span>{bookingData.cleaningFee} RON</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>{language === 'en' ? 'Service Fee' : 'Taxă serviciu'}</span>
                      <span>{bookingData.serviceFee} RON</span>
                    </div>
                    <div className="h-px bg-white/20 my-3"></div>
                    <div className="flex justify-between text-white text-xl font-bold">
                      <span>Total</span>
                      <span>{bookingData.total} RON</span>
                    </div>
                    <div className="mt-4">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(bookingData.paymentStatus)}`}>
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm font-semibold capitalize">
                          {language === 'en' ? 'Payment:' : 'Plată:'} {bookingData.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {bookingData.specialRequests && (
                  <div>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      {language === 'en' ? 'Special Requests' : 'Cerințe Speciale'}
                    </h3>
                    <div className="bg-white/5 rounded-xl p-4 text-gray-300">
                      {bookingData.specialRequests}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {bookingData.status !== 'cancelled' && (
                  <div className="pt-6 border-t border-white/20">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handleContactAdmin}
                        className="flex-1 bg-[var(--green-sage)] hover:bg-[var(--green-deep)] text-white rounded-full h-12"
                      >
                        <MessageSquare className="w-5 h-5 mr-2" />
                        {language === 'en' ? 'Contact Admin' : 'Contactează Admin'}
                      </Button>
                      <Button
                        onClick={() => handleCancelBooking()}
                        variant="destructive"
                        className="flex-1 rounded-full h-12"
                      >
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {language === 'en' ? 'Cancel Reservation' : 'Anulează Rezervarea'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-[var(--green-sage)]">
              {language === 'en' ? '← Back to Home' : '← Înapoi la Home'}
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-sage)] p-6 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-heading)]">
                      {language === 'en' ? 'Contact Admin' : 'Contactează Admin'}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {language === 'en' ? 'Send a message about your booking' : 'Trimite un mesaj despre rezervarea ta'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {language === 'en' ? 'Booking Reference:' : 'Referință Rezervare:'} <span className="font-bold text-[var(--green-deep)]">{bookingData?.bookingReference}</span>
                  </p>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={language === 'en' ? 'Type your message here... (e.g., date change request, special requirements, questions)' : 'Scrie mesajul tău aici... (ex: cerere schimbare date, cerințe speciale, întrebări)'}
                  className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-[var(--green-sage)] transition-colors text-gray-900 placeholder:text-gray-400"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-2 text-right">
                  {message.length}/500
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={() => setShowMessageModal(false)}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-2"
                  >
                    {language === 'en' ? 'Cancel' : 'Anulează'}
                  </Button>
                  <Button
                    onClick={submitMessage}
                    disabled={!message.trim()}
                    className="flex-1 h-12 bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-sage)] hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl text-white font-bold disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Send Message' : 'Trimite Mesaj'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white/5 rounded-xl p-4 border border-white/10"
    >
      <div className="flex items-center gap-3">
        <div className="text-[var(--green-sage)]">{icon}</div>
        <div>
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          <p className="text-white font-medium">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}
