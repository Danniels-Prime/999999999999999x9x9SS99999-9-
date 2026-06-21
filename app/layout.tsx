import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import CosmicBackground from '@/components/shared/CosmicBackground';

export const metadata: Metadata = {
  title: 'Neomonix — Language Learning OS',
  description: 'Your personal language learning universe. Neomonix spaced repetition, Language Highlands shadowing, mindset training.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CosmicBackground />
        <Navbar />
        <main className="relative z-10 md:pl-56 min-h-screen pb-24 md:pb-0">
          {children}
        </main>
      </body>
    </html>
  );
}
