'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/WalletButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/contexts/WalletContext';
import { 
  User, 
  Building, 
  Settings, 
  Gem, 
  Shield, 
  Menu, 
  X,
  Sprout,
  BookOpen,
  ChevronDown,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAdmin, isConnected, address } = useWallet();
  const { t } = useLanguage();

  // Handle scroll effect and hydration
  useEffect(() => {
    setIsMounted(true);
    setIsScrolled(window.scrollY > 10);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: User, requiresAuth: true },
    { name: t('nav.biets'), href: '/biets', icon: Building },
    { name: t('nav.governance'), href: '/governance', icon: Settings },
    { name: t('nav.token'), href: '/token', icon: Gem },
  ];

  const adminNavigation = [
    { name: t('nav.adminPanel'), href: '/admin', icon: Shield },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isMounted && (isScrolled || isMenuOpen)
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-emerald-200/50 dark:border-emerald-800/50 shadow-lg' 
        : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 via-cyan-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:via-cyan-700 group-hover:to-indigo-700 transition-all duration-300">
                Biet Network
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.filter((item) => {
              // Only show items that don't require auth or when wallet is connected
              return !item.requiresAuth || isConnected;
            }).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-105"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Resources Dropdown - Always show */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:scale-105"
                >
                  <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium">{t('nav.resources')}</span>
                  <ChevronDown className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-50 min-w-[8rem]">
                <DropdownMenuItem>
                  <Link href="/whitepaper" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>{t('whitepaper.title')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/documentation" className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{t('nav.documentation')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="https://docs.bietnetwork.org" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>{t('nav.externalDocs')}</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Admin Navigation */}
            {isAdmin && (
              <>
                <div className="w-px h-6 bg-gradient-to-b from-transparent via-purple-300 to-transparent mx-2" />
                {adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex items-center space-x-2 px-4 py-2 rounded-xl text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 hover:scale-105"
                    >
                      <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          {/* Wallet Button & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center">
              <LanguageSwitcher />
            </div>
            <WalletButton />
            
            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 rounded-xl"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

          {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen py-4 border-t border-emerald-200/50 dark:border-emerald-800/50' : 'max-h-0 py-0 border-t-0'
        }`}>
          <div className="px-4 space-y-2">
            <div className="space-y-2">
              {navigationItems.filter((item) => {
                // Only show items that don't require auth or when wallet is connected
                return !item.requiresAuth || isConnected;
              }).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Resources Section - Always show */}
              <div className="pt-2">
                <div className="flex items-center space-x-3 px-4 py-2 text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium text-sm uppercase tracking-wider">{t('nav.resources')}</span>
                </div>
                <div className="ml-8 space-y-1">
                  <Link
                    href="/whitepaper"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{t('whitepaper.title')}</span>
                  </Link>
                  <Link
                    href="/documentation"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">{t('nav.documentation')}</span>
                  </Link>
                  <a
                    href="https://docs.bietnetwork.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="font-medium">{t('nav.externalDocs')}</span>
                  </a>
                </div>
              </div>
              
              {/* Language Switcher for Mobile */}
              <div className="px-4 py-3">
                <LanguageSwitcher />
              </div>
              
              {/* Admin Navigation */}
              {isAdmin && (
                <>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent my-2" />
                  {adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
