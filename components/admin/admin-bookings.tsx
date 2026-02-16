'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  User,
  Mail,
  Phone,
  Home,
  DollarSign,
  X,
  Check
} from 'lucide-react';
import { db, Booking } from '@/lib/db';
import { Button } from '@/components/ui/button';

interface AdminBookingsProps {
  onUpdate: () => void;
}

export function AdminBookings({ onUpdate }: AdminBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const allBookings = await db.getAllBookings();
    setBookings(allBookings.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      await db.deleteBooking(id);
      loadBookings();
      onUpdate();
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking({ ...booking });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;

    await db.updateBooking(editingBooking.id, editingBooking);
    setShowEditModal(false);
    setEditingBooking(null);
    loadBookings();
    onUpdate();
  };

  const handleStatusChange = async (id: number, status: Booking['status']) => {
    await db.updateBooking(id, { status });
    loadBookings();
    onUpdate();
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent appearance-none bg-white text-gray-900"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {booking.bookingReference}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Created: {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(booking)}
                  className="p-2 rounded-lg hover:bg-[var(--linen-soft)] text-[var(--green-deep)] transition-colors"
                  title="Edit"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--green-deep)]" />
                <span className="text-sm font-medium text-gray-900">{booking.guestName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--green-deep)]" />
                <span className="text-sm text-gray-700">{booking.guestEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home size={16} className="text-[var(--green-deep)]" />
                <span className="text-sm font-medium text-gray-900">{booking.cabinName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--green-deep)]" />
                <span className="text-sm text-gray-700">
                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--green-deep)]" />
                <span className="text-sm text-gray-700">{booking.guests} guests, {booking.nights} nights</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-[var(--green-deep)]" />
                <span className="text-sm font-bold text-gray-900">{booking.total} RON</span>
              </div>
            </div>

            {/* Quick Actions */}
            {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
              <div className="flex gap-2 pt-4 border-t border-[var(--tan-light)]">
                <Button
                  onClick={() => handleStatusChange(booking.id, 'confirmed')}
                  className="bg-green-600 text-white hover:bg-green-700 rounded-full text-sm"
                  size="sm"
                >
                  <Check size={16} className="mr-1" />
                  Confirm
                </Button>
                <Button
                  onClick={() => handleStatusChange(booking.id, 'cancelled')}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 rounded-full text-sm"
                  size="sm"
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </motion.div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar size={48} className="mx-auto text-[var(--tan-light)] mb-4" />
            <p className="text-[var(--text-body)]">No bookings found</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Edit Booking
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Guest Name
                    </label>
                    <input
                      type="text"
                      value={editingBooking.guestName}
                      onChange={(e) =>
                        setEditingBooking({ ...editingBooking, guestName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Guest Email
                    </label>
                    <input
                      type="email"
                      value={editingBooking.guestEmail}
                      onChange={(e) =>
                        setEditingBooking({ ...editingBooking, guestEmail: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      value={editingBooking.checkIn}
                      onChange={(e) =>
                        setEditingBooking({ ...editingBooking, checkIn: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={editingBooking.checkOut}
                      onChange={(e) =>
                        setEditingBooking({ ...editingBooking, checkOut: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Status
                    </label>
                    <select
                      value={editingBooking.status}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          status: e.target.value as Booking['status']
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-900 mb-2">
                      Payment Status
                    </label>
                    <select
                      value={editingBooking.paymentStatus}
                      onChange={(e) =>
                        setEditingBooking({
                          ...editingBooking,
                          paymentStatus: e.target.value as Booking['paymentStatus']
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-[var(--green-deep)] text-white hover:bg-[var(--green-sage)] rounded-full"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setShowEditModal(false)}
                    variant="outline"
                    className="flex-1 border-2 border-[var(--brown-rich)] text-[var(--brown-rich)] hover:bg-[var(--brown-rich)] hover:text-white rounded-full"
                  >
                    Cancel
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
