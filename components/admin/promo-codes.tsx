'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Gift,
  Plus,
  TrendingUp,
  Calendar,
  Percent,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

interface PromoCode {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
}

export function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    maxUses: '',
    validUntil: '',
    description: ''
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/promo-codes');
      const data = await response.json();
      setPromoCodes(data.promoCodes || []);
    } catch (error) {
      console.error('Failed to fetch promo codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPromoCode = async () => {
    if (!newPromo.code || !newPromo.discountValue) {
      alert('Please fill in code and discount value');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/promo-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newPromo.code.toUpperCase(),
          discountType: newPromo.discountType,
          discountValue: newPromo.discountValue,
          maxUses: newPromo.maxUses ? Number(newPromo.maxUses) : null,
          validUntil: newPromo.validUntil || null,
          description: newPromo.description || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setPromoCodes([data.promoCode, ...promoCodes]);
        setShowCreateModal(false);
        setNewPromo({
          code: '',
          discountType: 'percentage',
          discountValue: 10,
          maxUses: '',
          validUntil: '',
          description: ''
        });
      } else {
        alert(data.error || 'Failed to create promo code');
      }
    } catch (error) {
      console.error('Failed to create promo code:', error);
      alert('Failed to create promo code');
    } finally {
      setCreating(false);
    }
  };

  const togglePromoCode = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/promo-codes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });

      if (response.ok) {
        setPromoCodes(promoCodes.map(promo =>
          promo.id === id ? { ...promo, isActive: !currentStatus } : promo
        ));
      }
    } catch (error) {
      console.error('Failed to toggle promo code:', error);
    }
  };

  const deletePromoCode = async (id: number) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      const response = await fetch(`/api/promo-codes?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPromoCodes(promoCodes.filter(promo => promo.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete promo code:', error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Copied ${code} to clipboard!`);
  };

  const totalCodes = promoCodes.length;
  const activeCodes = promoCodes.filter(p => p.isActive).length;
  const totalUses = promoCodes.reduce((sum, p) => sum + p.currentUses, 0);
  const remainingUses = promoCodes.reduce((sum, p) => {
    if (!p.maxUses) return sum + 999;
    return sum + (p.maxUses - p.currentUses);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-pink-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Gift className="text-pink-600" size={28} />
          Promo Code Manager
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Create Promo Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <Gift size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{totalCodes}</div>
          <div className="text-pink-100">Total Codes</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <TrendingUp size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{activeCodes}</div>
          <div className="text-green-100">Active Codes</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <Percent size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{totalUses}</div>
          <div className="text-blue-100">Total Uses</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <Calendar size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{remainingUses > 999 ? '∞' : remainingUses}</div>
          <div className="text-purple-100">Remaining Uses</div>
        </div>
      </div>

      {/* Promo Codes List */}
      {promoCodes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Gift size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Promo Codes Yet</h3>
          <p className="text-gray-600 mb-4">Create your first promo code to start offering discounts!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Create Promo Code
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {promoCodes.map((promo, index) => {
            const isExpired = promo.validUntil && new Date(promo.validUntil) < new Date();
            const usagePercent = promo.maxUses ? (promo.currentUses / promo.maxUses) * 100 : 0;

            return (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 font-mono tracking-wider">
                        {promo.code}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(promo.code)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Copy code"
                      >
                        <Copy size={16} className="text-gray-600" />
                      </button>
                    </div>
                    <div className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-pink-400 to-purple-500 text-white mb-2">
                      {promo.discountType === 'percentage'
                        ? `${promo.discountValue}% OFF`
                        : `${promo.discountValue} RON OFF`
                      }
                    </div>
                    {promo.description && (
                      <p className="text-sm text-gray-600 mt-2">{promo.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePromoCode(promo.id, promo.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        promo.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={promo.isActive ? 'Disable' : 'Enable'}
                    >
                      {promo.isActive ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </button>
                    <button
                      onClick={() => deletePromoCode(promo.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Usage Bar */}
                {promo.maxUses && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Usage</span>
                      <span className="font-medium">{promo.currentUses} / {promo.maxUses}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>Valid from: {new Date(promo.validFrom).toLocaleDateString()}</span>
                  </div>
                  {promo.validUntil && (
                    <div className={`flex items-center gap-1 ${isExpired ? 'text-red-600 font-bold' : ''}`}>
                      <Calendar size={14} />
                      <span>{isExpired ? 'Expired:' : 'Until:'} {new Date(promo.validUntil).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex gap-2 mt-3">
                  {!promo.isActive && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold">
                      Disabled
                    </span>
                  )}
                  {isExpired && (
                    <span className="px-2 py-1 bg-red-200 text-red-700 rounded-full text-xs font-semibold">
                      Expired
                    </span>
                  )}
                  {promo.maxUses && promo.currentUses >= promo.maxUses && (
                    <span className="px-2 py-1 bg-orange-200 text-orange-700 rounded-full text-xs font-semibold">
                      Limit Reached
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col"
          >
            <div className="p-8 overflow-y-auto flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create Promo Code</h3>

              <div className="space-y-4">
                <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Promo Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  placeholder="SUMMER2024"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 font-mono text-lg"
                />
              </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Discount Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewPromo({ ...newPromo, discountType: 'percentage' })}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        newPromo.discountType === 'percentage'
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPromo({ ...newPromo, discountType: 'fixed' })}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        newPromo.discountType === 'fixed'
                          ? 'bg-pink-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Fixed (RON)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newPromo.discountValue}
                    onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })}
                    placeholder={newPromo.discountType === 'percentage' ? '20' : '50'}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Maximum Uses (leave empty for unlimited)
                  </label>
                  <input
                    type="number"
                    value={newPromo.maxUses}
                    onChange={(e) => setNewPromo({ ...newPromo, maxUses: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Valid Until (leave empty for no expiry)
                  </label>
                  <input
                    type="date"
                    value={newPromo.validUntil}
                    onChange={(e) => setNewPromo({ ...newPromo, validUntil: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newPromo.description}
                    onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                    placeholder="20% off summer bookings"
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Fixed Bottom Buttons */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={createPromoCode}
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={20} />
                      Create Promo Code
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
