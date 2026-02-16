'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Save, CheckCircle, Home } from 'lucide-react';

interface Cabin {
  id: number;
  cabin_id: string;
  name: string;
  price_per_night: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
}

export function AdminPricing() {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCabins();
  }, []);

  const fetchCabins = async () => {
    try {
      const response = await fetch('/api/admin/cabins');
      const data = await response.json();

      if (data.cabins) {
        setCabins(data.cabins);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cabins:', err);
      setError('Failed to load cabins');
      setLoading(false);
    }
  };

  const updatePrice = async (cabinId: string, newPrice: number) => {
    try {
      setSaving(cabinId);
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setError('Not authenticated');
        setSaving(null);
        return;
      }

      const response = await fetch('/api/admin/cabins', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          cabin_id: cabinId,
          updates: {
            price_per_night: newPrice
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSaved(cabinId);
        setError('');
        setTimeout(() => setSaved(null), 2000);
      } else {
        setError(data.error || 'Failed to update price');
      }
    } catch (err) {
      console.error('Error updating price:', err);
      setError('Failed to update price');
    } finally {
      setSaving(null);
    }
  };

  const handlePriceChange = (cabinId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCabins(cabins.map(cabin =>
        cabin.cabin_id === cabinId
          ? { ...cabin, price_per_night: numValue }
          : cabin
      ));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading cabins...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <DollarSign className="text-green-600" size={28} />
          Cabin Pricing
        </h2>
        <p className="text-gray-600 mt-1">Manage nightly rates for each cabin</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Cabins List */}
      <div className="grid md:grid-cols-2 gap-6">
        {cabins.map((cabin) => (
          <motion.div
            key={cabin.cabin_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-green-200 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Home className="text-green-600" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{cabin.name}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {cabin.bedrooms} Bedrooms · {cabin.bathrooms} Bathrooms · Up to {cabin.guests} Guests
                </p>

                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">
                      Price per Night (RON)
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={cabin.price_per_night}
                        onChange={(e) => handlePriceChange(cabin.cabin_id, e.target.value)}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 font-semibold text-lg"
                      />
                      <motion.button
                        onClick={() => updatePrice(cabin.cabin_id, cabin.price_per_night)}
                        disabled={saving === cabin.cabin_id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                          saved === cabin.cabin_id
                            ? 'bg-green-600 text-white'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {saved === cabin.cabin_id ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Save size={20} />
                        )}
                      </motion.button>
                    </div>
                  </label>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-sm text-green-800">
                      <strong>Current Rate:</strong> {cabin.price_per_night} RON per night
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {cabins.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Home className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">No cabins found</p>
        </div>
      )}
    </div>
  );
}
