import type { Metadata } from 'next';
import './globals.css';
import { Suspense } from 'react';
import { AuthProvider } from '@/lib/auth/auth-context';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Matematika Milliy Sertifikat Platformasi | Milliy Sertifikatga Professional Tayyorgarlik',
  description: 'O‘zbekiston Respublikasi Matematika fani bo‘yicha Milliy Sertifikat imtihoniga professional onlayn tayyorgarlik platformasi. 9,500+ test savollari, formulalar kutubxonasi, xatolar ustida ishlash.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="antialiased min-h-screen flex flex-col bg-[#F8F6FC] text-[#1A1A2E]">
        <AuthProvider>
          <Suspense fallback={<div className="h-16 bg-white border-b border-gray-100" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
