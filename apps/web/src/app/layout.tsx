import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import Navbar from '../components/Navbar';
import { VersionDisplay } from '../components/VersionDisplay';
import { WagmiProviders } from '../providers/WagmiProvider';
import { WalletProvider } from '../contexts/WalletContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { VersionProvider } from '../contexts/VersionContext';
import { ThemeProvider } from 'next-themes';
import { ServiceWorkerRegister } from '../components/ServiceWorkerRegister';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2025 Biet Network. Todos los derechos reservados.
          </p>
          <VersionDisplay />
        </div>
      </div>
    </footer>
  );
}

export const metadata: Metadata = {
  title: 'Red Biet - BietNetwork',
  description: 'Red descentralizada de unidades vivas que generan valor social, económico y ecológico',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <VersionProvider>
            <LanguageProvider>
              <WagmiProviders>
                <WalletProvider>
                  <ServiceWorkerRegister />
                  <Navbar />
                  <main className="min-h-screen pt-16">
                    {children}
                  </main>
                  <Footer />
                </WalletProvider>
              </WagmiProviders>
            </LanguageProvider>
          </VersionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
