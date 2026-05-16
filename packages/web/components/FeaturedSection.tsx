'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

interface FeaturedDifferentiator {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlights: string[];
  cta?: {
    label: string;
    href: string;
  };
}

const differentiators: FeaturedDifferentiator[] = [
  {
    icon: <Zap className="w-12 h-12" />,
    title: 'Lightning-Fast Coordination',
    description:
      'Our patented swarm algorithm achieves sub-millisecond agent coordination, enabling real-time collaboration at unprecedented scale.',
    highlights: [
      'Sub-millisecond latency',
      'Supports 1000+ concurrent agents',
      'Automatic failover & recovery',
    ],
    cta: { label: 'Explore Architecture', href: '/docs/architecture' },
  },
  {
    icon: <Shield className="w-12 h-12" />,
    title: 'Military-Grade Security',
    description:
      'End-to-end encryption, zero-trust architecture, and compliance with HIPAA, SOC 2, and GDPR standards.',
    highlights: [
      'End-to-end encryption',
      'Role-based access control',
      'Audit trails & compliance',
    ],
    cta: { label: 'Security Details', href: '/docs/security' },
  },
  {
    icon: <TrendingUp className="w-12 h-12" />,
    title: 'Intelligent Optimization',
    description:
      'Machine learning-powered optimization automatically tunes your swarm for cost efficiency and performance.',
    highlights: [
      '40-60% cost reduction',
      'Adaptive resource allocation',
      'Predictive scaling',
    ],
    cta: { label: 'Optimization Guide', href: '/docs/optimization' },
  },
];

interface FeaturedSectionProps {
  variant?: 'default' | 'compact';
}

export default function FeaturedSection({
  variant = 'default'
}: FeaturedSectionProps) {
  if (variant === 'compact') {
    return (
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {differentiators.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex justify-center mb-4 text-swarm-accent"
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-0 w-96 h-96 bg-swarm-accent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-20 w-96 h-96 bg-swarm-secondary rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-block mb-4"
          >
            <span className="text-swarm-accent font-mono text-sm font-bold tracking-widest">
              WHAT SETS US APART
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold glow-accent mb-6">
            Built for Scale & Speed
          </h2>
          <p className="text-slate-400 text-xl max-w-3xl mx-auto">
            SyncPulse combines cutting-edge orchestration technology with
            enterprise-grade reliability to power the next generation of AI systems.
          </p>
        </motion.div>

        {/* Differentiators */}
        <div className="space-y-8">
          {differentiators.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-8 md:p-12 hover:border-swarm-accent/30 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-stretch">
                  {/* Icon Column */}
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 flex items-center justify-center md:justify-start"
                  >
                    <div className="text-swarm-accent p-4 bg-swarm-accent/10 rounded-lg">
                      {item.icon}
                    </div>
                  </motion.div>

                  {/* Content Column */}
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-slate-300 text-lg mb-6">
                      {item.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-3 mb-6">
                      {item.highlights.map((highlight, hIndex) => (
                        <motion.div
                          key={highlight}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1 + hIndex * 0.05,
                          }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-swarm-accent" />
                          <span className="text-slate-300">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    {item.cta && (
                      <motion.a
                        href={item.cta.href}
                        whileHover={{ x: 4 }}
                        className="inline-flex items-center gap-2 text-swarm-accent hover:text-swarm-accent/80 font-semibold group"
                      >
                        {item.cta.label}
                        <motion.div
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 mb-6">
            Ready to experience the power of intelligent swarm orchestration?
          </p>
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block px-8 py-4 bg-swarm-accent text-swarm-dark rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-swarm-accent/50 transition-all duration-300"
          >
            Start Your Free Trial
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
