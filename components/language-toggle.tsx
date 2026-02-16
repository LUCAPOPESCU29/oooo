'use client';

import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/components/providers/language-provider';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 rounded-full border-2 border-[var(--green-deep)] text-[var(--green-deep)] hover:bg-[var(--green-deep)] hover:text-white transition-all"
      aria-label="Toggle language"
    >
      <Languages size={18} />
      <motion.span
        key={language}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="font-semibold uppercase"
      >
        {language}
      </motion.span>
    </Button>
  );
}
