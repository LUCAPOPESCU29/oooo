'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Moon, Sun, Zap, Bell, Lock, Eye, Volume2, Wifi,
  Globe, Map, Calendar, Clock, DollarSign, CreditCard, Mail,
  Smartphone, Monitor, Cpu, Database, Shield, Key, Users,
  MessageSquare, Image, Video, Music, Download, Upload, Trash2,
  Settings as SettingsIcon, Save, RotateCcw, Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import './settings.css';

interface SettingsState {
  // Appearance (10 settings)
  theme: 'light' | 'dark' | 'auto';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  animationSpeed: 'slow' | 'normal' | 'fast';
  backgroundPattern: 'none' | 'dots' | 'grid' | 'waves';
  glassEffect: boolean;
  neonGlow: boolean;
  particleEffects: boolean;
  cursorTrail: boolean;
  hoverEffects: boolean;

  // Experience (10 settings)
  soundEffects: boolean;
  hapticFeedback: boolean;
  autoPlayVideos: boolean;
  reducedMotion: boolean;
  smoothScrolling: boolean;
  pageTransitions: boolean;
  loadingAnimations: boolean;
  parallaxEffects: boolean;
  aiAssistant: boolean;
  voiceCommands: boolean;

  // Privacy & Security (8 settings)
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  sessionTimeout: number;
  dataEncryption: boolean;
  analyticsTracking: boolean;
  cookieConsent: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;

  // Advanced (7 settings)
  developerMode: boolean;
  betaFeatures: boolean;
  apiAccess: boolean;
  dataExport: boolean;
  autoSave: boolean;
  offlineMode: boolean;
  experimentalUI: boolean;
}

