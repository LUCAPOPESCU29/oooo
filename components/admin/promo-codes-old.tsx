'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Plus, Percent, Calendar, TrendingUp, Copy, Trash2, Edit } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  uses: number;
  maxUses: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export function PromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    {
      id: '1',
      code: 'WINTER2024',
      discount: 20,
      type: 'percentage',
      uses: 45,
      maxUses: 100,
      validFrom: '2024-01-01',
      validUntil: '2024-02-28',
      active: true,
    },
    {
      id: '2',
      code: 'NEWGUEST50',
      discount: 50,
      type: 'fixed',
      uses: 12,
      maxUses: 50,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      active: true,
    },
  ]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  };

  const togglePromoCode = (id: string) => {
    setPromoCodes(promoCodes.map((promo) => (promo.id === id ? { ...promo, active: !promo.active } : promo)));
  };

  const deletePromoCode = (id: string) => {
    setPromoCodes(promoCodes.filter((promo) => promo.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Gift className="text-pink-600" size={28} />
          Promo Code Manager
        </h2>
        <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2">
          <Plus size={20} />
          Create Promo Code
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <Gift size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{promoCodes.length}</div>
          <div className="text-pink-100">Total Codes</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <TrendingUp size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{promoCodes.filter((p) => p.active).length}</div>
          <div className="text-green-100">Active Codes</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <Percent size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">{promoCodes.reduce((sum, p) => sum + p.uses, 0)}</div>
          <div className="text-blue-100">Total Uses</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <Calendar size={32} className="mb-3 opacity-80" />
          <div className="text-3xl font-bold">
            {promoCodes.reduce((sum, p) => sum + (p.maxUses - p.uses), 0)}
          </div>
          <div className="text-purple-100">Remaining Uses</div>
        </div>
      </div>

      {/* Promo Codes List */}
      <div className="grid md:grid-cols-2 gap-6">
        {promoCodes.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`rounded-xl shadow-lg p-6 ${
              promo.active ? 'bg-white' : 'bg-gray-100 opacity-60'
            } hover:shadow-xl transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900 font-mono">{promo.code}</h3>
                  {!promo.active && (
                    <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">
                      DISABLED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-bold text-xl">
                    {promo.type === 'percentage' ? `${promo.discount}%` : `${promo.discount} RON`} OFF
                  </div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(promo.code)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy code"
              >
                <Copy size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Usage Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Usage</span>
                <span className="font-bold">
                  {promo.uses} / {promo.maxUses}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(promo.uses / promo.maxUses) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{promo.validFrom}</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{promo.validUntil}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => togglePromoCode(promo.id)}
                className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                  promo.active
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {promo.active ? 'Disable' : 'Enable'}
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                <Edit size={18} />
              </button>
              <button
                onClick={() => deletePromoCode(promo.id)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
