import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'SyncPulse Swarm Controller',
  description: 'Artistic control interface for agent swarms',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-swarm-dark text-white overflow-x-hidden">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
