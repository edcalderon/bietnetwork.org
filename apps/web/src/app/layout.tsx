import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import { WagmiProviders } from '../providers/WagmiProvider';
import { WalletProvider } from '../contexts/WalletContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { VersionProvider } from '../contexts/VersionContext';

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
    <html lang="es" className="h-full">
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <VersionProvider>
          <LanguageProvider>
            <WagmiProviders>
              <WalletProvider>
                <Navbar />
              <main className="min-h-screen pt-16">
                {children}
              </main>
              <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Biet Network. Todos los derechos reservados.
                  </p>
                </div>
              </footer>
            </WalletProvider>
          </WagmiProviders>
        </LanguageProvider>
        </VersionProvider>
      </body>
    </html>
  );
}
