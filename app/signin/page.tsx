'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, signInWithBiometric, biometricAvailable, biometricType } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    const result = await signIn(formData.email, formData.password);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Sign in failed');
      setLoading(false);
    }
  };

  const handleBiometricSignIn = async () => {
    setError('');
    setLoading(true);

    const result = await signInWithBiometric();

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Biometric authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--tan-base)] via-[var(--green-soft)] to-[var(--tan-light)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--brown-deep)] mb-2">
            Welcome Back
          </h1>
          <p className="text-[var(--text-body)]">
            Sign in to manage your bookings
          </p>
        </div>

        {/* Admin Login Hint */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
          <p className="text-sm text-blue-700">
            <strong>Admin Login:</strong>
            <br />
            Email: admin@aframecabins.com
            <br />
            Password: admin123
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--brown-deep)] mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-body)]" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent"
                placeholder="john@example.com"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--brown-deep)] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-body)]" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border-2 border-[var(--tan-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--green-deep)] focus:border-transparent"
                placeholder="••••••••"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-body)] hover:text-[var(--brown-deep)]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[var(--green-deep)] to-[var(--green-soft)] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Biometric Login */}
        {biometricAvailable && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[var(--text-body)]">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBiometricSignIn}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Fingerprint size={20} />
              Sign in with {biometricType}
            </button>
          </>
        )}

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-[var(--text-body)]">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="text-[var(--green-deep)] font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-[var(--text-body)] hover:text-[var(--brown-deep)] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
