'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Slash } from 'lucide-react';
import { versionManifest } from '@/lib/version-manifest';
import Icon from './Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showVersion?: boolean;
  showStatus?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

export default function Breadcrumb({
  items,
  showVersion = true,
  showStatus = true,
  variant = 'default',
}: BreadcrumbProps) {
  const displayItems = [
    { label: 'SyncPulse', href: '/', icon: 'pulse' },
    ...items,
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  if (variant === 'minimal') {
    return (
      <nav className="flex items-center gap-2 py-2 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2"
        >
          {displayItems.map((item, index) => (
            <motion.div key={index} variants={itemVariants} className="flex items-center gap-2">
              {item.href ? (
                <a href={item.href} className="text-xs text-swarm-accent hover:text-swarm-accent/70 transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-xs text-slate-400">{item.label}</span>
              )}
              {index < displayItems.length - 1 && <Slash className="w-3 h-3 text-slate-600" />}
            </motion.div>
          ))}
        </motion.div>
      </nav>
    );
  }

  if (variant === 'compact') {
    return (
      <nav className="flex items-center justify-between gap-4 py-2 px-4 bg-slate-900/30 border-b border-swarm-accent/5">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-1"
        >
          {displayItems.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex items-center gap-1"
            >
              {item.href ? (
                <a
                  href={item.href}
                  className="text-xs font-medium text-swarm-accent hover:text-swarm-accent/70 transition-colors flex items-center gap-1"
                >
                  {item.icon && <Icon name={item.icon as any} size={14} color="#A855F7" />}
                  {item.label}
                </a>
              ) : (
                <span className="text-xs font-medium text-slate-400">
                  {item.label}
                </span>
              )}
              {index < displayItems.length - 1 && (
                <ChevronRight className="w-3 h-3 text-slate-600" />
              )}
            </motion.div>
          ))}
        </motion.div>
        {showStatus && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
            {versionManifest.status}
          </span>
        )}
      </nav>
    );
  }

  // Default variant with enhanced design
  return (
    <nav className="flex items-center justify-between gap-4 py-4 px-6 border-b border-swarm-accent/10 bg-gradient-to-r from-slate-900/40 via-slate-900/20 to-transparent backdrop-blur-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-3 flex-wrap"
      >
        {displayItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            {item.icon && !item.href && (
              <Icon name={(item.icon || 'pulse') as any} size={18} color="#A855F7" />
            )}

            {item.href ? (
              <motion.a
                href={item.href}
                className="text-sm font-medium text-swarm-accent hover:text-swarm-accent/80 transition-all duration-200 flex items-center gap-2 px-2 py-1 rounded-md hover:bg-swarm-accent/5"
                whileHover={{ x: 2 }}
              >
                {item.icon && (
                  <Icon name={(item.icon || 'pulse') as any} size={16} color="#A855F7" />
                )}
                {item.label}
              </motion.a>
            ) : (
              <span className="text-sm font-medium text-slate-300 px-2 py-1">
                {item.label}
              </span>
            )}

            {index < displayItems.length - 1 && (
              <motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 0.7 }} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {(showVersion || showStatus) && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 ml-auto"
        >
          {showStatus && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-400 border border-emerald-500/30 font-medium cursor-default"
            >
              {versionManifest.status}
            </motion.span>
          )}
          {showVersion && (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xs px-3 py-1 rounded-lg bg-gradient-to-r from-swarm-accent/10 to-purple-600/10 text-swarm-accent border border-swarm-accent/30 font-semibold cursor-default"
            >
              v{versionManifest.version}
            </motion.span>
          )}
        </motion.div>
      )}
    </nav>
  );
}
