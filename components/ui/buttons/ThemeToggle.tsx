'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  isScrolled?: boolean;
}

export default function ThemeToggle({ isScrolled = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative group">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle dark mode"
        className={`cursor-pointer p-2 rounded-lg transition-colors ${
          isScrolled
            ? 'text-gray-500 hover:text-amber-500 hover:bg-amber-50'
            : 'text-white/70 hover:text-amber-400 hover:bg-white/10'
        }`}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </motion.button>
      <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-lg bg-gray-900/90 px-2.5 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </div>
  );
}
