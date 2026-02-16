'use client';

import { useEffect, useState } from 'react';
import { Mountain, Clock, Thermometer, Trees } from 'lucide-react';
import { motion } from 'framer-motion';

export function LocalInfoWidget() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Bucharest',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const time = new Intl.DateTimeFormat('en-GB', options).format(new Date());
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const infoItems = [
    {
      icon: Mountain,
      label: 'Elevation',
      value: '1,000m',
      description: 'Above sea level'
    },
    {
      icon: Clock,
      label: 'Local Time',
      value: currentTime,
      description: 'EET (UTC+2)'
    },
    {
      icon: Thermometer,
      label: 'Season',
      value: getCurrentSeason(),
      description: 'Current season'
    },
    {
      icon: Trees,
      label: 'Forest Type',
      value: 'Coniferous',
      description: 'Pine & Spruce'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      {infoItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--green-soft)] rounded-lg">
                <Icon size={24} className="text-[var(--green-deep)]" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm text-[var(--text-body)]">{item.label}</span>
                </div>
                <p className="font-[family-name:var(--font-body)] text-lg font-semibold text-[var(--brown-deep)]">
                  {item.value}
                </p>
                <p className="text-xs text-[var(--text-body)] mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
}
