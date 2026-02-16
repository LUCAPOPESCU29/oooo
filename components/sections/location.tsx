'use client';

import { motion } from 'framer-motion';
import { MapPin, Car, Plane, Backpack } from 'lucide-react';
import { FadeIn } from '@/components/animations/fade-in';
import { useLanguage } from '@/components/providers/language-provider';
import { InteractiveMap } from '@/components/map/interactive-map';
import { AzugaWeatherWidget } from '@/components/widgets/AzugaWeatherWidget';
import { LocalInfoWidget } from '@/components/widgets/LocalInfoWidget';

export function Location() {
  const { t } = useLanguage();

  const locationInfo = [
    {
      icon: Car,
      title: t.location.hoursFrom,
      description: 'Easy scenic drive along mountain highways',
    },
    {
      icon: Plane,
      title: t.location.nearestAirport,
      description: 'Henri Coandă International Airport (Bucharest)',
    },
    {
      icon: Backpack,
      title: t.location.whatToBring,
      description: t.location.bringDescription,
    },
  ];
  return (
    <section className="py-20 md:py-32 bg-[var(--linen-soft)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[var(--brown-deep)] font-semibold mb-4">
            {t.location.title}
          </h2>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <InteractiveMap latitude={45.44580} longitude={25.57525} language={t.location.title === 'Find Us' ? 'en' : 'ro'} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">

          {/* Location Info - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="space-y-8"
          >
            {/* Address */}
            <div>
              <div className="flex items-start gap-3 mb-4">
                <MapPin size={24} className="text-[var(--green-deep)] mt-1" strokeWidth={1.5} />
                <div>
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--brown-deep)] font-semibold mb-2">
                    {t.location.ourLocation}
                  </h3>
                  <p className="text-[var(--text-body)]">
                    Azuga, Prahova County<br />
                    Carpathian Mountains<br />
                    Romania
                  </p>
                </div>
              </div>
            </div>

            {/* Getting Here */}
            <div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl text-[var(--brown-deep)] font-semibold mb-4">
                {t.location.gettingHere}
              </h3>
              <p className="text-[var(--text-body)] leading-relaxed">
                {t.location.directions}
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {locationInfo.map((info) => {
                const Icon = info.icon;
                return (
                  <div
                    key={info.title}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm"
                  >
                    <Icon
                      size={28}
                      className="text-[var(--green-deep)] flex-shrink-0 mt-1"
                      strokeWidth={1.5}
                    />
                    <div>
                      <h4 className="font-[family-name:var(--font-body)] font-semibold text-[var(--brown-deep)] mb-1">
                        {info.title}
                      </h4>
                      <p className="text-[var(--text-body)] text-sm">
                        {info.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Widgets - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
            className="space-y-6"
          >
            {/* Weather Widget */}
            <AzugaWeatherWidget />

            {/* Local Info Widgets */}
            <LocalInfoWidget />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
