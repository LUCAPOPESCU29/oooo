'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  isBiometricAvailable,
  isBiometricRegistered,
  registerBiometric,
  authenticateBiometric,
  removeBiometric,
  getBiometricType,
} from './biometric-auth';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  isAdmin: boolean;
  // Biometric authentication
  biometricAvailable: boolean;
  biometricRegistered: boolean;
  biometricType: string;
  registerBiometricAuth: () => Promise<{ success: boolean; error?: string }>;
  signInWithBiometric: () => Promise<{ success: boolean; error?: string }>;
  removeBiometricAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verify token and get user
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Check biometric availability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBiometricAvailable(isBiometricAvailable());
      setBiometricType(getBiometricType());
    }
  }, []);

  // Check if biometric is registered for current user
  useEffect(() => {
    if (user) {
      setBiometricRegistered(isBiometricRegistered(user.id.toString()));
    } else {
      setBiometricRegistered(false);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Sign in failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Sign up failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const signOut = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  // Biometric Authentication Methods

  const registerBiometricAuth = async () => {
    if (!user) {
      return { success: false, error: 'You must be signed in to register biometric authentication' };
    }

    const result = await registerBiometric(
      user.id.toString(),
      user.fullName,
      user.email
    );

    if (result.success) {
      setBiometricRegistered(true);
    }

    return result;
  };

  const signInWithBiometric = async () => {
    try {
      // Get the last signed-in user's email from localStorage
      const lastEmail = localStorage.getItem('last_biometric_email');
      if (!lastEmail) {
        return { success: false, error: 'No biometric authentication configured. Please sign in normally first.' };
      }

      // First, authenticate with biometric
      const storedUserId = localStorage.getItem('last_user_id');
      if (!storedUserId) {
        return { success: false, error: 'Biometric authentication failed' };
      }

      const bioResult = await authenticateBiometric(storedUserId);
      if (!bioResult.success) {
        return bioResult;
      }

      // If biometric succeeds, get the stored token
      const token = localStorage.getItem('auth_token');
      if (token) {
        const userResponse = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          return { success: true };
        }
      }

      return { success: false, error: 'Failed to authenticate. Please sign in with password.' };
    } catch (error) {
      console.error('Biometric sign-in error:', error);
      return { success: false, error: 'Biometric authentication failed' };
    }
  };

  const removeBiometricAuth = () => {
    if (user) {
      removeBiometric(user.id.toString());
      setBiometricRegistered(false);
      localStorage.removeItem('last_biometric_email');
      localStorage.removeItem('last_user_id');
    }
  };

  // Store user info for biometric login
  useEffect(() => {
    if (user && biometricRegistered) {
      localStorage.setItem('last_biometric_email', user.email);
      localStorage.setItem('last_user_id', user.id.toString());
    }
  }, [user, biometricRegistered]);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin,
      biometricAvailable,
      biometricRegistered,
      biometricType,
      registerBiometricAuth,
      signInWithBiometric,
      removeBiometricAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