const defaultSettings: SettingsState = {
  theme: 'auto',
  accentColor: '#5A7A52',
  fontSize: 'medium',
  animationSpeed: 'normal',
  backgroundPattern: 'none',
  glassEffect: true,
  neonGlow: false,
  particleEffects: false,
  cursorTrail: false,
  hoverEffects: true,
  soundEffects: false,
  hapticFeedback: false,
  autoPlayVideos: false,
  reducedMotion: false,
  smoothScrolling: true,
  pageTransitions: true,
  loadingAnimations: true,
  parallaxEffects: true,
  aiAssistant: false,
  voiceCommands: false,
  twoFactorAuth: false,
  biometricLogin: false,
  sessionTimeout: 30,
  dataEncryption: true,
  analyticsTracking: true,
  cookieConsent: true,
  emailNotifications: true,
  pushNotifications: false,
  developerMode: false,
  betaFeatures: false,
  apiAccess: false,
  dataExport: true,
  autoSave: true,
  offlineMode: false,
  experimentalUI: false,
};

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');

  useEffect(() => {
    if (!user) {
      router.push('/signin');
      return;
    }

    // Load settings from localStorage
    const saved = localStorage.getItem('user_settings');
    if (saved) {
      setSettings({ ...defaultSettings, ...JSON.parse(saved) });
    }
  }, [user, router]);

  const handleChange = (key: keyof SettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('user_settings', JSON.stringify(settings));
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
      setSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'experience', label: 'Experience', icon: Zap },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Cpu },
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
              <p>Customize your experience with 35 futuristic options</p>
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
              initial={{ scale: hasChanges ? 1 : 0.95 }}
              animate={{ scale: hasChanges ? [1, 1.05, 1] : 1 }}
              transition={{ repeat: hasChanges ? Infinity : 0, duration: 2 }}
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
                <Palette size={24} />
                <h2>Appearance Settings</h2>
              </div>

              <div className="settings-grid">
                {/* Theme */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Moon size={20} />
                    <div>
                      <label>Theme Mode</label>
                      <p>Choose your preferred color scheme</p>
                    </div>
                  </div>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="setting-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                {/* Accent Color */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Palette size={20} />
                    <div>
                      <label>Accent Color</label>
                      <p>Primary color for highlights</p>
                    </div>
                  </div>
                  <input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="setting-color"
                  />
                </div>

                {/* Font Size */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Monitor size={20} />
                    <div>
                      <label>Font Size</label>
                      <p>Adjust text readability</p>
                    </div>
                  </div>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => handleChange('fontSize', e.target.value)}
                    className="setting-select"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {/* Animation Speed */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Zap size={20} />
                    <div>
                      <label>Animation Speed</label>
                      <p>Control transition timing</p>
                    </div>
                  </div>
                  <select
                    value={settings.animationSpeed}
                    onChange={(e) => handleChange('animationSpeed', e.target.value)}
                    className="setting-select"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>

                {/* Background Pattern */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Image size={20} />
                    <div>
                      <label>Background Pattern</label>
                      <p>Add visual texture</p>
                    </div>
                  </div>
                  <select
                    value={settings.backgroundPattern}
                    onChange={(e) => handleChange('backgroundPattern', e.target.value)}
                    className="setting-select"
                  >
                    <option value="none">None</option>
                    <option value="dots">Dots</option>
                    <option value="grid">Grid</option>
                    <option value="waves">Waves</option>
                  </select>
                </div>

                {/* Glass Effect */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Sparkles size={20} />
                    <div>
                      <label>Glass Effect</label>
                      <p>Frosted glass blur on cards</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.glassEffect}
                      onChange={(e) => handleChange('glassEffect', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Neon Glow */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Sun size={20} />
                    <div>
                      <label>Neon Glow</label>
                      <p>Add glowing effects to elements</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.neonGlow}
                      onChange={(e) => handleChange('neonGlow', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Particle Effects */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Sparkles size={20} />
                    <div>
                      <label>Particle Effects</label>
                      <p>Floating particles in background</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.particleEffects}
                      onChange={(e) => handleChange('particleEffects', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Cursor Trail */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Eye size={20} />
                    <div>
                      <label>Cursor Trail</label>
                      <p>Animated mouse follower</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.cursorTrail}
                      onChange={(e) => handleChange('cursorTrail', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Hover Effects */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Zap size={20} />
                    <div>
                      <label>Hover Effects</label>
                      <p>Enhanced button interactions</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.hoverEffects}
                      onChange={(e) => handleChange('hoverEffects', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="settings-section">
              <div className="section-header">
                <Zap size={24} />
                <h2>Experience Settings</h2>
              </div>

              <div className="settings-grid">
                {/* Sound Effects */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Volume2 size={20} />
                    <div>
                      <label>Sound Effects</label>
                      <p>UI interaction sounds</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.soundEffects}
                      onChange={(e) => handleChange('soundEffects', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Haptic Feedback */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Smartphone size={20} />
                    <div>
                      <label>Haptic Feedback</label>
                      <p>Vibration on mobile devices</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.hapticFeedback}
                      onChange={(e) => handleChange('hapticFeedback', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Auto-play Videos */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Video size={20} />
                    <div>
                      <label>Auto-play Videos</label>
                      <p>Start videos automatically</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.autoPlayVideos}
                      onChange={(e) => handleChange('autoPlayVideos', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Reduced Motion */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Eye size={20} />
                    <div>
                      <label>Reduced Motion</label>
                      <p>Minimize animations for accessibility</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.reducedMotion}
                      onChange={(e) => handleChange('reducedMotion', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Smooth Scrolling */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Monitor size={20} />
                    <div>
                      <label>Smooth Scrolling</label>
                      <p>Buttery scroll experience</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.smoothScrolling}
                      onChange={(e) => handleChange('smoothScrolling', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Page Transitions */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Zap size={20} />
                    <div>
                      <label>Page Transitions</label>
                      <p>Animated page changes</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.pageTransitions}
                      onChange={(e) => handleChange('pageTransitions', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Loading Animations */}
                <div className="setting-item">
                  <div className="setting-info">
                    <RotateCcw size={20} />
                    <div>
                      <label>Loading Animations</label>
                      <p>Spinners and skeletons</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.loadingAnimations}
                      onChange={(e) => handleChange('loadingAnimations', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Parallax Effects */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Image size={20} />
                    <div>
                      <label>Parallax Effects</label>
                      <p>Depth scrolling effects</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.parallaxEffects}
                      onChange={(e) => handleChange('parallaxEffects', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* AI Assistant */}
                <div className="setting-item">
                  <div className="setting-info">
                    <MessageSquare size={20} />
                    <div>
                      <label>AI Assistant</label>
                      <p>Smart booking helper</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.aiAssistant}
                      onChange={(e) => handleChange('aiAssistant', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Voice Commands */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Volume2 size={20} />
                    <div>
                      <label>Voice Commands</label>
                      <p>Control with your voice</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.voiceCommands}
                      onChange={(e) => handleChange('voiceCommands', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
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
                    <Lock size={20} />
                    <div>
                      <label>Two-Factor Authentication</label>
                      <p>Extra security layer</p>
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
                    <Key size={20} />
                    <div>
                      <label>Biometric Login</label>
                      <p>Fingerprint/Face ID</p>
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
                    <Clock size={20} />
                    <div>
                      <label>Session Timeout</label>
                      <p>Auto-logout after (minutes)</p>
                    </div>
                  </div>
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleChange('sessionTimeout', Number(e.target.value))}
                    className="setting-select"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                {/* Data Encryption */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Database size={20} />
                    <div>
                      <label>Data Encryption</label>
                      <p>Encrypt local storage</p>
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
                    <Eye size={20} />
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
                    <Globe size={20} />
                    <div>
                      <label>Cookie Consent</label>
                      <p>Allow cookies</p>
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
                      <p>Booking updates via email</p>
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
                      <p>Browser notifications</p>
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
                <Cpu size={24} />
                <h2>Advanced Settings</h2>
              </div>

              <div className="settings-grid">
                {/* Developer Mode */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Cpu size={20} />
                    <div>
                      <label>Developer Mode</label>
                      <p>Debug tools and console</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.developerMode}
                      onChange={(e) => handleChange('developerMode', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Beta Features */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Sparkles size={20} />
                    <div>
                      <label>Beta Features</label>
                      <p>Try experimental features</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.betaFeatures}
                      onChange={(e) => handleChange('betaFeatures', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* API Access */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Wifi size={20} />
                    <div>
                      <label>API Access</label>
                      <p>Enable API integration</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.apiAccess}
                      onChange={(e) => handleChange('apiAccess', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

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

                {/* Offline Mode */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Wifi size={20} />
                    <div>
                      <label>Offline Mode</label>
                      <p>Work without internet</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.offlineMode}
                      onChange={(e) => handleChange('offlineMode', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {/* Experimental UI */}
                <div className="setting-item">
                  <div className="setting-info">
                    <Monitor size={20} />
                    <div>
                      <label>Experimental UI</label>
                      <p>Next-gen interface</p>
                    </div>
                  </div>
                  <label className="setting-toggle">
                    <input
                      type="checkbox"
                      checked={settings.experimentalUI}
                      onChange={(e) => handleChange('experimentalUI', e.target.checked)}
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
