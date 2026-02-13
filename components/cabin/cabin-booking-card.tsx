'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cabin } from '@/lib/data/cabins';
import { useLanguage } from '@/components/providers/language-provider';
import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { BookingCalendar } from '@/components/calendar/booking-calendar';
import { useAuth } from '@/lib/auth/auth-context';
import PayNowButton from '@/components/PayNowButton';

interface CabinBookingCardProps {
  cabin: Cabin;
}

export function CabinBookingCard({ cabin }: CabinBookingCardProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [guests, setGuests] = useState(2);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch booked dates when component mounts
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch(`/api/bookings/dates?cabinId=${cabin.slug}`);
        const data = await response.json();
        if (data.bookedDates) {
          setBookedDates(data.bookedDates);
        }
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };

    fetchBookedDates();
  }, [cabin.slug]);

  // Auto-fill form data for authenticated users
  useEffect(() => {
    if (user) {
      setGuestName(user.fullName);
      setGuestEmail(user.email);
    }
  }, [user]);

  // Calculate nights
  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 2;

  // Convert dates to string format for API
  const checkIn = checkInDate ? checkInDate.toISOString().split('T')[0] : '';
  const checkOut = checkOutDate ? checkOutDate.toISOString().split('T')[0] : '';

  // Handle calendar date selection
  const handleDateSelect = (date: Date) => {
    if (!selectingCheckOut) {
      // Selecting check-in
      setCheckInDate(date);
      setCheckOutDate(null);
      setSelectingCheckOut(true);
    } else {
      // Selecting check-out
      if (checkInDate && date > checkInDate) {
        setCheckOutDate(date);
        setSelectingCheckOut(false);
        setShowCalendar(false);
      } else {
        // Reset if invalid selection
        setCheckInDate(date);
        setCheckOutDate(null);
      }
    }
  };

  const subtotal = cabin.price * nights;
  const cleaningFee = 300; // RON
  const serviceFee = subtotal * 0.1;
  const total = subtotal + cleaningFee + serviceFee;

  const handleBooking = () => {
    // Validate dates
    if (!checkIn || !checkOut) {
      setError(language === 'en' ? 'Please select check-in and check-out dates' : 'Selectează datele de check-in și check-out');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      setError(language === 'en' ? 'Check-out must be after check-in' : 'Check-out trebuie să fie după check-in');
      return;
    }

    // Check if any date in the range is booked
    const checkInDateObj = new Date(checkIn);
    const checkOutDateObj = new Date(checkOut);
    const datesInRange: string[] = [];

    for (let d = new Date(checkInDateObj); d < checkOutDateObj; d.setDate(d.getDate() + 1)) {
      datesInRange.push(d.toISOString().split('T')[0]);
    }

    const hasBookedDate = datesInRange.some(date => bookedDates.includes(date));
    if (hasBookedDate) {
      setError(language === 'en'
        ? 'Some dates in your selected range are already booked. Please choose different dates.'
        : 'Unele date din intervalul selectat sunt deja rezervate. Te rugăm să alegi alte date.');
      return;
    }

    setError('');
    setShowGuestForm(true);
  };

  const handleCheckout = async () => {
    // Validate guest details
    if (!guestName || !guestEmail || !guestPhone) {
      setError(language === 'en' ? 'Please enter your name, email, and phone number' : 'Introdu numele, emailul și numărul de telefon');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cabinId: cabin.slug,
          cabinName: cabin.name,
          checkIn,
          checkOut,
          guests,
          nights,
          basePrice: subtotal,
          cleaningFee,
          serviceFee,
          total,
          guestEmail,
          guestName,
          guestPhone,
          language,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Show payment instructions
      if (data.bookingReference) {
        setBookingReference(data.bookingReference);
        setShowPaymentInstructions(true);

        // Scroll to booking card to show success message
        setTimeout(() => {
          const bookingCard = document.querySelector('.rounded-2xl.shadow-xl');
          if (bookingCard) {
            bookingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } catch (err) {
      setError(language === 'en' ? 'Something went wrong. Please try again.' : 'Ceva nu a mers bine. Te rugăm să încerci din nou.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[var(--tan-light)]">
      {showPaymentInstructions ? (
        /* Payment Instructions */
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[var(--brown-deep)] mb-2">
              {language === 'en' ? 'Booking Reserved!' : 'Rezervare Confirmată!'}
            </h3>
            <p className="text-[var(--text-body)]">
              {language === 'en' ? 'Reference: ' : 'Referință: '}<span className="font-mono font-bold">{bookingReference}</span>
            </p>
          </div>

          <div className="bg-[var(--linen-soft)] rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-lg text-[var(--brown-deep)]">
              {language === 'en' ? 'Payment Instructions' : 'Instrucțiuni de Plată'}
            </h4>

            <div className="space-y-3 text-sm">
              <p className="text-[var(--text-body)]">
                {language === 'en'
                  ? 'Please transfer the payment to our Wise account:'
                  : 'Te rugăm să transferi plata în contul nostru Wise:'}
              </p>

              <div className="bg-white rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-body)]">{language === 'en' ? 'Amount:' : 'Sumă:'}</span>
                  <span className="font-bold text-[var(--green-deep)]">{total.toFixed(2)} RON</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-body)]">{language === 'en' ? 'Account Name:' : 'Nume Cont:'}</span>
                  <span className="font-semibold">The A-Frame Azuga</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-body)]">Email:</span>
                  <span className="font-semibold">info@aframe-azuga.ro</span>
                </div>
                <div className="border-t border-[var(--tan-light)] pt-2 mt-2">
                  <p className="text-xs text-[var(--text-body)]">
                    {language === 'en'
                      ? 'Use Wise app to send money to the email above, or ask us for IBAN details.'
                      : 'Folosește aplicația Wise pentru a trimite bani la emailul de mai sus, sau contactează-ne pentru detalii IBAN.'}
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>{language === 'en' ? 'Important:' : 'Important:'}</strong>{' '}
                  {language === 'en'
                    ? `Include your booking reference "${bookingReference}" in the transfer description.`
                    : `Include referința de rezervare "${bookingReference}" în descrierea transferului.`}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-[var(--text-body)]">
              <p className="font-semibold mb-2">
                {language === 'en' ? 'Next Steps:' : 'Pași Următori:'}
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>{language === 'en' ? 'Transfer the amount using Wise' : 'Transferă suma folosind Wise'}</li>
                <li>{language === 'en' ? 'We will confirm your booking within 24 hours' : 'Vom confirma rezervarea în 24 de ore'}</li>
                <li>{language === 'en' ? 'You will receive a confirmation email' : 'Vei primi un email de confirmare'}</li>
              </ol>
            </div>

            <div className="text-center text-xs text-[var(--text-body)]/60">
              {language === 'en'
                ? 'Questions? Contact us at info@aframe-azuga.ro'
                : 'Întrebări? Contactează-ne la info@aframe-azuga.ro'}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Price */}
          <div className="mb-6 pb-6 border-b border-[var(--tan-light)]">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-[var(--green-deep)]">
                {cabin.price} RON
              </span>
              <span className="text-[var(--text-body)]">/ {language === 'en' ? 'night' : 'noapte'}</span>
            </div>
          </div>

          {!showGuestForm ? (
        <>
          {/* Date Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--brown-deep)] mb-2">
                {language === 'en' ? 'Select Dates' : 'Selectează Datele'}
              </label>

              {/* Date Display / Toggle */}
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 border-2 border-[var(--tan-light)] rounded-xl hover:border-[var(--green-deep)] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon size={18} className="text-[var(--green-deep)]" />
                  <span className="text-sm text-[var(--brown-deep)]">
                    {checkInDate && checkOutDate
                      ? `${checkInDate.toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', { month: 'short', day: 'numeric' })} - ${checkOutDate.toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', { month: 'short', day: 'numeric' })}`
                      : checkInDate
                        ? `${checkInDate.toLocaleDateString(language === 'en' ? 'en-US' : 'ro-RO', { month: 'short', day: 'numeric' })} - ${language === 'en' ? 'Select check-out' : 'Selectează check-out'}`
                        : language === 'en' ? 'Select check-in date' : 'Selectează data de check-in'
                    }
                  </span>
                </div>
                <span className="text-xs text-[var(--text-body)]">
                  {nights} {language === 'en' ? (nights === 1 ? 'night' : 'nights') : (nights === 1 ? 'noapte' : 'nopți')}
                </span>
              </button>

              {/* Calendar Popup */}
              {showCalendar && (
                <div className="mt-4">
                  <BookingCalendar
                    checkInDate={checkInDate}
                    checkOutDate={checkOutDate}
                    onDateSelect={handleDateSelect}
                    unavailableDates={bookedDates}
                    language={language}
                    selectingCheckOut={selectingCheckOut}
                  />
                  {selectingCheckOut && (
                    <p className="text-xs text-[var(--green-deep)] mt-2 text-center font-medium">
                      {language === 'en' ? 'Now select check-out date' : 'Acum selectează data de check-out'}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Guest Counter */}
            <div>
              <label className="block text-sm font-semibold text-[var(--brown-deep)] mb-2">
                {language === 'en' ? 'Guests' : 'Oaspeți'}
              </label>
              <div className="flex items-center justify-between px-4 py-2 border border-[var(--tan-light)] rounded-lg">
                <span className="text-sm text-[var(--text-body)]">
                  {guests} {guests === 1 ? (language === 'en' ? 'guest' : 'oaspete') : (language === 'en' ? 'guests' : 'oaspeți')}
                </span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    -
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGuests(Math.min(cabin.guests, guests + 1))}
                    className="h-8 w-8 p-0 rounded-full"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6 pb-6 border-b border-[var(--tan-light)] text-sm">
            <div className="flex justify-between text-[var(--text-body)]">
              <span>
                {cabin.price} RON × {nights} {language === 'en' ? 'nights' : 'nopți'}
              </span>
              <span>{subtotal.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between text-[var(--text-body)]">
              <span>{language === 'en' ? 'Cleaning fee' : 'Taxă curățenie'}</span>
              <span>{cleaningFee.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between text-[var(--text-body)]">
              <span>{language === 'en' ? 'Service fee' : 'Taxă serviciu'}</span>
              <span>{serviceFee.toFixed(2)} RON</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center mb-6 font-semibold text-lg">
            <span className="text-[var(--brown-deep)]">{t.cabinDetail.total}</span>
            <span className="text-[var(--green-deep)]">{total.toFixed(2)} RON</span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Continue Button */}
          <Button
            size="lg"
            onClick={handleBooking}
            className="w-full bg-[var(--green-deep)] text-[var(--cream-warm)] hover:bg-[var(--green-sage)] rounded-full text-lg py-6"
          >
            {language === 'en' ? 'Continue to Booking' : 'Continuă la Rezervare'}
          </Button>
        </>
      ) : (
        <>
          {/* Guest Details Form */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-lg text-[var(--brown-deep)] mb-4">
              {language === 'en' ? 'Guest Details' : 'Detalii Oaspete'}
            </h3>

            <div>
              <label className="block text-sm font-semibold text-[var(--brown-deep)] mb-2">
                {language === 'en' ? 'Full Name' : 'Nume Complet'}
              </label>
              <Input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={language === 'en' ? 'John Doe' : 'Ion Popescu'}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--brown-deep)] mb-2">
                Email
              </label>
              <Input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--brown-deep)] mb-2">
                {language === 'en' ? 'Phone Number' : 'Număr de Telefon'}
              </label>
              <Input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder={language === 'en' ? '+40 123 456 789' : '+40 123 456 789'}
                className="w-full"
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-[var(--linen-soft)] rounded-lg p-4 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-[var(--text-body)]">{cabin.name}</span>
                <span className="font-semibold">{cabin.price} RON/{language === 'en' ? 'night' : 'noapte'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[var(--text-body)]">{checkIn} → {checkOut}</span>
                <span className="font-semibold">{nights} {language === 'en' ? 'nights' : 'nopți'}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--tan-light)] pt-2 mt-2">
                <span className="font-semibold">{t.cabinDetail.total}:</span>
                <span className="font-bold text-[var(--green-deep)]">{total.toFixed(2)} RON</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <PayNowButton
                bookingData={{
                  cabinId: cabin.slug,
                  cabinName: cabin.name,
                  checkIn,
                  checkOut,
                  guests,
                  nights,
                  basePrice: subtotal,
                  cleaningFee,
                  serviceFee,
                  guestName,
                  guestEmail,
                  guestPhone,
                  total
                }}
              />
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowGuestForm(false);
                setError('');
              }}
              className="w-full"
            >
              {language === 'en' ? 'Back' : 'Înapoi'}
            </Button>
          </div>
        </>
      )}

          {/* Trust Text */}
          <p className="text-center text-xs text-[var(--text-body)]/60 mt-4">
            {t.cabinDetail.freeCancellationNote}
          </p>
        </>
      )}
    </div>
  );
}
