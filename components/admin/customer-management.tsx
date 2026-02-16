'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Ban,
  Check,
  X,
  MessageSquare,
  Gift,
  Loader2,
  Percent
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  averageRating: number;
  lastBooking: string;
  status: 'active' | 'blocked';
  vipStatus: boolean;
}

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCustomerStatus = (customerId: string) => {
    setCustomers(
      customers.map((c) =>
        c.id === customerId ? { ...c, status: c.status === 'active' ? 'blocked' : 'active' } : c
      )
    );
  };

  const toggleVIPStatus = (customerId: string) => {
    setCustomers(customers.map((c) => (c.id === customerId ? { ...c, vipStatus: !c.vipStatus } : c)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* VIP Info Banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Percent size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">VIP Member Benefits</h3>
            <p className="text-yellow-50">
              Customers with 3+ bookings automatically receive VIP status and get <strong>10% discount</strong> on all future bookings!
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="text-blue-600" size={28} />
          Customer Management
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>
      </div>

      {/* Customers Grid */}
      {customers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Users size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Customers Yet</h3>
          <p className="text-gray-600">Customers will appear here once they make bookings</p>
        </div>
      ) : (
      <div className="grid gap-4">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                  {customer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                    {customer.vipStatus && (
                      <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Gift size={12} />
                        VIP (10% OFF)
                      </span>
                    )}
                    {customer.status === 'blocked' && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        BLOCKED
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-700">Last: {new Date(customer.lastBooking).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-gray-700">{customer.averageRating > 0 ? `${customer.averageRating} avg rating` : 'No ratings yet'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{customer.totalBookings}</div>
                      <div className="text-xs text-gray-600">Bookings</div>
                    </div>
                    <div className="px-4 py-2 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{customer.totalSpent} RON</div>
                      <div className="text-xs text-gray-600">Total Spent</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setShowEmailModal(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm"
                >
                  <MessageSquare size={16} />
                  Email
                </button>
                <button
                  onClick={() => toggleVIPStatus(customer.id)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                    customer.vipStatus
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Gift size={16} />
                  {customer.vipStatus ? 'Remove VIP' : 'Make VIP'}
                </button>
                <button
                  onClick={() => toggleCustomerStatus(customer.id)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                    customer.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {customer.status === 'active' ? (
                    <>
                      <Ban size={16} />
                      Block
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Unblock
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Send Email to {selectedCustomer.name}</h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message..."
                  />
                </div>
                <button className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                  Send Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
