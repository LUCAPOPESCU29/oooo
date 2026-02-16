'use client';

import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  icon: string;
}

export function AzugaWeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch weather data for Azuga, Romania
    const fetchWeather = async () => {
      try {
        // Using wttr.in API - free, no API key needed
        const response = await fetch('https://wttr.in/Azuga?format=j1');
        const data = await response.json();

        const current = data.current_condition[0];
        setWeather({
          temp: Math.round(parseFloat(current.temp_C)),
          condition: current.weatherDesc[0].value,
          humidity: parseInt(current.humidity),
          windSpeed: Math.round(parseFloat(current.windspeedKmph)),
          visibility: Math.round(parseFloat(current.visibility)),
          icon: current.weatherCode
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setLoading(false);
      }
    };

    fetchWeather();
    // Update every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = () => {
    if (!weather) return Sun;
    const temp = weather.temp;
    if (temp > 25) return Sun;
    if (temp < 5 || weather.condition.toLowerCase().includes('snow')) return Cloud;
    if (weather.condition.toLowerCase().includes('rain')) return CloudRain;
    return Sun;
  };

  const WeatherIcon = getWeatherIcon();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] text-white p-6 rounded-2xl shadow-lg"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded w-24 mb-4"></div>
          <div className="h-12 bg-white/20 rounded w-32 mb-2"></div>
          <div className="h-3 bg-white/20 rounded w-20"></div>
        </div>
      </motion.div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[var(--green-deep)] to-[var(--green-sage)] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold">
            Current Weather
          </h3>
          <p className="text-sm text-white/80">Azuga, Romania</p>
        </div>
        <WeatherIcon size={40} className="text-white/90" />
      </div>

      {/* Temperature */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">{weather.temp}°</span>
          <span className="text-2xl text-white/70">C</span>
        </div>
        <p className="text-white/90 capitalize mt-1">{weather.condition}</p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20">
        <div className="flex flex-col items-center">
          <Droplets size={20} className="text-white/70 mb-1" />
          <span className="text-sm font-semibold">{weather.humidity}%</span>
          <span className="text-xs text-white/60">Humidity</span>
        </div>
        <div className="flex flex-col items-center">
          <Wind size={20} className="text-white/70 mb-1" />
          <span className="text-sm font-semibold">{weather.windSpeed}</span>
          <span className="text-xs text-white/60">km/h</span>
        </div>
        <div className="flex flex-col items-center">
          <Eye size={20} className="text-white/70 mb-1" />
          <span className="text-sm font-semibold">{weather.visibility}</span>
          <span className="text-xs text-white/60">km</span>
        </div>
      </div>
    </motion.div>
  );
}
