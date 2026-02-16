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
    if (!selectedDate) return false;
    return selectedDate.toDateString() === date.toDateString();
  };

  const isCheckInDate = (date: Date) => {
    if (!checkInDate) return false;
    return checkInDate.toDateString() === date.toDateString();
  };

  const isCheckOutDate = (date: Date) => {
    if (!checkOutDate) return false;
    return checkOutDate.toDateString() === date.toDateString();
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
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--green-deep)] via-[var(--green-sage)] to-[var(--green-deep)] px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              previousMonth();
            }}
            disabled={!canGoPrevious()}
            className={`group p-2 rounded-xl transition-all duration-300 ${
              canGoPrevious()
                ? 'hover:bg-white/25 bg-white/15 text-white shadow-lg hover:shadow-xl hover:scale-110'
                : 'opacity-30 cursor-not-allowed bg-white/10 text-white/50'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-white drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-white drop-shadow-md tracking-tight">
                {monthNames[language][currentMonth.getMonth()]}
              </h3>
            </div>
            <span className="text-white/90 text-xs font-semibold tracking-wider mt-0.5">{currentMonth.getFullYear()}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextMonth();
            }}
            className="group p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames[language].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-gray-600 uppercase tracking-wide py-1.5 bg-gray-100/50 rounded-lg"
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
              onClick={(e) => {
                e.stopPropagation();
                handleDateClick(day);
              }}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.08, y: -2 } : {}}
              whileTap={!isDisabled ? { scale: 0.95 } : {}}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={`
                aspect-square rounded-xl flex items-center justify-center text-base font-bold
                transition-all duration-300 relative overflow-hidden shadow-sm
                ${isCheckIn || isCheckOut
                  ? 'bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] text-white shadow-xl ring-4 ring-[var(--green-sage)]/30 scale-105'
                  : inRange
                    ? 'bg-gradient-to-br from-[var(--green-sage)]/20 to-[var(--green-sage)]/10 text-[var(--green-deep)] border-2 border-[var(--green-sage)]/30'
                    : isSelected
                      ? 'bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] text-white shadow-lg ring-2 ring-[var(--green-sage)]/40'
                      : isDisabled
                        ? 'text-gray-300 cursor-not-allowed bg-gray-100/50 opacity-50'
                        : isTodayDate && !isPast
                          ? 'text-[var(--green-deep)] bg-white hover:bg-gradient-to-br hover:from-[var(--green-sage)]/10 hover:to-[var(--green-sage)]/5 border-2 border-[var(--green-sage)] shadow-md hover:shadow-lg'
                          : 'text-gray-700 bg-white hover:bg-gradient-to-br hover:from-[var(--green-sage)]/10 hover:to-[var(--green-sage)]/5 hover:text-[var(--green-deep)] border border-gray-200 hover:border-[var(--green-sage)] hover:shadow-lg'
                }
              `}
            >
              {/* Strikethrough effect for booked dates */}
              {isUnavailable && !isPast && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-full h-1 bg-red-500 rounded-full shadow-sm" />
                </div>
              )}

              {/* Background glow for selected dates */}
              {(isCheckIn || isCheckOut) && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
              )}

              {/* Day number */}
              <span className="relative z-10 drop-shadow-sm">{day}</span>

              {/* Today indicator dot */}
              {isTodayDate && !isPast && !isCheckIn && !isCheckOut && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--green-sage)] rounded-full shadow-sm" />
              )}
            </motion.button>
          );
        })}
        </div>
      </div>
    </motion.div>
  );
}
