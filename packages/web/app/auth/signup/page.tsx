'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Call signup API endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create account');
        setIsLoading(false);
        return;
      }

      const data = await response.json();

      // Store session token and redirect to dashboard
      if (data.sessionToken) {
        // Session cookie is set by Set-Cookie header
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError('Failed to create session');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An error occurred during signup');
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
          <h1 className="text-3xl font-bold glow-accent mb-2">Get Started</h1>
          <p className="text-swarm-tertiary mb-8">Create your SyncPulse account</p>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-swarm-dark border border-swarm-accent/20 rounded-lg text-white focus:outline-none focus:border-swarm-accent/50 transition-colors"
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-swarm-dark border border-swarm-accent/20 rounded-lg text-white focus:outline-none focus:border-swarm-accent/50 transition-colors"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-swarm-dark border border-swarm-accent/20 rounded-lg text-white focus:outline-none focus:border-swarm-accent/50 transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-swarm-dark border border-swarm-accent/20 rounded-lg text-white focus:outline-none focus:border-swarm-accent/50 transition-colors"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 rounded-lg bg-swarm-accent/20 hover:bg-swarm-accent/30 text-swarm-accent hover:text-white transition-colors font-semibold border border-swarm-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-swarm-tertiary">
            Already have an account?
            <button
              onClick={() => router.push('/auth/login')}
              className="ml-2 text-swarm-accent hover:text-white transition-colors font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
