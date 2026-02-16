'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  DollarSign,
  Calendar,
  Mail,
  Globe,
  Bell,
  Shield,
  Clock,
  Percent,
  Home,
  Save,
  CheckCircle
} from 'lucide-react';

interface SystemSettings {
  // Pricing Settings
  cleaningFee: number;
  serviceFeePercent: number;
  taxPercent: number;

  // Booking Settings
  minBookingDays: number;
  maxBookingDays: number;
  advanceBookingDays: number;
  checkInTime: string;
  checkOutTime: string;

  // Payment Settings
  requireDeposit: boolean;
  depositPercent: number;
  acceptedPaymentMethods: string[];

  // Email Notifications
  emailNewBooking: boolean;
  emailCancellation: boolean;
  emailReview: boolean;
  emailMaintenance: boolean;

  // Business Settings
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  currency: string;
  timezone: string;

  // Cancellation Policy
  cancellationDays: number;
  refundPercent: number;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    cleaningFee: 50,
    serviceFeePercent: 10,
    taxPercent: 19,
    minBookingDays: 2,
    maxBookingDays: 30,
    advanceBookingDays: 365,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    requireDeposit: true,
    depositPercent: 30,
    acceptedPaymentMethods: ['card', 'bank_transfer', 'cash'],
    emailNewBooking: true,
    emailCancellation: true,
    emailReview: true,
    emailMaintenance: true,
    businessName: 'A-Frame Cabins',
    businessEmail: 'contact@aframecabins.com',
    businessPhone: '+40 123 456 789',
    currency: 'RON',
    timezone: 'Europe/Bucharest',
    cancellationDays: 7,
    refundPercent: 100
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch settings from database on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.settings) {
        const dbSettings = data.settings;

        // Map database fields to component state
        setSettings({
          cleaningFee: Number(dbSettings.cleaning_fee) || 50,
          serviceFeePercent: Number(dbSettings.service_fee_percentage) || 10,
          taxPercent: Number(dbSettings.tax_vat_percentage) || 19,
          currency: dbSettings.currency || 'RON',
          minBookingDays: dbSettings.minimum_booking_days || 2,
          maxBookingDays: dbSettings.maximum_booking_days || 30,
          advanceBookingDays: dbSettings.advance_booking_limit_days || 365,
          checkInTime: dbSettings.check_in_time || '15:00',
          checkOutTime: dbSettings.check_out_time || '11:00',
          requireDeposit: dbSettings.require_deposit || false,
          depositPercent: Number(dbSettings.deposit_amount_percentage) || 30,
          acceptedPaymentMethods: [
            dbSettings.accept_credit_debit && 'card',
            dbSettings.accept_bank_transfer && 'bank_transfer',
            dbSettings.accept_cash && 'cash'
          ].filter(Boolean) as string[],
          // Keep these as default for now (not in database yet)
          emailNewBooking: true,
          emailCancellation: true,
          emailReview: true,
          emailMaintenance: true,
          businessName: 'A-Frame Cabins',
          businessEmail: 'contact@aframecabins.com',
          businessPhone: '+40 123 456 789',
          timezone: 'Europe/Bucharest',
          cancellationDays: 7,
          refundPercent: 100
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      // Map component state to database fields
      const dbSettings = {
        cleaning_fee: settings.cleaningFee,
        service_fee_percentage: settings.serviceFeePercent,
        tax_vat_percentage: settings.taxPercent,
        currency: settings.currency,
        minimum_booking_days: settings.minBookingDays,
        maximum_booking_days: settings.maxBookingDays,
        advance_booking_limit_days: settings.advanceBookingDays,
        check_in_time: settings.checkInTime,
        check_out_time: settings.checkOutTime,
        require_deposit: settings.requireDeposit,
        deposit_amount_percentage: settings.depositPercent,
        accept_credit_debit: settings.acceptedPaymentMethods.includes('card'),
        accept_bank_transfer: settings.acceptedPaymentMethods.includes('bank_transfer'),
        accept_cash: settings.acceptedPaymentMethods.includes('cash')
      };

      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dbSettings)
      });

      const data = await response.json();

      if (response.ok) {
        setSaved(true);
        setError('');
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="text-blue-600" size={28} />
            System Settings
          </h2>
          <p className="text-gray-600 mt-1">Configure your cabin booking system</p>
        </div>
        <motion.button
          onClick={saveSettings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle size={20} />
              Saved!
            </>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </motion.button>
      </div>

      {/* Settings Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pricing Settings */}
        <SettingsCard
          title="Pricing Settings"
          icon={DollarSign}
          color="green"
        >
          <SettingInput
            label="Cleaning Fee (RON)"
            type="number"
            value={settings.cleaningFee}
            onChange={(v) => updateSetting('cleaningFee', Number(v))}
          />
          <SettingInput
            label="Service Fee (%)"
            type="number"
            value={settings.serviceFeePercent}
            onChange={(v) => updateSetting('serviceFeePercent', Number(v))}
          />
          <SettingInput
            label="Tax/VAT (%)"
            type="number"
            value={settings.taxPercent}
            onChange={(v) => updateSetting('taxPercent', Number(v))}
          />
          <SettingSelect
            label="Currency"
            value={settings.currency}
            onChange={(v) => updateSetting('currency', v)}
            options={[
              { value: 'RON', label: 'Romanian Leu (RON)' },
              { value: 'EUR', label: 'Euro (EUR)' },
              { value: 'USD', label: 'US Dollar (USD)' }
            ]}
          />
        </SettingsCard>

        {/* Booking Settings */}
        <SettingsCard
          title="Booking Rules"
          icon={Calendar}
          color="blue"
        >
          <SettingInput
            label="Minimum Booking (days)"
            type="number"
            value={settings.minBookingDays}
            onChange={(v) => updateSetting('minBookingDays', Number(v))}
          />
          <SettingInput
            label="Maximum Booking (days)"
            type="number"
            value={settings.maxBookingDays}
            onChange={(v) => updateSetting('maxBookingDays', Number(v))}
          />
          <SettingInput
            label="Advance Booking Limit (days)"
            type="number"
            value={settings.advanceBookingDays}
            onChange={(v) => updateSetting('advanceBookingDays', Number(v))}
          />
        </SettingsCard>

        {/* Check-in/out Times */}
        <SettingsCard
          title="Check-in & Check-out"
          icon={Clock}
          color="purple"
        >
          <SettingInput
            label="Check-in Time"
            type="time"
            value={settings.checkInTime}
            onChange={(v) => updateSetting('checkInTime', v)}
          />
          <SettingInput
            label="Check-out Time"
            type="time"
            value={settings.checkOutTime}
            onChange={(v) => updateSetting('checkOutTime', v)}
          />
          <SettingSelect
            label="Timezone"
            value={settings.timezone}
            onChange={(v) => updateSetting('timezone', v)}
            options={[
              { value: 'Europe/Bucharest', label: 'Europe/Bucharest (GMT+2)' },
              { value: 'Europe/London', label: 'Europe/London (GMT+0)' },
              { value: 'America/New_York', label: 'America/New York (GMT-5)' }
            ]}
          />
        </SettingsCard>

        {/* Payment Settings */}
        <SettingsCard
          title="Payment Settings"
          icon={Percent}
          color="orange"
        >
          <SettingToggle
            label="Require Deposit"
            value={settings.requireDeposit}
            onChange={(v) => updateSetting('requireDeposit', v)}
          />
          {settings.requireDeposit && (
            <SettingInput
              label="Deposit Amount (%)"
              type="number"
              value={settings.depositPercent}
              onChange={(v) => updateSetting('depositPercent', Number(v))}
            />
          )}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Accepted Payment Methods
            </label>
            <div className="space-y-2">
              <SettingCheckbox
                label="Credit/Debit Card"
                checked={settings.acceptedPaymentMethods.includes('card')}
                onChange={(checked) => {
                  const methods = checked
                    ? [...settings.acceptedPaymentMethods, 'card']
                    : settings.acceptedPaymentMethods.filter(m => m !== 'card');
                  updateSetting('acceptedPaymentMethods', methods);
                }}
              />
              <SettingCheckbox
                label="Bank Transfer"
                checked={settings.acceptedPaymentMethods.includes('bank_transfer')}
                onChange={(checked) => {
                  const methods = checked
                    ? [...settings.acceptedPaymentMethods, 'bank_transfer']
                    : settings.acceptedPaymentMethods.filter(m => m !== 'bank_transfer');
                  updateSetting('acceptedPaymentMethods', methods);
                }}
              />
              <SettingCheckbox
                label="Cash on Arrival"
                checked={settings.acceptedPaymentMethods.includes('cash')}
                onChange={(checked) => {
                  const methods = checked
                    ? [...settings.acceptedPaymentMethods, 'cash']
                    : settings.acceptedPaymentMethods.filter(m => m !== 'cash');
                  updateSetting('acceptedPaymentMethods', methods);
                }}
              />
            </div>
          </div>
        </SettingsCard>

        {/* Cancellation Policy */}
        <SettingsCard
          title="Cancellation Policy"
          icon={Shield}
          color="red"
        >
          <SettingInput
            label="Free Cancellation (days before check-in)"
            type="number"
            value={settings.cancellationDays}
            onChange={(v) => updateSetting('cancellationDays', Number(v))}
          />
          <SettingInput
            label="Refund Amount (%)"
            type="number"
            value={settings.refundPercent}
            onChange={(v) => updateSetting('refundPercent', Number(v))}
          />
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>Policy:</strong> Guests can cancel up to {settings.cancellationDays} days before check-in
            and receive a {settings.refundPercent}% refund.
          </div>
        </SettingsCard>

        {/* Email Notifications */}
        <SettingsCard
          title="Email Notifications"
          icon={Bell}
          color="yellow"
        >
          <SettingToggle
            label="New Booking Notifications"
            value={settings.emailNewBooking}
            onChange={(v) => updateSetting('emailNewBooking', v)}
          />
          <SettingToggle
            label="Cancellation Notifications"
            value={settings.emailCancellation}
            onChange={(v) => updateSetting('emailCancellation', v)}
          />
          <SettingToggle
            label="New Review Notifications"
            value={settings.emailReview}
            onChange={(v) => updateSetting('emailReview', v)}
          />
          <SettingToggle
            label="Maintenance Issue Notifications"
            value={settings.emailMaintenance}
            onChange={(v) => updateSetting('emailMaintenance', v)}
          />
        </SettingsCard>

        {/* Business Information */}
        <SettingsCard
          title="Business Information"
          icon={Home}
          color="indigo"
        >
          <SettingInput
            label="Business Name"
            type="text"
            value={settings.businessName}
            onChange={(v) => updateSetting('businessName', v)}
          />
          <SettingInput
            label="Contact Email"
            type="email"
            value={settings.businessEmail}
            onChange={(v) => updateSetting('businessEmail', v)}
          />
          <SettingInput
            label="Contact Phone"
            type="tel"
            value={settings.businessPhone}
            onChange={(v) => updateSetting('businessPhone', v)}
          />
        </SettingsCard>
      </div>
    </div>
  );
}

// Helper Components

function SettingsCard({
  title,
  icon: Icon,
  color,
  children
}: {
  title: string;
  icon: any;
  color: string;
  children: React.ReactNode;
}) {
  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon className={colorClasses[color as keyof typeof colorClasses]} size={24} />
        {title}
      </h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function SettingInput({
  label,
  type,
  value,
  onChange
}: {
  label: string;
  type: string;
  value: string | number;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
      />
    </div>
  );
}

function SettingSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SettingToggle({
  label,
  value,
  onChange
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-gray-900">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

function SettingCheckbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <span className="text-sm text-gray-900">{label}</span>
    </label>
  );
}
