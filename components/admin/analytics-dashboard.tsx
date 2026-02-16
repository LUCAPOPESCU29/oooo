'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  revenueByMonth: { month: string; revenue: number }[];
  bookingsByDay: { day: string; count: number }[];
  topCabins: { name: string; revenue: number; bookings: number }[];
  conversionRate: number;
  averageBookingValue: number;
  repeatCustomers: number;
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <BarChart3 className="text-purple-600" size={28} />
          Advanced Analytics
        </h2>
        <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {range === '7d' && 'Last 7 Days'}
              {range === '30d' && 'Last 30 Days'}
              {range === '90d' && 'Last 90 Days'}
              {range === '1y' && 'Last Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <Target size={32} className="mb-4 opacity-80" />
          <div className="text-3xl font-bold mb-1">{analytics.conversionRate}%</div>
          <div className="text-purple-100">Conversion Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <DollarSign size={32} className="mb-4 opacity-80" />
          <div className="text-3xl font-bold mb-1">{analytics.averageBookingValue} RON</div>
          <div className="text-blue-100">Avg. Booking Value</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <Users size={32} className="mb-4 opacity-80" />
          <div className="text-3xl font-bold mb-1">{analytics.repeatCustomers}%</div>
          <div className="text-green-100">Repeat Customers</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <Activity size={32} className="mb-4 opacity-80" />
          <div className="text-3xl font-bold mb-1">
            {analytics.revenueByMonth.reduce((sum, m) => sum + m.revenue, 0).toLocaleString()}
          </div>
          <div className="text-orange-100">Total Revenue (RON)</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-600" size={20} />
            Revenue Trend
          </h3>
          {analytics.revenueByMonth.every(m => m.revenue === 0) ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <BarChart3 size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No revenue data yet</p>
                <p className="text-xs">Create bookings to see revenue trends</p>
              </div>
            </div>
          ) : (
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.revenueByMonth.map((item, index) => {
              const maxRevenue = Math.max(...analytics.revenueByMonth.map((m) => m.revenue), 1);
              const height = maxRevenue > 0 ? Math.max((item.revenue / maxRevenue) * 100, item.revenue > 0 ? 5 : 0) : 0;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg relative group"
                    style={{ minHeight: item.revenue > 0 ? '20px' : '0' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {item.revenue.toLocaleString()} RON
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-600 font-medium">{item.month}</span>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Bookings by Day */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Bookings by Day
          </h3>
          {analytics.bookingsByDay.every(d => d.count === 0) ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Calendar size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">No booking data yet</p>
                <p className="text-xs">Create bookings to see daily patterns</p>
              </div>
            </div>
          ) : (
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.bookingsByDay.map((item, index) => {
              const maxCount = Math.max(...analytics.bookingsByDay.map((d) => d.count), 1);
              const height = maxCount > 0 ? Math.max((item.count / maxCount) * 100, item.count > 0 ? 5 : 0) : 0;
              return (
                <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group"
                    style={{ minHeight: item.count > 0 ? '20px' : '0' }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {item.count} bookings
                    </div>
                  </motion.div>
                  <span className="text-xs text-gray-600 font-medium">{item.day}</span>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </div>

      {/* Top Performing Cabins */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <PieChart className="text-purple-600" size={20} />
          Top Performing Cabins
        </h3>
        <div className="space-y-4">
          {analytics.topCabins.map((cabin, index) => (
            <motion.div
              key={cabin.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                  #{index + 1}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{cabin.name}</div>
                  <div className="text-sm text-gray-600">{cabin.bookings} bookings</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">{cabin.revenue.toLocaleString()} RON</div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
