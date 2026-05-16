'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from '@/hooks/useSession';

function MagicLinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyMagicLink = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('No magic link token provided');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/magic-link/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Invalid or expired magic link');
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        login(data.sessionToken, data.expiresIn);
        router.push('/dashboard');
      } catch {
        setError('An error occurred while verifying your magic link');
        setIsLoading(false);
      }
    };

    verifyMagicLink();
  }, [searchParams, login, router]);

  return (
    <div className="glass p-8 rounded-lg border border-swarm-accent/20">
      {isLoading ? (
        <>
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-2 border-swarm-accent border-t-transparent rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold glow-accent text-center mb-2">
            Verifying your link
          </h1>
          <p className="text-swarm-tertiary text-center">Please wait while we sign you in...</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold glow-accent mb-2">Sign In Failed</h1>
          <p className="text-swarm-tertiary mb-6">{error}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/magic-link-request')}
              className="w-full px-4 py-2 rounded-lg bg-swarm-accent/20 hover:bg-swarm-accent/30 text-swarm-accent hover:text-white transition-colors font-semibold border border-swarm-accent/50"
            >
              Request New Magic Link
            </button>

            <button
              onClick={() => router.push('/auth/login')}
              className="w-full px-4 py-2 rounded-lg bg-slate-700/20 hover:bg-slate-700/30 text-slate-300 hover:text-white transition-colors font-semibold border border-slate-600/50"
            >
              Sign In With Password
            </button>
          </div>

          <div className="mt-6 p-3 bg-swarm-dark border border-swarm-accent/10 rounded-lg text-xs text-slate-400">
            <p className="mb-1">Common issues:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Link may have expired (they're valid for 15 minutes)</li>
              <li>Link may have already been used</li>
              <li>Check that you copied the entire URL</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default function MagicLinkPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Suspense
          fallback={
            <div className="glass p-8 rounded-lg border border-swarm-accent/20">
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-2 border-swarm-accent border-t-transparent rounded-full"
                />
              </div>
              <h1 className="text-2xl font-bold glow-accent text-center mb-2">Loading...</h1>
            </div>
          }
        >
          <MagicLinkContent />
        </Suspense>
      </motion.div>
    </main>
  );
}
