'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export default function ContactSalesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark">
      {/* Header */}
      <header className="border-b border-swarm-accent/20 sticky top-0 z-40 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.a
            href="/sales"
            className="text-swarm-accent hover:text-swarm-accent/80 transition-colors"
          >
            ← Back to SyncPulse
          </motion.a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12">
              <h1 className="text-5xl font-bold glow-accent mb-4">
                Get Enterprise Support
              </h1>
              <p className="text-slate-400 text-lg">
                Our sales team is ready to discuss custom solutions, pricing, and help
                you build intelligent swarm systems that scale.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-8">
              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-swarm-accent/10 text-swarm-accent">
                    <Phone className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Phone
                  </h3>
                  <p className="text-slate-400 mb-2">
                    Call our sales team Monday–Friday, 9am–6pm EST
                  </p>
                  <a
                    href="tel:+1-555-123-4567"
                    className="text-swarm-accent hover:text-swarm-accent/80 font-semibold"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-swarm-accent/10 text-swarm-accent">
                    <Mail className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Email
                  </h3>
                  <p className="text-slate-400 mb-2">
                    Reach out anytime. We typically respond within 2 hours.
                  </p>
                  <a
                    href="mailto:sales@syncpulse.io"
                    className="text-swarm-accent hover:text-swarm-accent/80 font-semibold"
                  >
                    sales@syncpulse.io
                  </a>
                </div>
              </motion.div>

              {/* Office */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-swarm-accent/10 text-swarm-accent">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Office
                  </h3>
                  <p className="text-slate-400">
                    123 Innovation Drive<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-swarm-accent/10 text-swarm-accent">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Hours
                  </h3>
                  <p className="text-slate-400">
                    Monday–Friday: 9am–6pm EST<br />
                    Saturday–Sunday: Closed
                  </p>
                </div>
              </motion.div>
            </div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-16 p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg"
            >
              <h3 className="text-xl font-bold text-white mb-4">Quick Answers</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-swarm-accent mb-1">
                    What's included in enterprise plans?
                  </p>
                  <p className="text-slate-400">
                    Unlimited agents, priority support, custom integrations, and
                    dedicated account management.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-swarm-accent mb-1">
                    Do you offer custom pricing?
                  </p>
                  <p className="text-slate-400">
                    Yes! We work with enterprises on custom pricing based on your
                    needs.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-swarm-accent mb-1">
                    How long does implementation take?
                  </p>
                  <p className="text-slate-400">
                    Most integrations take 2-4 weeks. We provide implementation support.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="sticky top-24"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-white mb-2">
                Send us a message
              </h2>
              <p className="text-slate-400 mb-8">
                Fill out the form below and we&apos;ll get back to you as soon as
                possible.
              </p>
              <ContactForm variant="full" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trust Section */}
      <section className="py-20 px-6 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                metric: '500+',
                label: 'Companies',
                description: 'Trust SyncPulse for AI orchestration',
              },
              {
                metric: '99.99%',
                label: 'Uptime SLA',
                description: 'Enterprise-grade reliability',
              },
              {
                metric: '24/7',
                label: 'Support',
                description: 'Dedicated support team',
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold glow-accent mb-2">
                  {item.metric}
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {item.label}
                </div>
                <p className="text-slate-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
