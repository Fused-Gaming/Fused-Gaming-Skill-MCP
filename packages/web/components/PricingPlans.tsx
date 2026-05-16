'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PricingTier {
  name: string;
  description: string;
  price?: string;
  period?: string;
  cta: string;
  ctaHref: string;
  featured?: boolean;
  features: {
    name: string;
    included: boolean;
  }[];
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    period: 'forever',
    cta: 'Get Started',
    ctaHref: '/signup?plan=free',
    features: [
      { name: 'Up to 3 agents', included: true },
      { name: 'Basic monitoring', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced orchestration', included: false },
      { name: 'Real-time analytics', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Pro',
    description: 'For growing teams',
    price: '$299',
    period: 'month',
    cta: 'Start Free Trial',
    ctaHref: '/signup?plan=pro',
    featured: true,
    features: [
      { name: 'Up to 50 agents', included: true },
      { name: 'Basic monitoring', included: true },
      { name: 'Advanced orchestration', included: true },
      { name: 'Real-time analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Custom integrations', included: false },
      { name: 'SLA guarantee', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For mission-critical systems',
    price: 'Custom',
    cta: 'Contact Sales',
    ctaHref: '/contact-sales',
    features: [
      { name: 'Unlimited agents', included: true },
      { name: 'Advanced monitoring', included: true },
      { name: 'Advanced orchestration', included: true },
      { name: 'Real-time analytics', included: true },
      { name: 'Priority 24/7 support', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'SLA guarantee', included: true },
    ],
  },
];

interface PricingPlansProps {
  onContactSales?: () => void;
}

export default function PricingPlans({ onContactSales }: PricingPlansProps) {
  return (
    <section id="pricing" className="py-20 px-6">
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
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your swarm orchestration needs. Scale as you grow.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative h-full flex flex-col ${
                tier.featured ? 'md:scale-105' : ''
              }`}
            >
              {/* Featured Badge */}
              {tier.featured && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                >
                  <span className="bg-swarm-accent text-swarm-dark px-4 py-1 rounded-full text-sm font-bold">
                    Recommended
                  </span>
                </motion.div>
              )}

              {/* Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`h-full rounded-lg border backdrop-blur-sm transition-all duration-300 ${
                  tier.featured
                    ? 'border-swarm-accent/50 bg-gradient-to-br from-slate-800/80 via-slate-900/60 to-slate-900/40 shadow-lg shadow-swarm-accent/20'
                    : 'border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50'
                } p-8 flex flex-col`}
              >
                {/* Tier Header */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {tier.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl font-bold ${
                      tier.featured ? 'text-swarm-accent' : 'text-white'
                    }`}>
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-slate-400">
                        /{tier.period}
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <motion.a
                  href={tier.ctaHref}
                  onClick={(e) => {
                    if (tier.name === 'Enterprise' && onContactSales) {
                      e.preventDefault();
                      onContactSales();
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 mb-8 text-center ${
                    tier.featured
                      ? 'bg-swarm-accent text-swarm-dark hover:shadow-lg hover:shadow-swarm-accent/50'
                      : 'bg-slate-700/50 text-white border border-slate-600/50 hover:border-swarm-accent/50 hover:text-swarm-accent'
                  }`}
                >
                  {tier.cta}
                </motion.a>

                {/* Features List */}
                <div className="flex-1 space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: featureIndex * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-swarm-accent flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? 'text-slate-200'
                            : 'text-slate-500'
                        }`}
                      >
                        {feature.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Billing Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-sm">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
