'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  DollarSign,
  Star,
  TrendingUp,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  BarChart3,
  UserCog,
  Tag,
  Wrench,
  Gift,
  Mail,
  FileText,
  Globe,
  Settings,
  Zap,
  MessageSquare
} from 'lucide-react';
import { AdminBookings } from '@/components/admin/admin-bookings';
import { AdminReviews } from '@/components/admin/admin-reviews';
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard';
import { CustomerManagement } from '@/components/admin/customer-management';
import { AdminPricing } from '@/components/admin/admin-pricing';
import { MaintenanceTracker } from '@/components/admin/maintenance-tracker';
import { PromoCodes } from '@/components/admin/promo-codes';
import { EmailCampaigns } from '@/components/admin/email-campaigns';
import { ReportsExport } from '@/components/admin/reports-export';
import { AdminSettings } from '@/components/admin/admin-settings';
import { DateChangeRequests } from '@/components/admin/date-change-requests';
import { AdminMessages } from '@/components/admin/admin-messages';
import { db } from '@/lib/db';
import { useAuth } from '@/lib/auth/auth-context';

type Tab = 'dashboard' | 'bookings' | 'messages' | 'date-requests' | 'reviews' | 'analytics' | 'customers' | 'pricing' | 'maintenance' | 'promos' | 'marketing' | 'reports' | 'settings';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  // All hooks must be called before any conditional returns
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    totalReviews: 0,
    averageRating: 0,
    cabinBookings: {} as Record<string, number>
  });

  const loadStats = async () => {
    const statistics = await db.getStatistics();
    setStats(statistics);
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Protect the route - redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/signin');
    }
  }, [user, isAdmin, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--linen-soft)] flex items-center justify-center">
        <div className="text-center">
          <Shield className="animate-spin mx-auto mb-4 text-[var(--green-deep)]" size={48} />
          <p className="text-[var(--text-body)]">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-[var(--linen-soft)] pt-20">
      {/* Header */}
      <header className="bg-white border-b border-[var(--tan-light)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[var(--brown-deep)]">
              A-Frame Admin Panel
            </h1>
            <a
              href="/"
              className="text-[var(--green-deep)] hover:text-[var(--green-sage)] font-medium"
            >
              ← Back to Site
            </a>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-sm p-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabButton
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={Home}
            label="Dashboard"
          />
          <TabButton
            active={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            icon={BarChart3}
            label="Analytics"
          />
          <TabButton
            active={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
            icon={Calendar}
            label="Bookings"
          />
          <TabButton
            active={activeTab === 'messages'}
            onClick={() => setActiveTab('messages')}
            icon={MessageSquare}
            label="Messages"
          />
          <TabButton
            active={activeTab === 'date-requests'}
            onClick={() => setActiveTab('date-requests')}
            icon={Zap}
            label="Date Requests"
          />
          <TabButton
            active={activeTab === 'customers'}
            onClick={() => setActiveTab('customers')}
            icon={UserCog}
            label="Customers"
          />
          <TabButton
            active={activeTab === 'pricing'}
            onClick={() => setActiveTab('pricing')}
            icon={Tag}
            label="Pricing"
          />
          <TabButton
            active={activeTab === 'maintenance'}
            onClick={() => setActiveTab('maintenance')}
            icon={Wrench}
            label="Maintenance"
          />
          <TabButton
            active={activeTab === 'promos'}
            onClick={() => setActiveTab('promos')}
            icon={Gift}
            label="Promos"
          />
          <TabButton
            active={activeTab === 'marketing'}
            onClick={() => setActiveTab('marketing')}
            icon={Mail}
            label="Marketing"
          />
          <TabButton
            active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
            icon={Star}
            label="Reviews"
          />
          <TabButton
            active={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
            icon={FileText}
            label="Reports"
          />
          <TabButton
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            icon={Settings}
            label="Settings"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Calendar}
                title="Total Bookings"
                value={stats.totalBookings}
                color="blue"
              />
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`${stats.totalRevenue.toFixed(0)} RON`}
                color="green"
              />
              <StatCard
                icon={Star}
                title="Average Rating"
                value={`${stats.averageRating} / 5`}
                color="yellow"
              />
              <StatCard
                icon={Users}
                title="Total Reviews"
                value={stats.totalReviews}
                color="purple"
              />
            </div>

            {/* Booking Status */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <StatusCard
                icon={CheckCircle}
                title="Confirmed"
                value={stats.confirmedBookings}
                color="green"
              />
              <StatusCard
                icon={Clock}
                title="Pending"
                value={stats.pendingBookings}
                color="yellow"
              />
              <StatusCard
                icon={XCircle}
                title="Cancelled"
                value={stats.cancelledBookings}
                color="red"
              />
            </div>

            {/* Cabin Performance */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[var(--brown-deep)] mb-4 flex items-center gap-2">
                <Home size={24} />
                Cabin Performance
              </h2>
              <div className="space-y-4">
                {Object.entries(stats.cabinBookings).map(([cabin, count]) => (
                  <div key={cabin} className="flex items-center justify-between">
                    <span className="font-medium text-[var(--brown-deep)]">{cabin}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-48 h-3 bg-[var(--linen-soft)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--green-deep)] rounded-full"
                          style={{
                            width: `${(count / Math.max(...Object.values(stats.cabinBookings))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="text-[var(--text-body)] font-medium min-w-[3rem] text-right">
                        {count} bookings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && <AdminBookings onUpdate={loadStats} />}
        {activeTab === 'messages' && <AdminMessages />}
        {activeTab === 'date-requests' && <DateChangeRequests />}
        {activeTab === 'reviews' && <AdminReviews onUpdate={loadStats} />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'customers' && <CustomerManagement />}
        {activeTab === 'pricing' && <AdminPricing />}
        {activeTab === 'maintenance' && <MaintenanceTracker />}
        {activeTab === 'promos' && <PromoCodes />}
        {activeTab === 'marketing' && <EmailCampaigns />}
        {activeTab === 'reports' && <ReportsExport />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  title,
  value,
  color
}: {
  icon: any;
  title: string;
  value: string | number;
  color: string;
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colors[color as keyof typeof colors]} flex items-center justify-center`}>
          <Icon size={24} />
        </div>
        <TrendingUp className="text-green-500" size={20} />
      </div>
      <div className="text-2xl font-bold text-[var(--brown-deep)] mb-1">{value}</div>
      <div className="text-sm text-[var(--text-body)]">{title}</div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  value,
  color
}: {
  icon: any;
  title: string;
  value: number;
  color: string;
}) {
  const colors = {
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon className={colors[color as keyof typeof colors]} size={24} />
        <h3 className="font-semibold text-[var(--brown-deep)]">{title}</h3>
      </div>
      <div className="text-3xl font-bold text-[var(--brown-deep)]">{value}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
          : 'text-[var(--text-body)] hover:bg-[var(--linen-soft)]'
      }`}
    >
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
