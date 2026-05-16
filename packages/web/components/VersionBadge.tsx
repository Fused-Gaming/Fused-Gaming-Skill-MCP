'use client';

import { motion } from 'framer-motion';

interface VersionBadgeProps {
  variant?: 'small' | 'normal' | 'large';
  showBuildNumber?: boolean;
}

export default function VersionBadge({
  variant = 'small',
  showBuildNumber = false,
}: VersionBadgeProps) {
  const version = '1.0.6';
  const buildNumber = '1007';
  const releaseDate = 'May 16, 2026';

  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    normal: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-2 ${sizeClasses[variant]} bg-swarm-accent/10 border border-swarm-accent/30 rounded-lg text-swarm-accent hover:bg-swarm-accent/20 hover:border-swarm-accent/50 transition-colors`}
      title={`Released on ${releaseDate}`}
    >
      <span className="font-semibold">v{version}</span>
      {showBuildNumber && (
        <span className="text-xs opacity-70">#{buildNumber}</span>
      )}
    </motion.div>
  );
}
