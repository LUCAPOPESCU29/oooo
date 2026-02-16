'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, User, Clock, CheckCircle, X, Send } from 'lucide-react';

interface UserMessage {
  id: number;
  user_id?: number;
  user_name: string;
  user_email: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  booking_reference?: string;
}

export function AdminMessages() {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages', {
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

  const markAsRead = async (messageId: number) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ messageId, status: 'read' })
      });

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, status: 'read' } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const response = await fetch('/api/admin/messages/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          messageId: selectedMessage.id,
          userEmail: selectedMessage.user_email,
          replyText: replyText.trim()
        })
      });

      if (response.ok) {
        alert('Reply sent successfully!');
        setReplyText('');
        setMessages(messages.map(msg =>
          msg.id === selectedMessage.id ? { ...msg, status: 'replied' } : msg
        ));
        setSelectedMessage(null);
      } else {
        alert('Failed to send reply');
      }
    } catch (error) {
      alert('Error sending reply');
    } finally {
      setSendingReply(false);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800 border-red-300';
      case 'read': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'replied': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--green-sage)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-[var(--green-sage)]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">User Messages</h2>
            <p className="text-sm text-gray-600">
              {messages.filter(m => m.status === 'unread').length} unread messages
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['all', 'unread', 'read', 'replied'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-[var(--green-sage)] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages to display</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-xl border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                msg.status === 'unread' ? 'border-[var(--green-sage)] bg-green-50/30' : 'border-gray-200'
              }`}
              onClick={() => {
                setSelectedMessage(msg);
                if (msg.status === 'unread') {
                  markAsRead(msg.id);
                }
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{msg.user_name}</p>
                    <p className="text-sm text-gray-600">{msg.user_email}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(msg.status)}`}>
                    {msg.status}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {msg.booking_reference && (
                <p className="text-xs text-gray-500 mb-2">
                  Booking: <span className="font-semibold text-[var(--green-deep)]">{msg.booking_reference}</span>
                </p>
              )}

              <p className="text-gray-700 text-sm line-clamp-2">{msg.message}</p>
            </motion.div>
          ))
        )}
      </div>

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
                      <p className="text-white/80 text-sm">{selectedMessage.user_name}</p>
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
                {/* User Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedMessage.user_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedMessage.status)}`}>
                        {selectedMessage.status}
                      </span>
                    </div>
                    {selectedMessage.booking_reference && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Booking Reference</p>
                        <p className="text-sm font-semibold text-[var(--green-deep)]">{selectedMessage.booking_reference}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Received</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Message</p>
                  <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-5">
                    <p className="text-gray-900 font-medium text-base leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Reply Section */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Send Reply (Email will be sent to user)</p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl resize-none focus:outline-none focus:border-[var(--green-sage)] transition-colors text-gray-900 bg-white placeholder:text-gray-400 font-medium"
                    maxLength={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">{replyText.length}/1000</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="flex-1 h-12 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sendingReply}
                    className="flex-1 h-12 bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-sage)] text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {sendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
