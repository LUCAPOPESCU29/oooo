'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Check, X, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface DateChangeRequest {
  id: string;
  booking_reference: string;
  original_check_in: string;
  original_check_out: string;
  requested_check_in: string;
  requested_check_out: string;
  message: string | null;
  status: 'pending' | 'approved' | 'rejected';
  guest_name: string;
  guest_email: string;
  cabin_name: string;
  created_at: string;
}

export function DateChangeRequests() {
  const [requests, setRequests] = useState<DateChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/date-change-requests');
      const data = await response.json();
      if (data.requests) {
        setRequests(data.requests);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, newStatus: 'approved' | 'rejected') => {
    setProcessing(requestId);
    try {
      const response = await fetch('/api/admin/date-change-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        // Update local state
        setRequests(requests.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        ));
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setProcessing(null);
    }
  };

  const filteredRequests = requests.filter(req =>
    filter === 'all' ? true : req.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Date Change Requests</h2>
            <p className="text-sm text-gray-600">Manage guest date modification requests</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 font-semibold capitalize transition-all ${
              filter === tab
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
              {requests.filter(r => tab === 'all' ? true : r.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No {filter !== 'all' && filter} requests found</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-pink-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{request.cabin_name}</h3>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold">Booking:</span> {request.booking_reference}
                    </p>
                    <p>
                      <span className="font-semibold">Guest:</span> {request.guest_name} ({request.guest_email})
                    </p>
                    <p className="text-xs text-gray-500">
                      Requested {new Date(request.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Comparison */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Original Dates */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-bold text-red-900 uppercase">Original Dates</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Check-in:</span>{' '}
                      {new Date(request.original_check_in).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Check-out:</span>{' '}
                      {new Date(request.original_check_out).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Requested Dates */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-900 uppercase">Requested Dates</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold">Check-in:</span>{' '}
                      {new Date(request.requested_check_in).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">Check-out:</span>{' '}
                      {new Date(request.requested_check_out).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message */}
              {request.message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-xs font-bold text-blue-900 uppercase mb-1">Guest Message</p>
                  <p className="text-sm text-gray-700">{request.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'approved')}
                    disabled={processing === request.id}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing === request.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <Check size={16} />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(request.id, 'rejected')}
                    disabled={processing === request.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {processing === request.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <X size={16} />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
