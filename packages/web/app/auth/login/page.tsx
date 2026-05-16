'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/useSession';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading: sessionLoading } = useSession();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      login(data.sessionToken, data.expiresIn);
      router.push('/dashboard');
    } catch {
      setError('An error occurred during login');
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
          <h1 className="text-3xl font-bold glow-accent mb-2">Welcome Back</h1>
          <p className="text-swarm-tertiary mb-8">Sign in to your SyncPulse account</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                disabled={isLoading || sessionLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-swarm-dark border border-swarm-accent/20 rounded-lg text-white focus:outline-none focus:border-swarm-accent/50 transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoading || sessionLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || sessionLoading}
              className="w-full px-4 py-2 rounded-lg bg-swarm-accent/20 hover:bg-swarm-accent/30 text-swarm-accent hover:text-white transition-colors font-semibold border border-swarm-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-swarm-tertiary">
            Don't have an account?
            <button
              onClick={() => router.push('/auth/signup')}
              className="ml-2 text-swarm-accent hover:text-white transition-colors font-semibold"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-4 p-3 bg-swarm-dark border border-swarm-accent/10 rounded-lg text-xs text-slate-400">
            <p className="font-semibold text-white mb-1">Demo Credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: demo</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
