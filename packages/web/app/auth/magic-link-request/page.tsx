'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MagicLinkRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRequestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/magic-link/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to send magic link');
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setEmail('');
      // Don't navigate away - let user see success message
    } catch {
      setError('An error occurred while sending the magic link');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-lg border border-swarm-accent/20">
          <h1 className="text-3xl font-bold glow-accent mb-2">Passwordless Login</h1>
          <p className="text-swarm-tertiary mb-8">
            We'll send you a secure link to sign in without a password
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300"
            >
              <p className="font-semibold mb-2">Check your email</p>
              <p className="text-sm">
                We've sent a magic link to {email}. Click the link in the email to continue.
              </p>
            </motion.div>
          )}

          {!success && (
            <form onSubmit={handleRequestMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-swarm-dark border border-swarm-accent/20 rounded-lg text-white focus:outline-none focus:border-swarm-accent/50 transition-colors"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-swarm-accent/20 hover:bg-swarm-accent/30 text-swarm-accent hover:text-white transition-colors font-semibold border border-swarm-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending link...' : 'Send Magic Link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-swarm-tertiary">
            <button
              onClick={() => router.push('/auth/login')}
              className="text-swarm-accent hover:text-white transition-colors font-semibold"
            >
              Back to Sign In
            </button>
          </div>

          <div className="mt-4 p-3 bg-swarm-dark border border-swarm-accent/10 rounded-lg text-xs text-slate-400">
            <p className="font-semibold text-white mb-1">How it works:</p>
            <p>1. Enter your email address</p>
            <p>2. Click the link in the email we send you</p>
            <p>3. You'll be signed in automatically</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
