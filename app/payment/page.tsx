'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Building2, Bitcoin, Banknote, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { FuturisticSuccessPopup } from '@/components/booking/futuristic-success-popup';
import Link from 'next/link';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<'card' | 'iban' | 'crypto' | 'cash' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [bookingReference, setBookingReference] = useState('');

  // Get booking data from URL params
  useEffect(() => {
    const data = {
      cabinId: searchParams.get('cabinId') || '',
      cabinName: searchParams.get('cabinName') || '',
      checkIn: searchParams.get('checkIn') || '',
      checkOut: searchParams.get('checkOut') || '',
      guests: parseInt(searchParams.get('guests') || '2'),
      nights: parseInt(searchParams.get('nights') || '2'),
      basePrice: parseFloat(searchParams.get('basePrice') || '0'),
      cleaningFee: parseFloat(searchParams.get('cleaningFee') || '300'),
      serviceFee: parseFloat(searchParams.get('serviceFee') || '0'),
      total: parseFloat(searchParams.get('total') || '0'),
      guestName: searchParams.get('guestName') || '',
      guestEmail: searchParams.get('guestEmail') || '',
      guestPhone: searchParams.get('guestPhone') || '',
    };

    if (!data.cabinId || !data.checkIn) {
      showToast('Invalid booking data. Please try again.', 'error');
      router.push('/');
      return;
    }

    setBookingData(data);
  }, [searchParams, router, showToast]);

  const handlePaymentMethod = async (method: 'card' | 'iban' | 'crypto' | 'cash') => {
    setSelectedMethod(method);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          paymentMethod: method,
          language: 'en'
        }),
      });

      const data = await response.json();

      if (response.ok && data.bookingReference) {
        setBookingReference(data.bookingReference);
        setShowSuccessPopup(true);
        showToast('Booking created successfully!', 'success');
      } else {
        showToast(data.error || 'Booking failed', 'error');
        setIsProcessing(false);
        setSelectedMethod(null);
      }
    } catch (error) {
      console.error('Booking error:', error);
      showToast('Something went wrong. Please try again.', 'error');
      setIsProcessing(false);
      setSelectedMethod(null);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[family-name:var(--font-heading)]">
            Choose Payment Method
          </h1>
          <p className="text-gray-300 text-lg">
            Select your preferred way to complete the booking
          </p>
        </motion.div>

        {/* Booking Summary Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-white text-xl font-semibold mb-4">Booking Summary</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p className="text-sm text-gray-400">Cabin</p>
              <p className="font-semibold text-white">{bookingData.cabinName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Guest</p>
              <p className="font-semibold text-white">{bookingData.guestName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Check-in</p>
              <p className="font-semibold text-white">{new Date(bookingData.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Check-out</p>
              <p className="font-semibold text-white">{new Date(bookingData.checkOut).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total</p>
              <p className="font-semibold text-white text-xl text-[var(--green-sage)]">{bookingData.total} RON</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Nights</p>
              <p className="font-semibold text-white">{bookingData.nights} nights</p>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Credit Card */}
          <PaymentMethodCard
            icon={<CreditCard size={40} />}
            title="Credit Card"
            description="Pay securely with your card"
            gradient="from-[#667eea] to-[#764ba2]"
            badge="Most Popular"
            selected={selectedMethod === 'card'}
            disabled={isProcessing}
            onClick={() => handlePaymentMethod('card')}
          />

          {/* IBAN Transfer */}
          <PaymentMethodCard
            icon={<Building2 size={40} />}
            title="IBAN Transfer"
            description="Direct bank transfer"
            gradient="from-[#f093fb] to-[#f5576c]"
            selected={selectedMethod === 'iban'}
            disabled={isProcessing}
            onClick={() => handlePaymentMethod('iban')}
          />

          {/* Crypto */}
          <PaymentMethodCard
            icon={<Bitcoin size={40} />}
            title="Crypto ₿"
            description="Pay with Bitcoin"
            gradient="from-[#fa709a] to-[#fee140]"
            badge="Fast"
            selected={selectedMethod === 'crypto'}
            disabled={isProcessing}
            onClick={() => handlePaymentMethod('crypto')}
          />

          {/* Cash */}
          <PaymentMethodCard
            icon={<Banknote size={40} />}
            title="Cash"
            description="Pay on arrival"
            gradient="from-[#4facfe] to-[#00f2fe]"
            selected={selectedMethod === 'cash'}
            disabled={isProcessing}
            onClick={() => handlePaymentMethod('cash')}
          />
        </motion.div>

        {/* Security Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 text-sm mt-8"
        >
          🔒 All payment methods are secure and encrypted
        </motion.p>
      </div>

      {/* Success Popup */}
      {bookingData && (
        <FuturisticSuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => {
            setShowSuccessPopup(false);
            router.push('/');
          }}
          bookingDetails={{
            bookingReference,
            cabinName: bookingData.cabinName,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            guests: bookingData.guests,
            nights: bookingData.nights,
            total: bookingData.total,
            guestName: bookingData.guestName,
            guestEmail: bookingData.guestEmail
          }}
          language="en"
        />
      )}
    </div>
  );
}

function PaymentMethodCard({
  icon,
  title,
  description,
  gradient,
  badge,
  selected,
  disabled,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  badge?: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={!disabled ? { y: -8, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative bg-white/10 backdrop-blur-xl border-2 rounded-2xl p-8
        transition-all duration-300 text-left overflow-hidden
        ${selected ? 'border-[var(--green-sage)] bg-[var(--green-sage)]/20' : 'border-white/20 hover:border-white/40'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {badge && (
        <div className="absolute top-4 right-4 bg-[var(--green-sage)] text-white text-xs font-semibold px-3 py-1 rounded-full">
          {badge}
        </div>
      )}

      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 text-white`}>
        {icon}
      </div>

      <h3 className="text-white text-2xl font-bold mb-2 font-[family-name:var(--font-heading)]">
        {title}
      </h3>
      <p className="text-gray-300">{description}</p>

      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute bottom-4 right-4 w-8 h-8 bg-[var(--green-sage)] rounded-full flex items-center justify-center"
        >
          <span className="text-white text-lg">✓</span>
        </motion.div>
      )}
    </motion.button>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}
