'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Moon, Sun, Shield, Lock, Key, Mail, Bell, Database, Download, Save, RotateCcw,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/lib/settings/settings-context';
import './settings.css';

export default function SettingsPage() {
  const auth = useAuth();
  const { user } = auth;
  const router = useRouter();
  const { settings, updateSettings, resetSettings: contextReset } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }
  }, [user, router]);

  const handleChange = (key: string, value: any) => {
    updateSettings({ [key]: value });
    setHasChanges(true);
  };

  const saveSettings = () => {
    setHasChanges(false);

    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'save-toast';
    toast.textContent = '✓ Settings saved successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const resetSettings = () => {
    if (confirm('Reset all settings to default?')) {
      contextReset();
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Moon },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Database },
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="settings-header"
        >
          <div className="header-content">
            <SettingsIcon size={32} className="header-icon" />
            <div>
              <h1>Settings</h1>
              <p>Manage your preferences</p>
            </div>
          </div>
          <div className="header-actions">
            {hasChanges && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="reset-btn"
                onClick={resetSettings}
              >
                <RotateCcw size={18} />
                Reset
              </motion.button>
            )}
            <motion.button
              className={`save-btn ${hasChanges ? 'active' : ''}`}
              onClick={saveSettings}
              disabled={!hasChanges}
            >
              <Save size={18} />
              {hasChanges ? 'Save Changes' : 'Saved'}
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="settings-content"
        >
          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="settings-section">
              <div className="section-header">
                <Moon size={24} />
                <h2>Appearance</h2>
              </div>

              <div className="settings-grid">
                {/* Theme */}
                <div className="setting-item">
                  <div className="setting-info">
                    {settings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                    <div>
                      <label>Theme</label>
                      <p>Choose light or dark mode</p>
                    </div>
                  </div>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="setting-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY & SECURITY TAB */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <div className="section-header">
                <Shield size={24} />
                <h2>Privacy & Security</h2>
              </div>

              <div className="settings-grid">
                {/* Two-Factor Auth */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Key size={20} />
                    <div>
                      <label>Two-Factor Authentication</label>
                      <p>Add extra security to your account</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Biometric Login */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Lock size={20} />
                    <div>
                      <label>Biometric Login</label>
                      <p>Use fingerprint or face recognition</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.biometricLogin}
                      onChange={(e) => handleChange('biometricLogin', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Session Timeout */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Shield size={20} />
                    <div>
                      <label>Session Timeout</label>
                      <p>Auto logout after inactivity (minutes)</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                    className="setting-input"
                    min="5"
                    max="120"
                  />
                </div>

                {/* Data Encryption */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Lock size={20} />
                    <div>
                      <label>Data Encryption</label>
                      <p>Encrypt sensitive data</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.dataEncryption}
                      onChange={(e) => handleChange('dataEncryption', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Analytics Tracking */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Database size={20} />
                    <div>
                      <label>Analytics Tracking</label>
                      <p>Help improve our service</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.analyticsTracking}
                      onChange={(e) => handleChange('analyticsTracking', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Cookie Consent */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Database size={20} />
                    <div>
                      <label>Cookie Consent</label>
                      <p>Allow cookies for better experience</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.cookieConsent}
                      onChange={(e) => handleChange('cookieConsent', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Email Notifications */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Mail size={20} />
                    <div>
                      <label>Email Notifications</label>
                      <p>Receive updates via email</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Push Notifications */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Bell size={20} />
                    <div>
                      <label>Push Notifications</label>
                      <p>Receive browser notifications</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div className="settings-section">
              <div className="section-header">
                <Database size={24} />
                <h2>Advanced</h2>
              </div>

              <div className="settings-grid">
                {/* Data Export */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Download size={20} />
                    <div>
                      <label>Data Export</label>
                      <p>Download your data</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.dataExport}
                      onChange={(e) => handleChange('dataExport', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Auto Save */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Save size={20} />
                    <div>
                      <label>Auto Save</label>
                      <p>Automatically save changes</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleChange('autoSave', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
