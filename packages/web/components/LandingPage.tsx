'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import GlassmorphCard from './GlassmorphCard';
import Button from './Button';
import PageFooter from './PageFooter';

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
      <div className="min-h-screen bg-gradient-to-br from-[#050508] via-slate-900 to-[#050508] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mb-4"
          >
            <Icon name="pulse" size={48} color="#667eea" />
          </motion.div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#050508] via-slate-900 to-[#050508] flex flex-col">
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
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon name="pulse" size={56} color="#667eea" />
                <div className="text-6xl font-bold glow-accent">SyncPulse</div>
              </div>
              <p className="text-2xl text-white/60 font-light">
                Agent Swarm Intelligence Platform
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-white/70 mb-12 leading-relaxed max-w-2xl mx-auto"
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
              <GlassmorphCard>
                <div className="mb-3">
                  <Icon name="zap" size={32} color="#A855F7" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Control</h3>
                <p className="text-white/60">
                  Monitor and control your agent swarms with live dashboards
                </p>
              </GlassmorphCard>

              <GlassmorphCard>
                <div className="mb-3">
                  <Icon name="chart" size={32} color="#A855F7" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Analytics</h3>
                <p className="text-white/60">
                  Track performance metrics and swarm behavior in real-time
                </p>
              </GlassmorphCard>

              <GlassmorphCard>
                <div className="mb-3">
                  <Icon name="shield" size={32} color="#A855F7" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Secure & Scalable</h3>
                <p className="text-white/60">
                  Enterprise-grade security for managing distributed systems
                </p>
              </GlassmorphCard>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/auth/signup')}
              >
                Get Started Free
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => router.push('/auth/login')}
              >
                Sign In
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-white/10">
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
              >
                <GlassmorphCard>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">
                    {feature.description}
                  </p>
                </GlassmorphCard>
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
          className="max-w-4xl mx-auto text-center"
        >
          <GlassmorphCard>
            <h2 className="text-4xl font-bold mb-6 glow-accent">
              Ready to Control Your Swarms?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join the revolution in distributed agent intelligence. Start building powerful
              swarm applications today.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/auth/signup')}
            >
              Start Your Free Trial
            </Button>
          </GlassmorphCard>
        </motion.div>
      </section>

      {/* Footer */}
      <PageFooter
        items={[]}
        showVersion={true}
        showStatus={true}
        showCopyright={true}
        links={[
          { label: 'Privacy', href: '/privacy' },
          { label: 'Terms', href: '/terms' },
        ]}
      />
    </main>
  );
}
