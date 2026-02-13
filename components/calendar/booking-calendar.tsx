'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface BookingCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date | null;
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  unavailableDates?: string[]; // Changed to string array for easier comparison
  minDate?: Date;
  language?: 'en' | 'ro';
  selectingCheckOut?: boolean;
}

export function BookingCalendar({
  onDateSelect,
  selectedDate,
  checkInDate,
  checkOutDate,
  unavailableDates = [],
  minDate = new Date(),
  language = 'en',
  selectingCheckOut = false
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = {
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    ro: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie']
  };

  const dayNames = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    ro: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm']
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateUnavailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return unavailableDates.includes(dateString);
  };

  const isDatePast = (date: Date) => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isDateSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const isCheckInDate = (date: Date) => {
    return checkInDate?.toDateString() === date.toDateString();
  };

  const isCheckOutDate = (date: Date) => {
    return checkOutDate?.toDateString() === date.toDateString();
  };

  const isInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    return date > checkInDate && date < checkOutDate;
  };

  const isInvalidCheckOut = (date: Date) => {
    // If not selecting check-out, or no check-in selected, return false
    if (!selectingCheckOut || !checkInDate) return false;

    // If date is before or same as check-in, it's invalid
    if (date <= checkInDate) return false;

    // Check if any date between check-in and this date is booked
    const datesInRange: string[] = [];
    for (let d = new Date(checkInDate); d < date; d.setDate(d.getDate() + 1)) {
      datesInRange.push(d.toISOString().split('T')[0]);
    }

    return datesInRange.some(dateStr => unavailableDates.includes(dateStr));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

    // Don't allow clicking past or unavailable dates
    if (isDatePast(date) || isDateUnavailable(date)) {
      return;
    }

    // If selecting check-out date, verify no booked dates in range
    if (selectingCheckOut && checkInDate && date > checkInDate) {
      // Check all dates between check-in and proposed check-out
      const datesInRange: string[] = [];
      for (let d = new Date(checkInDate); d < date; d.setDate(d.getDate() + 1)) {
        datesInRange.push(d.toISOString().split('T')[0]);
      }

      // If any date in range is booked, don't allow this selection
      const hasBookedDate = datesInRange.some(dateStr => unavailableDates.includes(dateStr));
      if (hasBookedDate) {
        return; // Don't proceed with selection
      }
    }

    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const canGoPrevious = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    const prevMonthLastDay = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
    return prevMonthLastDay >= today;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="bg-gradient-to-br from-white to-[var(--linen-soft)] rounded-3xl shadow-2xl p-8 border border-[var(--tan-light)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={previousMonth}
          disabled={!canGoPrevious()}
          className={`p-3 rounded-full transition-all duration-200 ${
            canGoPrevious()
              ? 'hover:bg-[var(--green-deep)] hover:text-white bg-[var(--linen-soft)] text-[var(--brown-deep)]'
              : 'opacity-30 cursor-not-allowed bg-[var(--linen-soft)] text-[var(--text-body)]'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-[var(--green-deep)]" />
          <h3 className="text-xl font-bold text-[var(--brown-deep)]">
            {monthNames[language][currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>

        <button
          onClick={nextMonth}
          className="p-3 rounded-full hover:bg-[var(--green-deep)] hover:text-white bg-[var(--linen-soft)] text-[var(--brown-deep)] transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames[language].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-bold text-[var(--green-deep)] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days */}
        {days.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const isPast = isDatePast(date);
          const isUnavailable = isDateUnavailable(date);
          const invalidCheckOut = isInvalidCheckOut(date);
          const isSelected = isDateSelected(date);
          const isTodayDate = isToday(date);
          const isCheckIn = isCheckInDate(date);
          const isCheckOut = isCheckOutDate(date);
          const inRange = isInRange(date);
          const isDisabled = isPast || isUnavailable || invalidCheckOut;

          return (
            <motion.button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.05 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              transition={{ duration: 0.1 }}
              className={`
                aspect-square rounded-xl flex items-center justify-center text-sm font-semibold
                transition-all duration-100 relative overflow-hidden
                ${isCheckIn || isCheckOut
                  ? 'bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] text-white shadow-lg z-10'
                  : inRange
                    ? 'bg-[var(--green-sage)]/20 text-[var(--green-deep)]'
                    : isSelected
                      ? 'bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] text-white shadow-lg'
                      : isTodayDate && !isPast
                        ? 'bg-white border-2 border-[var(--green-deep)] text-[var(--green-deep)]'
                        : isDisabled
                          ? 'text-gray-300 cursor-not-allowed bg-gray-50/50'
                          : 'text-[var(--brown-deep)] hover:bg-[var(--green-sage)]/10 hover:border hover:border-[var(--green-sage)]'
                }
              `}
            >
              {/* Strikethrough effect for booked dates */}
              {isUnavailable && !isPast && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-px bg-red-500/60" />
                </div>
              )}

              {/* Day number */}
              <span className="relative z-10">{day}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
