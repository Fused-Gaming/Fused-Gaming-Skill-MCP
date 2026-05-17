'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
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
}

export default function Breadcrumb({
  items,
  showVersion = true,
  showStatus = true,
}: BreadcrumbProps) {
  const displayItems = [
    { label: 'SyncPulse', href: '/', icon: 'pulse' },
    ...items,
  ];

  return (
    <nav className="flex items-center justify-between gap-4 py-3 px-6 border-b border-swarm-accent/10 bg-gradient-to-r from-slate-900/50 to-transparent">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 flex-wrap"
      >
        {displayItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            {item.icon && !item.href && (
              <Icon name={item.icon as any} size={16} color="#A855F7" />
            )}

            {item.href ? (
              <a
                href={item.href}
                className="text-sm font-medium text-swarm-accent hover:text-swarm-accent/80 transition-colors flex items-center gap-1"
              >
                {item.icon && (
                  <Icon name={item.icon as any} size={16} color="#A855F7" />
                )}
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-medium text-slate-300">
                {item.label}
              </span>
            )}

            {index < displayItems.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-600" />
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
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
              {versionManifest.status}
            </span>
          )}
          {showVersion && (
            <span className="text-xs px-3 py-1 rounded-lg bg-swarm-accent/10 text-swarm-accent border border-swarm-accent/30 font-semibold">
              v{versionManifest.version}
            </span>
          )}
        </motion.div>
      )}
    </nav>
  );
}
