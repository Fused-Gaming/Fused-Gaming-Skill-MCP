'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import VersionBadge from './VersionBadge';

export default function LandingPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('sessionToken='));

      if (cookie) {
        const token = cookie.split('=')[1];
        setIsAuthenticated(Boolean(token && token.trim().length > 0));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-4xl mb-4"
          >
            ⚡
          </motion.div>
          <p className="text-swarm-tertiary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo and Branding */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <div className="text-6xl font-bold glow-accent mb-4">⚡ SyncPulse</div>
              <p className="text-2xl text-swarm-tertiary font-light">
                Agent Swarm Intelligence Platform
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-slate-300 mb-12 leading-relaxed max-w-2xl mx-auto"
            >
              Orchestrate, monitor, and control distributed agent swarms with unprecedented
              visibility and control. SyncPulse gives you the tools to build and manage
              intelligent agent networks at scale.
            </motion.p>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              <div className="glass p-6 rounded-lg border border-swarm-accent/20 hover:border-swarm-accent/50 transition-colors">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Control</h3>
                <p className="text-swarm-tertiary">
                  Monitor and control your agent swarms with live dashboards
                </p>
              </div>

              <div className="glass p-6 rounded-lg border border-swarm-accent/20 hover:border-swarm-accent/50 transition-colors">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-swarm-tertiary">
                  Track performance metrics and swarm behavior in real-time
                </p>
              </div>

              <div className="glass p-6 rounded-lg border border-swarm-accent/20 hover:border-swarm-accent/50 transition-colors">
                <div className="text-3xl mb-3">🔐</div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure & Scalable</h3>
                <p className="text-swarm-tertiary">
                  Enterprise-grade security for managing distributed systems
                </p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => router.push('/auth/signup')}
                className="px-8 py-3 rounded-lg bg-swarm-accent/20 hover:bg-swarm-accent/30 text-swarm-accent hover:text-white transition-all duration-300 font-semibold border border-swarm-accent/50 hover:border-swarm-accent text-lg"
              >
                Get Started Free
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="px-8 py-3 rounded-lg bg-transparent hover:bg-white/5 text-white transition-colors duration-300 font-semibold border border-white/20 hover:border-white/40 text-lg"
              >
                Sign In
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-swarm-accent/10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16 glow-accent"
          >
            Powerful Features for Swarm Intelligence
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: 'Live Swarm Visualization',
                description: 'See all agents in your swarm with real-time position and status updates',
              },
              {
                title: 'Task Management',
                description: 'Distribute, track, and monitor tasks across your agent network',
              },
              {
                title: 'Performance Monitoring',
                description: 'Comprehensive metrics on latency, throughput, and reliability',
              },
              {
                title: 'Workflow Automation',
                description: 'Create and manage complex workflows across multiple agents',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="glass p-8 rounded-lg border border-swarm-accent/20"
              >
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center glass p-12 rounded-lg border border-swarm-accent/20"
        >
          <h2 className="text-4xl font-bold mb-6 glow-accent">
            Ready to Control Your Swarms?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join the revolution in distributed agent intelligence. Start building powerful
            swarm applications today.
          </p>
          <button
            onClick={() => router.push('/auth/signup')}
            className="px-12 py-4 rounded-lg bg-swarm-accent/20 hover:bg-swarm-accent/30 text-swarm-accent hover:text-white transition-all duration-300 font-semibold border border-swarm-accent/50 hover:border-swarm-accent text-lg"
          >
            Start Your Free Trial
          </button>
        </motion.div>
      </section>

      {/* Footer with Version Badge */}
      <footer className="border-t border-swarm-accent/10 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            Copyright 2026 SyncPulse. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-sm text-slate-500 hover:text-swarm-accent transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-slate-500 hover:text-swarm-accent transition-colors">
              Terms
            </a>
            <VersionBadge variant="small" />
          </div>
        </div>
      </footer>
    </main>
  );
}
