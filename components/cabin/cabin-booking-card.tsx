'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cabin } from '@/lib/data/cabins';
import { useLanguage } from '@/components/providers/language-provider';
import { Loader2, Calendar as CalendarIcon, Tag, Check, X } from 'lucide-react';
import { BookingCalendar } from '@/components/calendar/booking-calendar';
import { useAuth } from '@/lib/auth/auth-context';
import { useToast } from '@/components/ui/toast';
import { FuturisticSuccessPopup } from '@/components/booking/futuristic-success-popup';
import PayNowButton from '@/components/PayNowButton';

interface CabinBookingCardProps {
  cabin: Cabin;
}

export function CabinBookingCard({ cabin }: CabinBookingCardProps) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
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
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeApplied, setPromoCodeApplied] = useState(false);
  const [promoCodeValidating, setPromoCodeValidating] = useState(false);
  const [promoCodeError, setPromoCodeError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoDetails, setPromoDetails] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [cabinPrice, setCabinPrice] = useState(cabin.price);

  // Fetch booked dates and settings when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch booked dates
        const datesResponse = await fetch(`/api/bookings/dates?cabinId=${cabin.slug}`);
        const datesData = await datesResponse.json();
        if (datesData.bookedDates) {
          setBookedDates(datesData.bookedDates);
        }

        // Fetch system settings
        const settingsResponse = await fetch('/api/settings');
        const settingsData = await settingsResponse.json();
        if (settingsData.settings) {
          setSettings(settingsData.settings);
        }

        // Fetch cabin price from database
        const cabinResponse = await fetch(`/api/cabins/${cabin.slug}`);
        const cabinData = await cabinResponse.json();
        if (cabinData.cabin && cabinData.cabin.price_per_night) {
          setCabinPrice(Number(cabinData.cabin.price_per_night));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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

  // Apply promo code
  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoCodeError(language === 'en' ? 'Please enter a promo code' : 'Introdu un cod promoțional');
      return;
    }

    setPromoCodeValidating(true);
    setPromoCodeError('');

    try {
      const response = await fetch('/api/promo-codes/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.toUpperCase() })
      });

      const data = await response.json();

      if (data.valid && data.promoCode) {
        setPromoCodeApplied(true);
        setPromoDetails(data.promoCode);

        // Calculate discount
        let discount = 0;
        if (data.promoCode.discountType === 'percentage') {
          discount = totalBeforePromo * (data.promoCode.discountValue / 100);
        } else {
          discount = data.promoCode.discountValue;
        }
        setPromoDiscount(discount);

        showToast(
          language === 'en'
            ? `Promo code applied! You saved ${discount.toFixed(2)} RON`
            : `Cod aplicat! Ai economisit ${discount.toFixed(2)} RON`,
          'success'
        );
      } else {
        setPromoCodeError(data.error || (language === 'en' ? 'Invalid promo code' : 'Cod invalid'));
        showToast(
          data.error || (language === 'en' ? 'Invalid promo code' : 'Cod invalid'),
          'error'
        );
      }
    } catch (error) {
      setPromoCodeError(language === 'en' ? 'Failed to validate promo code' : 'Eroare la validare');
      showToast(
        language === 'en' ? 'Failed to validate promo code' : 'Eroare la validare',
        'error'
      );
    } finally {
      setPromoCodeValidating(false);
    }
  };

  // Remove promo code
  const removePromoCode = () => {
    setPromoCode('');
    setPromoCodeApplied(false);
    setPromoCodeError('');
    setPromoDiscount(0);
    setPromoDetails(null);
  };

  // Use database settings or fallback to defaults
  const cleaningFee = settings?.cleaning_fee ? Number(settings.cleaning_fee) : 50;
  const serviceFeePercent = settings?.service_fee_percentage ? Number(settings.service_fee_percentage) / 100 : 0.1;
  const taxPercent = settings?.tax_vat_percentage ? Number(settings.tax_vat_percentage) / 100 : 0.19;

  const subtotal = cabinPrice * nights;
  const serviceFee = subtotal * serviceFeePercent;
  const tax = subtotal * taxPercent;
  const totalBeforePromo = subtotal + cleaningFee + serviceFee + tax;
  const total = totalBeforePromo - promoDiscount;

  const handleBooking = () => {
    // Validate dates
    if (!checkIn || !checkOut) {
      const msg = language === 'en' ? 'Please select check-in and check-out dates' : 'Selectează datele de check-in și check-out';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      const msg = language === 'en' ? 'Check-out must be after check-in' : 'Check-out trebuie să fie după check-in';
      setError(msg);
      showToast(msg, 'error');
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
      const msg = language === 'en'
        ? 'Some dates in your selected range are already booked. Please choose different dates.'
        : 'Unele date din intervalul selectat sunt deja rezervate. Te rugăm să alegi alte date.';
      setError(msg);
      showToast(msg, 'error');
      return;
    }

    setError('');
    setShowGuestForm(true);
    showToast(
      language === 'en' ? 'Dates available! Please enter your details.' : 'Date disponibile! Introdu detaliile tale.',
      'success'
    );
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

      // Show futuristic success popup
      if (data.bookingReference) {
        setBookingReference(data.bookingReference);
        setShowPaymentInstructions(true);
        setShowSuccessPopup(true);
      }
    } catch (err) {
      const msg = language === 'en' ? 'Something went wrong. Please try again.' : 'Ceva nu a mers bine. Te rugăm să încerci din nou.';
      setError(msg);
      showToast(msg, 'error');
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
                {cabinPrice} RON × {nights} {language === 'en' ? 'nights' : 'nopți'}
              </span>
              <span>{subtotal.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between text-[var(--text-body)]">
              <span>{language === 'en' ? 'Cleaning fee' : 'Taxă curățenie'}</span>
              <span>{cleaningFee.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between text-[var(--text-body)]">
              <span>{language === 'en' ? 'Service fee' : 'Taxă serviciu'} ({(serviceFeePercent * 100).toFixed(0)}%)</span>
              <span>{serviceFee.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between text-[var(--text-body)]">
              <span>{language === 'en' ? 'Tax/VAT' : 'TVA'} ({(taxPercent * 100).toFixed(0)}%)</span>
              <span>{tax.toFixed(2)} RON</span>
            </div>

            {/* Promo Code Section */}
            <div className="pt-3 mt-3 border-t border-[var(--tan-light)]">
              {!promoCodeApplied ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1 group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">🎁</div>
                      <Input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value.toUpperCase());
                          setPromoCodeError('');
                        }}
                        placeholder={language === 'en' ? 'ENTER PROMO CODE' : 'INTRODU COD'}
                        className="pl-11 pr-4 py-3 uppercase font-mono text-sm border-2 border-[var(--tan-light)] rounded-xl focus:border-[var(--green-deep)] focus:ring-2 focus:ring-[var(--green-deep)]/20 text-gray-900 transition-all duration-300 bg-gradient-to-r from-white to-[var(--linen-soft)] hover:shadow-md group-hover:border-[var(--green-sage)]"
                        disabled={promoCodeValidating}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[var(--green-deep)]/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <Button
                      size="sm"
                      onClick={applyPromoCode}
                      disabled={promoCodeValidating || !promoCode.trim()}
                      className="bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-sage)] text-white hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {promoCodeValidating ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <>
                          <span>{language === 'en' ? 'Apply' : 'Aplică'}</span>
                          <span className="ml-1">✨</span>
                        </>
                      )}
                    </Button>
                  </div>
                  {promoCodeError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2 animate-shake">
                      <X size={14} className="text-red-600 flex-shrink-0" />
                      <p className="text-xs text-red-600">{promoCodeError}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-xl p-4 shadow-lg animate-slideDown">
                  {/* Sparkle effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-transparent rounded-full blur-2xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                          <Check className="text-white" size={18} strokeWidth={3} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-black text-green-900 text-base tracking-wider">{promoCode}</span>
                            <span className="text-lg">🎉</span>
                          </div>
                          <span className="text-xs text-green-700 font-medium">
                            {language === 'en' ? 'Code Applied!' : 'Cod Aplicat!'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removePromoCode}
                        className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-green-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm border border-green-200 hover:border-red-200"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="bg-white/80 backdrop-blur rounded-lg p-3 border border-green-200/50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-green-800 font-medium">
                          {promoDetails?.description || (language === 'en' ? '💰 Discount applied' : '💰 Discount aplicat')}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-green-900 font-black">-{promoDiscount.toFixed(2)} RON</span>
                          <span className="text-base">💸</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
            <h3 className="font-semibold text-lg text-gray-900 mb-4">
              {language === 'en' ? 'Guest Details' : 'Detalii Oaspete'}
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Full Name' : 'Nume Complet'}
              </label>
              <Input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={language === 'en' ? 'John Doe' : 'Ion Popescu'}
                className="w-full text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {language === 'en' ? 'Phone Number' : 'Număr de Telefon'}
              </label>
              <Input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder={language === 'en' ? '+40 123 456 789' : '+40 123 456 789'}
                className="w-full text-gray-900"
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
            <Button
              size="lg"
              onClick={() => {
                // Redirect to payment page with booking data
                const params = new URLSearchParams({
                  cabinId: cabin.slug,
                  cabinName: cabin.name,
                  checkIn,
                  checkOut,
                  guests: guests.toString(),
                  nights: nights.toString(),
                  basePrice: subtotal.toString(),
                  cleaningFee: cleaningFee.toString(),
                  serviceFee: serviceFee.toString(),
                  total: total.toString(),
                  guestName,
                  guestEmail,
                  guestPhone,
                });
                router.push(`/payment?${params.toString()}`);
              }}
              className="w-full bg-[var(--green-deep)] text-[var(--cream-warm)] hover:bg-[var(--green-sage)] rounded-full"
            >
              {language === 'en' ? 'Continue to Payment' : 'Continuă la Plată'}
            </Button>

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

      {/* Futuristic Success Popup */}
      <FuturisticSuccessPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        bookingDetails={{
          bookingReference,
          cabinName: cabin.name,
          checkIn,
          checkOut,
          guests,
          nights,
          total,
          guestName,
          guestEmail
        }}
        language={language}
      />
    </div>
  );
}
