'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Grid3x3, BarChart3, Cpu } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-time Sync',
      description: 'Synchronize agent swarms instantly with sub-millisecond latency for seamless coordination.',
    },
    {
      icon: <Grid3x3 className="w-8 h-8" />,
      title: 'Visual Control',
      description: 'Intuitive dashboard to visualize, manage, and control multiple concurrent agent operations.',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics',
      description: 'Comprehensive metrics and insights into agent performance, resource usage, and task completion.',
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'Scalable Architecture',
      description: 'Built for scale—deploy from small teams to enterprise-grade swarms without limits.',
    },
  ];

  const handleGetStarted = () => {
    console.log('Get Started clicked');
    // Navigate to sign up or dashboard
    window.location.href = '/';
  };

  const handleViewDemo = () => {
    console.log('View Demo clicked');
    // Navigate to demo or documentation
    window.location.href = '/#docs';
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark overflow-hidden">
      {/* Navigation */}
      <Navigation
        isAuthenticated={false}
        onLogin={() => console.log('Login clicked')}
        onMagicLink={() => console.log('Magic Link clicked')}
      />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-swarm-accent/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-swarm-tertiary/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-swarm-accent/10 border border-swarm-accent/30 rounded-full"
            >
              <div className="w-2 h-2 bg-swarm-accent rounded-full animate-pulse" />
              <span className="text-sm text-swarm-accent font-medium">Now Available</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="glow-accent">Orchestrate Your</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-swarm-accent via-swarm-tertiary to-swarm-accent">
                Agent Swarms
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              SyncPulse provides real-time control, visualization, and synchronization for your AI agent swarms.
              Scale from concept to production with confidence.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-swarm-accent to-swarm-accent text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-swarm-accent/50 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewDemo}
                className="px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-lg border border-slate-700/50 hover:border-swarm-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-swarm-accent/10 flex items-center justify-center gap-2"
              >
                View Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-swarm-accent rounded-full" />
                <span>100% Open Source</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-swarm-accent rounded-full" />
                <span>Enterprise Ready</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-swarm-accent rounded-full" />
                <span>Self-Hosted</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="glow-accent">Powerful Features</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Everything you need to manage complex agent swarms at scale
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl hover:border-swarm-accent/30 transition-all duration-300"
              >
                {/* Icon Container */}
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 bg-swarm-accent/10 rounded-lg group-hover:bg-swarm-accent/20 transition-all">
                  <div className="text-swarm-accent group-hover:text-swarm-secondary transition-colors">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-swarm-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="mt-6 h-px bg-gradient-to-r from-swarm-accent/0 via-swarm-accent/50 to-swarm-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section (Placeholder) */}
      <section id="pricing" className="relative py-24 px-6 border-t border-slate-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="glow-accent">Simple, Transparent Pricing</span>
            </h2>
            <p className="text-slate-300 mb-12">
              Start free, upgrade when you're ready. No credit card required.
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl"
            >
              <p className="text-slate-300">Pricing details coming soon</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to <span className="glow-accent">sync your swarms?</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Join developers building the future of distributed AI
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-swarm-accent to-swarm-accent text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-swarm-accent/50 inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-400">
            <div className="mb-4 sm:mb-0">
              <span className="text-swarm-accent font-semibold">SyncPulse</span> © 2025. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-swarm-accent transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-swarm-accent transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-swarm-accent transition-colors">
                Status
              </a>
              <a href="#" className="hover:text-swarm-accent transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
