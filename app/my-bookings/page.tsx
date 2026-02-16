'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, CreditCard, ChevronRight, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import './my-bookings.css';

interface Booking {
  id: number;
  booking_reference: string;
  cabin_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  created_at: string;
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    fetchBookings();
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/user/bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      } else {
        setError('Failed to load bookings');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    return method ? method.toUpperCase() : 'N/A';
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setSendingMessage(true);
    try {
      const response = await fetch('/api/user/contact-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.fullName,
          userEmail: user?.email,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Message sent successfully! An admin will contact you soon.');
        setShowMessageModal(false);
        setMessage('');
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="bookings-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <div className="bookings-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bookings-header"
        >
          <div className="header-content">
            <h1>Your Bookings</h1>
            <p>Manage and track all your cabin reservations</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{bookings.length}</span>
              <span className="stat-label">Total Bookings</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {bookings.filter(b => b.status === 'confirmed').length}
              </span>
              <span className="stat-label">Confirmed</span>
            </div>
            <button
              onClick={() => setShowMessageModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, var(--green-deep), var(--green-sage))',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <MessageSquare size={18} />
              <span>Contact Admin</span>
            </button>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="empty-state"
          >
            <Calendar size={64} className="empty-icon" />
            <h2>No Bookings Yet</h2>
            <p>Start planning your mountain escape!</p>
            <button
              className="browse-btn"
              onClick={() => router.push('/')}
            >
              Browse Cabins
            </button>
          </motion.div>
        )}

        {/* Bookings Grid */}
        {bookings.length > 0 && (
          <div className="bookings-grid">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="booking-card"
              >
                {/* Card Header */}
                <div className="card-header">
                  <div className="cabin-info">
                    <h3>{booking.cabin_name || 'Unknown Cabin'}</h3>
                    <span className="booking-ref">
                      #{booking.booking_reference || `BK${booking.id}`}
                    </span>
                  </div>
                  <span className={`status-badge ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  {/* Dates */}
                  <div className="info-row">
                    <div className="info-item">
                      <Calendar size={18} />
                      <div className="info-text">
                        <span className="info-label">Check-in</span>
                        <span className="info-value">{formatDate(booking.check_in)}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="arrow-icon" />
                    <div className="info-item">
                      <Calendar size={18} />
                      <div className="info-text">
                        <span className="info-label">Check-out</span>
                        <span className="info-value">{formatDate(booking.check_out)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="details-grid">
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{booking.nights} nights</span>
                    </div>
                    <div className="detail-item">
                      <Users size={16} />
                      <span>{booking.guests} guests</span>
                    </div>
                    <div className="detail-item">
                      <CreditCard size={16} />
                      <span>{getPaymentMethodIcon(booking.payment_method)}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer">
                  <div className="total-price">
                    <span className="price-label">Total</span>
                    <span className="price-value">{booking.total.toFixed(2)} RON</span>
                  </div>
                  <span className={`payment-status ${booking.payment_status === 'paid' ? 'paid' : 'pending'}`}>
                    {booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={() => setShowMessageModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--green-deep), var(--green-sage))',
                padding: '24px',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageSquare size={32} color="white" />
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                    Contact Admin
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', margin: '4px 0 0' }}>
                    Send a message to our support team
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  User: <span style={{ fontWeight: 'bold', color: 'var(--green-deep)' }}>{user?.fullName || user?.email}</span>
                </p>
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here... (e.g., questions about bookings, requests, feedback)"
                style={{
                  width: '100%',
                  height: '160px',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  resize: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#111827',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--green-sage)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                maxLength={500}
              />
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', textAlign: 'right' }}>
                {message.length}/500
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button
                  onClick={() => setShowMessageModal(false)}
                  style={{
                    flex: 1,
                    height: '48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    background: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--green-sage)';
                    e.currentTarget.style.color = 'var(--green-deep)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#374151';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendingMessage}
                  style={{
                    flex: 1,
                    height: '48px',
                    background: !message.trim() || sendingMessage
                      ? '#d1d5db'
                      : 'linear-gradient(135deg, var(--green-deep), var(--green-sage))',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: !message.trim() || sendingMessage ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                  onMouseOver={(e) => {
                    if (message.trim() && !sendingMessage) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Send size={18} />
                  <span>{sendingMessage ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
