import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SyncPulse Authentication',
  description: 'First-time login and authentication for SyncPulse Swarm Controller',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
    </div>
  );
}
