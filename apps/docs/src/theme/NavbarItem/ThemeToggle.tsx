import React, { useState, useEffect } from 'react';
import { useColorMode, useThemeConfig } from '@docusaurus/theme-common';
import { Moon, Sun } from 'lucide-react';
import { cn } from '../../../lib/utils';

function ThemeToggle() {
  const { colorMode, setColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && colorMode === 'dark';

  const handleThemeChange = () => {
    setColorMode(isDark ? 'light' : 'dark');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleThemeChange();
    }
  };

  if (!mounted) {
    // Return placeholder to avoid layout shift
    return (
      <div className="flex w-16 h-8 p-1 rounded-full transition-all duration-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" />
    );
  }

  return (
    <button
      className={cn(
        // Base styles
        "flex w-16 h-8 p-1 rounded-full transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "focus:ring-offset-white dark:focus:ring-offset-zinc-900",
        
        // Dark mode styles
        isDark 
          ? "bg-zinc-900 border border-zinc-800 focus:ring-zinc-700" 
          : "bg-white border border-zinc-200 focus:ring-zinc-400",
      )}
      onClick={handleThemeChange}
      onKeyDown={handleKeyDown}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="flex justify-between items-center w-full">
        {/* Active theme indicator */}
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 shadow-sm",
            isDark 
              ? "transform translate-x-0 bg-zinc-800 border border-zinc-700" 
              : "transform translate-x-8 bg-white border border-zinc-300 shadow-md"
          )}
        >
          {isDark ? (
            <Moon 
              className="w-4 h-4 text-zinc-300" 
              strokeWidth={1.5}
            />
          ) : (
            <Sun 
              className="w-4 h-4 text-amber-500" 
              strokeWidth={1.5}
            />
          )}
        </div>
        
        {/* Inactive theme indicator */}
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-all duration-300 opacity-50",
            isDark 
              ? "" 
              : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun 
              className="w-4 h-4 text-zinc-500" 
              strokeWidth={1.5}
            />
          ) : (
            <Moon 
              className="w-4 h-4 text-zinc-400" 
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </button>
  );
}

export default ThemeToggle;
