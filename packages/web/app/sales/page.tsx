'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import PricingPlans from '@/components/PricingPlans';
import FeatureGrid from '@/components/FeatureGrid';
import FeaturedSection from '@/components/FeaturedSection';
import { useState } from 'react';

export default function SalesPage() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactSales = () => {
    setShowContactModal(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark">
      {/* Navigation */}
      <header className="border-b border-swarm-accent/20 sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold glow-accent">⚡ SyncPulse</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-slate-300 hover:text-swarm-accent transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-300 hover:text-swarm-accent transition-colors"
              >
                Pricing
              </a>
              <motion.a
                href="/signin"
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 bg-swarm-accent text-swarm-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-swarm-accent/50 transition-all"
              >
                Sign In
              </motion.a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-swarm-accent rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-swarm-secondary rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block mb-6"
            >
              <span className="text-swarm-accent font-mono text-sm font-bold tracking-widest px-4 py-2 rounded-full bg-swarm-accent/10 border border-swarm-accent/30">
                ORCHESTRATE INTELLIGENT SWARMS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold glow-accent mb-6 leading-tight"
            >
              Command Your AI Swarms<br />with Precision & Scale
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              SyncPulse is the enterprise platform for coordinating intelligent agents.
              Orchestrate thousands of agents, monitor performance in real-time, and
              optimize costs automatically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-swarm-accent text-swarm-dark rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-swarm-accent/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-slate-700/50 text-white border border-slate-600/50 rounded-lg font-bold text-lg hover:border-swarm-accent/50 hover:text-swarm-accent transition-all duration-300"
              >
                Explore Features
              </motion.a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-6 justify-center text-sm text-slate-400"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-swarm-accent" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-swarm-accent" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-swarm-accent" />
                Enterprise-grade security
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image/Demo Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
              <div className="aspect-video flex items-center justify-center relative">
                {/* Placeholder for demo video or image */}
                <div className="absolute inset-0 bg-gradient-to-t from-swarm-dark/50 to-transparent" />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-7xl"
                >
                  🎬
                </motion.div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-swarm-accent/20 to-swarm-secondary/20 rounded-xl blur-lg -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <FeaturedSection />

      {/* Features Grid */}
      <FeatureGrid columns={3} />

      {/* Pricing Section */}
      <PricingPlans onContactSales={handleContactSales} />

      {/* CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-swarm-accent/5 to-transparent"
          />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold glow-accent mb-6">
              Join Hundreds of Teams Building the Future
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              From startups to Fortune 500 companies, teams use SyncPulse to
              orchestrate intelligent agents at scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-swarm-accent text-swarm-dark rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-swarm-accent/50 transition-all"
              >
                Get Started Free
              </motion.a>
              <motion.a
                href="/contact-sales"
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-slate-700/50 text-white border border-slate-600/50 rounded-lg font-bold text-lg hover:border-swarm-accent/50 hover:text-swarm-accent transition-all"
              >
                Schedule Demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-swarm-accent transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">
                © 2026 SyncPulse. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-slate-400 hover:text-swarm-accent transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-slate-400 hover:text-swarm-accent transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-slate-400 hover:text-swarm-accent transition-colors">
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowContactModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900 border border-slate-700/50 rounded-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Contact Sales
            </h3>
            <p className="text-slate-400 mb-6">
              Get in touch with our sales team to discuss enterprise plans and
              custom solutions.
            </p>
            <a
              href="mailto:sales@syncpulse.io"
              className="block w-full py-3 px-4 bg-swarm-accent text-swarm-dark rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-swarm-accent/50 transition-all mb-3"
            >
              Email Sales
            </a>
            <button
              onClick={() => setShowContactModal(false)}
              className="w-full py-3 px-4 bg-slate-700/50 text-white rounded-lg font-semibold hover:bg-slate-600/50 transition-all"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
}
