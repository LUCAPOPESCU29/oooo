'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import './BookingConfirmationToast.css';

interface BookingConfirmationToastProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function BookingConfirmationToast({ isVisible, onClose }: BookingConfirmationToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
          className="booking-toast"
        >
          <div className="booking-toast-content">
            <div className="booking-toast-icon">
              <CheckCircle2 size={24} />
            </div>
            <div className="booking-toast-text">
              <h3>Booking Confirmed!</h3>
              <p>Your reservation has been saved successfully</p>
            </div>
            <button className="booking-toast-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <motion.div
            className="booking-toast-progress"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
