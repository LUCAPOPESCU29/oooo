'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  Sun,
  Snowflake,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface PricingRule {
  id: string;
  name: string;
  type: 'weekend' | 'holiday' | 'season' | 'custom';
  multiplier: number;
  startDate?: string;
  endDate?: string;
  icon: any;
  color: string;
}

export function PricingCalendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [basePrice, setBasePrice] = useState(250);
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([
    {
      id: '1',
      name: 'Weekend Premium',
      type: 'weekend',
      multiplier: 1.3,
      icon: Sun,
      color: 'from-orange-400 to-orange-500',
    },
    {
      id: '2',
      name: 'Winter Season',
      type: 'season',
      multiplier: 1.5,
      startDate: '2024-12-01',
      endDate: '2024-02-28',
      icon: Snowflake,
      color: 'from-blue-400 to-blue-500',
    },
    {
      id: '3',
      name: 'Valentine Special',
      type: 'holiday',
      multiplier: 1.8,
      startDate: '2024-02-14',
      endDate: '2024-02-14',
      icon: Heart,
      color: 'from-pink-400 to-pink-500',
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getPriceForDate = (date: number) => {
    const currentDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), date);
    const dayOfWeek = currentDate.getDay();
    let price = basePrice;

    // Check pricing rules
    pricingRules.forEach((rule) => {
      if (rule.type === 'weekend' && (dayOfWeek === 0 || dayOfWeek === 6)) {
        price *= rule.multiplier;
      }
    });

    return Math.round(price);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const prevMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Calendar className="text-green-600" size={28} />
          Dynamic Pricing Calendar
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
            <DollarSign className="text-green-600" size={20} />
            <span className="text-sm text-gray-600">Base Price:</span>
            <input
              type="number"
              value={basePrice}
              onChange={(e) => setBasePrice(Number(e.target.value))}
              className="w-20 px-2 py-1 border-2 border-gray-200 rounded text-right font-bold"
            />
            <span className="text-sm text-gray-600">RON</span>
          </div>
        </div>
      </div>

      {/* Pricing Rules */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20} />
          Active Pricing Rules
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {pricingRules.map((rule) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={rule.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-r ${rule.color} rounded-lg p-4 text-white shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={24} />
                  <h4 className="font-bold">{rule.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  <span className="text-2xl font-bold">+{((rule.multiplier - 1) * 100).toFixed(0)}%</span>
                </div>
                <div className="text-xs mt-2 opacity-90">
                  {rule.startDate && `${rule.startDate} - ${rule.endDate}`}
                  {rule.type === 'weekend' && 'Weekends (Sat-Sun)'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-xl font-bold text-gray-900">
            {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          {days.map((date) => {
            const price = getPriceForDate(date);
            const priceIncrease = ((price - basePrice) / basePrice) * 100;
            const isWeekend = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), date).getDay() % 6 === 0;

            return (
              <motion.div
                key={date}
                whileHover={{ scale: 1.05 }}
                className={`aspect-square rounded-lg p-2 border-2 transition-all cursor-pointer ${
                  isWeekend
                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300'
                    : 'bg-gray-50 border-gray-200 hover:border-green-400'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="text-sm font-bold text-gray-700">{date}</div>
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="text-xs font-bold text-green-600">{price} RON</div>
                    {priceIncrease > 0 && (
                      <div className="text-xs text-orange-600 flex items-center gap-1">
                        <TrendingUp size={10} />
                        +{priceIncrease.toFixed(0)}%
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Revenue Projection */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <DollarSign size={24} />
          Monthly Revenue Projection
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold">
              {(days.reduce((sum, date) => sum + getPriceForDate(date), 0) * 0.6).toFixed(0)} RON
            </div>
            <div className="text-green-100 text-sm">Estimated (60% occupancy)</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {(days.reduce((sum, date) => sum + getPriceForDate(date), 0) * 0.8).toFixed(0)} RON
            </div>
            <div className="text-green-100 text-sm">Optimistic (80% occupancy)</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {days.reduce((sum, date) => sum + getPriceForDate(date), 0).toFixed(0)} RON
            </div>
            <div className="text-green-100 text-sm">Maximum (100% occupancy)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
