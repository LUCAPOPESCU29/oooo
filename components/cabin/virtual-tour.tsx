'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Sparkles,
  Camera,
  Volume2,
  VolumeX
} from 'lucide-react';

interface VirtualTourProps {
  cabinName: string;
  images: string[];
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export function VirtualTour({ cabinName, images }: VirtualTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Simulated 360° tour spots
  const tourSpots = [
    { name: 'Main Entrance', image: images[0] || '/placeholder1.jpg', description: 'Welcome to your mountain retreat' },
    { name: 'Living Room', image: images[1] || '/placeholder2.jpg', description: 'Cozy fireplace and panoramic windows' },
    { name: 'Kitchen', image: images[2] || '/placeholder3.jpg', description: 'Fully equipped modern kitchen' },
    { name: 'Bedroom', image: images[3] || '/placeholder4.jpg', description: 'Peaceful sleeping quarters' },
    { name: 'Deck View', image: images[4] || '/placeholder5.jpg', description: 'Breathtaking mountain vistas' },
  ];

  // Generate ambient particles
  useEffect(() => {
    if (isOpen) {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));
      setParticles(newParticles);
    }
  }, [isOpen]);

  // Simulated real-time weather (in production, use actual weather API)
  useEffect(() => {
    if (isOpen) {
      // Simulate fetching weather data
      const fetchWeather = () => {
        const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Snow'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

        setWeather({
          temp: Math.floor(Math.random() * 30) + 50, // 50-80°F
          condition: randomCondition,
          humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
          windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
          icon: randomCondition,
        });
      };

      fetchWeather();
      const interval = setInterval(fetchWeather, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getWeatherIcon = (condition: string) => {
    const hour = new Date().getHours();
    const isNight = hour < 6 || hour > 20;

    switch (condition) {
      case 'Clear':
        return isNight ? <Moon className="text-blue-200" size={24} /> : <Sun className="text-yellow-400" size={24} />;
      case 'Partly Cloudy':
        return <Cloud className="text-gray-400" size={24} />;
      case 'Cloudy':
        return <Cloud className="text-gray-500" size={24} />;
      case 'Light Rain':
        return <CloudRain className="text-blue-400" size={24} />;
      case 'Snow':
        return <CloudSnow className="text-blue-300" size={24} />;
      default:
        return <Cloud className="text-gray-400" size={24} />;
    }
  };

  const nextView = () => {
    setCurrentView((prev) => (prev + 1) % tourSpots.length);
  };

  const prevView = () => {
    setCurrentView((prev) => (prev - 1 + tourSpots.length) % tourSpots.length);
  };

  const currentSpot = tourSpots[currentView];

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center gap-3">
          <Sparkles className="animate-pulse" size={24} />
          <span>Launch Virtual Tour</span>
          <Camera size={24} />
        </div>
      </motion.button>

      {/* Virtual Tour Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative ${isFullscreen ? 'w-screen h-screen' : 'w-[90vw] h-[90vh] m-auto mt-[5vh]'} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30`}
            >
              {/* Ambient Particles */}
              {particles.map((particle) => (
                <motion.div
                  key={particle.id}
                  className="absolute w-2 h-2 bg-purple-400/30 rounded-full blur-sm"
                  initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
                  animate={{
                    x: [`${particle.x}%`, `${particle.x + 10}%`, `${particle.x}%`],
                    y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: Math.random() * 5 + 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                      <Sparkles className="text-purple-400" />
                      {cabinName} - Virtual Experience
                    </h2>
                    <p className="text-purple-300 text-sm">Interactive 360° Tour</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {soundEnabled ? <Volume2 className="text-white" size={20} /> : <VolumeX className="text-white" size={20} />}
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {isFullscreen ? <Minimize2 className="text-white" size={20} /> : <Maximize2 className="text-white" size={20} />}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-6 py-3 bg-red-500/20 backdrop-blur-sm rounded-lg hover:bg-red-500/30 transition-colors text-white font-semibold"
                    >
                      Exit Tour
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Image View */}
              <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentView}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full relative"
                  >
                    <img
                      src={currentSpot.image}
                      alt={currentSpot.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Image Overlay Info */}
                    <div className="absolute bottom-24 left-8 right-8">
                      <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30">
                        <h3 className="text-2xl font-bold text-white mb-2">{currentSpot.name}</h3>
                        <p className="text-purple-200">{currentSpot.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevView}
                  className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all hover:scale-110"
                >
                  <ChevronLeft className="text-white" size={32} />
                </button>
                <button
                  onClick={nextView}
                  className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-all hover:scale-110"
                >
                  <ChevronRight className="text-white" size={32} />
                </button>
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between mb-4">
                  {/* Tour Spots Thumbnails */}
                  <div className="flex gap-3">
                    {tourSpots.map((spot, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentView(index)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          currentView === index ? 'border-purple-400 scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                        }`}
                        whileHover={{ scale: currentView === index ? 1.1 : 1.05 }}
                      >
                        <img src={spot.image} alt={spot.name} className="w-full h-full object-cover" />
                        {currentView === index && (
                          <div className="absolute inset-0 bg-purple-400/30" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Real-time Weather */}
                  {weather && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          {getWeatherIcon(weather.condition)}
                          <p className="text-white text-xs mt-1">Live</p>
                        </div>
                        <div className="border-l border-white/30 pl-4">
                          <p className="text-white font-bold text-2xl flex items-center gap-2">
                            <Thermometer size={20} />
                            {weather.temp}°F
                          </p>
                          <p className="text-purple-200 text-sm">{weather.condition}</p>
                        </div>
                        <div className="border-l border-white/30 pl-4 space-y-1">
                          <p className="text-white text-sm flex items-center gap-2">
                            <Droplets size={16} className="text-blue-300" />
                            {weather.humidity}%
                          </p>
                          <p className="text-white text-sm flex items-center gap-2">
                            <Wind size={16} className="text-gray-300" />
                            {weather.windSpeed} mph
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
