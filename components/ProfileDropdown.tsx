'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Calendar, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import './ProfileDropdown.css';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
    router.push('/');
  };

  const handleViewBookings = () => {
    setIsOpen(false);
    router.push('/my-bookings');
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="profile-avatar">
          <span>{getInitials(user.fullName)}</span>
        </div>
        <span className="profile-name">{user.fullName}</span>
        <ChevronDown
          size={16}
          className={`profile-chevron ${isOpen ? 'open' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="profile-dropdown-menu"
          >
            {/* User Info */}
            <div className="dropdown-header">
              <div className="dropdown-avatar">
                <span>{getInitials(user.fullName)}</span>
              </div>
              <div className="dropdown-user-info">
                <p className="dropdown-name">{user.fullName}</p>
                <p className="dropdown-email">{user.email}</p>
              </div>
            </div>

            <div className="dropdown-divider" />

            {/* Menu Items */}
            <div className="dropdown-items">
              <button className="dropdown-item" onClick={handleViewBookings}>
                <Calendar size={18} />
                <span>View Your Bookings</span>
              </button>

              <button
                className="dropdown-item"
                onClick={() => {
                  setIsOpen(false);
                  router.push('/settings');
                }}
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>

              {user.role === 'admin' && (
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/admin');
                  }}
                >
                  <User size={18} />
                  <span>Admin Panel</span>
                </button>
              )}

              <button className="dropdown-item danger" onClick={handleSignOut}>
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
