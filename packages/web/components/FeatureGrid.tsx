'use client';

import { motion } from 'framer-motion';

interface Feature {
  icon: string;
  name: string;
  description: string;
  badge?: string;
}

const features: Feature[] = [
  {
    icon: '🐝',
    name: 'Swarm Orchestration',
    description: 'Coordinate multiple AI agents with intelligent task distribution and dependency management.',
    badge: 'Core Feature',
  },
  {
    icon: '📊',
    name: 'Real-time Monitoring',
    description: 'Live dashboards showing agent status, performance metrics, and system health at a glance.',
    badge: 'Premium',
  },
  {
    icon: '⚡',
    name: 'Performance Optimization',
    description: 'Automatic load balancing, resource allocation, and latency optimization across all agents.',
    badge: 'AI-Powered',
  },
  {
    icon: '🔄',
    name: 'Seamless Integration',
    description: 'Connect to any LLM, API, or tool. Built-in adapters for popular platforms and custom endpoints.',
    badge: 'Extensible',
  },
  {
    icon: '🛡️',
    name: 'Enterprise Security',
    description: 'End-to-end encryption, role-based access control, audit logs, and compliance certifications.',
    badge: 'Enterprise',
  },
  {
    icon: '📈',
    name: 'Advanced Analytics',
    description: 'Deep insights into agent behavior, cost analysis, performance trends, and optimization recommendations.',
    badge: 'Analytics',
  },
];

interface FeatureGridProps {
  showBadges?: boolean;
  columns?: 2 | 3;
}

export default function FeatureGrid({
  showBadges = true,
  columns = 3
}: FeatureGridProps) {
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
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const columnClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
  };

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold glow-accent mb-4">
            Powerful Features for Advanced Orchestration
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to build, manage, and scale intelligent agent swarms.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid grid-cols-1 gap-6 ${columnClass[columns]}`}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group h-full"
            >
              <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-8 hover:border-swarm-accent/50 transition-all duration-300 glass">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-5xl mb-4 inline-block"
                >
                  {feature.icon}
                </motion.div>

                {/* Badge */}
                {showBadges && feature.badge && (
                  <div className="mb-3">
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-swarm-accent/10 text-swarm-accent border border-swarm-accent/30">
                      {feature.badge}
                    </span>
                  </div>
                )}

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-swarm-accent transition-colors">
                  {feature.name}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Accent Line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                  className="mt-4 h-1 bg-gradient-to-r from-swarm-accent to-transparent"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
