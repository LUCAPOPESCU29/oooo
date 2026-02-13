'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SettingsState {
  // Appearance
  theme: 'light' | 'dark';

  // Privacy & Security (keep essential ones)
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  sessionTimeout: number;
  dataEncryption: boolean;
  analyticsTracking: boolean;
  cookieConsent: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;

  // Advanced (keep essential ones)
  dataExport: boolean;
  autoSave: boolean;
}

export const defaultSettings: SettingsState = {
  theme: 'light',
  twoFactorAuth: false,
  biometricLogin: false,
  sessionTimeout: 30,
  dataEncryption: true,
  analyticsTracking: true,
  cookieConsent: true,
  emailNotifications: true,
  pushNotifications: false,
  dataExport: true,
  autoSave: true,
};

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;
  resetSettings: () => void;
  playSound: (sound: 'click' | 'success' | 'error') => void;
  triggerHaptic: (type: 'light' | 'medium' | 'heavy') => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load settings from localStorage
    const saved = localStorage.getItem('user_settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply settings to document
    applySettings(settings);

    // Save to localStorage
    localStorage.setItem('user_settings', JSON.stringify(settings));
  }, [settings, mounted]);

  const updateSettings = (updates: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('user_settings');
  };

  const playSound = (sound: 'click' | 'success' | 'error') => {
    // Sound effects removed for simplified settings
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    // Haptic feedback removed for simplified settings
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, playSound, triggerHaptic }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Apply settings to the document
function applySettings(settings: SettingsState) {
  if (typeof window === 'undefined') return; // SSR safety check
  const root = document.documentElement;

  // Theme - only light or dark
  if (settings.theme === 'dark') {
    root.classList.add('dark-theme');
  } else {
    root.classList.remove('dark-theme');
  }
}
