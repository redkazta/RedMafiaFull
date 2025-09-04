import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CartProvider } from '@/components/providers/CartProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'LA RED MAFIA - Plataforma Musical',
  description: 'La plataforma musical más épica de Guadalajara. Descubre artistas, música y eventos únicos.',
  keywords: ['música', 'artistas', 'eventos', 'hip-hop', 'guadalajara', 'red mafia'],
  authors: [{ name: 'Kiro AI' }],
  creator: 'Kiro AI',
  publisher: 'LA RED MAFIA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'LA RED MAFIA - Plataforma Musical',
    description: 'La plataforma musical más épica de Guadalajara',
    url: '/',
    siteName: 'LA RED MAFIA',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LA RED MAFIA',
      },
    ],
    locale: 'es_MX',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LA RED MAFIA - Plataforma Musical',
    description: 'La plataforma musical más épica de Guadalajara',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${orbitron.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#ffffff',
                border: '1px solid #ef4444',
              },
              success: {
                style: {
                  border: '1px solid #10b981',
                },
              },
              error: {
                style: {
                  border: '1px solid #ef4444',
                },
              },
            }}
          />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}