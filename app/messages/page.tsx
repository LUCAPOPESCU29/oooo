'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, Clock, Send, X, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

interface Message {
  id: number;
  message: string;
  status: string;
  created_at: string;
  booking_reference?: string;
  admin_reply?: string;
  replied_at?: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/user/messages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const response = await fetch('/api/user/contact-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          userName: user?.fullName || 'User',
          userEmail: user?.email || ''
        })
      });

      if (response.ok) {
        setNewMessage('');
        setShowNewMessageModal(false);
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const getStatusBadge = (msg: Message) => {
    if (msg.admin_reply) {
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-300">Replied</span>;
    }
    if (msg.status === 'read') {
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-300">Read</span>;
    }
    return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-300">Pending</span>;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--linen-soft)] flex items-center justify-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--green-sage)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--linen-soft)] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Messages</h1>
                <p className="text-gray-600">View your conversations with admin</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-6 py-3 bg-[var(--green-sage)] hover:bg-[var(--green-deep)] text-white rounded-full font-semibold transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              New Message
            </button>
          </div>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-6">No messages yet</p>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-8 py-3 bg-[var(--green-sage)] hover:bg-[var(--green-deep)] text-white rounded-full font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send Your First Message
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                  msg.admin_reply ? 'border-green-300 bg-green-50/30' : 'border-gray-200'
                }`}
                onClick={() => setSelectedMessage(msg)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(msg)}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {msg.booking_reference && (
                      <p className="text-xs text-gray-500 mb-2">
                        Booking: <span className="font-semibold text-[var(--green-deep)]">{msg.booking_reference}</span>
                      </p>
                    )}
                  </div>
                  {msg.admin_reply && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-semibold">Admin Replied</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-700 line-clamp-2">{msg.message}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Message Detail Modal */}
        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedMessage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-sage)] p-6 sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-8 h-8 text-white" />
                      <div>
                        <h3 className="text-xl font-bold text-white">Message Details</h3>
                        <p className="text-white/80 text-sm">
                          {new Date(selectedMessage.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Your Message */}
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-2">Your Message</p>
                    <div className="bg-white border-2 border-gray-400 rounded-xl p-5 shadow-sm">
                      <p className="text-gray-900 font-medium text-base leading-relaxed whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>

                  {/* Admin Reply */}
                  {selectedMessage.admin_reply ? (
                    <div>
                      <p className="text-sm font-bold text-gray-900 mb-2">
                        Admin Reply - {selectedMessage.replied_at && new Date(selectedMessage.replied_at).toLocaleDateString()}
                      </p>
                      <div className="bg-green-50 border-2 border-green-400 rounded-xl p-5 shadow-sm">
                        <p className="text-gray-900 font-medium text-base leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.admin_reply}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 text-center shadow-sm">
                      <Clock className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                      <p className="text-blue-900 font-bold text-lg">Waiting for admin reply...</p>
                      <p className="text-blue-700 text-base mt-2">We'll notify you when the admin responds</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Message Modal */}
        <AnimatePresence>
          {showNewMessageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowNewMessageModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-sage)] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">New Message</h3>
                    <button
                      onClick={() => setShowNewMessageModal(false)}
                      className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message to the admin..."
                    className="w-full h-48 p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-[var(--green-sage)] transition-colors text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-right">{newMessage.length}/500</p>

                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                    className="w-full mt-4 px-6 py-4 bg-[var(--green-sage)] hover:bg-[var(--green-deep)] text-white rounded-full font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingMessage ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
