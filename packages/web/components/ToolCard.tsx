import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Icon from './Icon';
import { type IconName, iconPaths } from '@/lib/design-tokens';

interface ToolCardProps {
  name: string;
  description: string;
  icon: IconName;
  url?: string;
  tags?: string[];
  status?: 'stable' | 'beta' | 'new';
}

export default function ToolCard({
  name,
  description,
  icon,
  url,
  tags = [],
  status = 'stable'
}: ToolCardProps) {
  const statusColors = {
    stable: 'bg-green-500/20 text-green-300',
    beta: 'bg-yellow-500/20 text-yellow-300',
    new: 'bg-blue-500/20 text-blue-300'
  };

  const hasValidIcon = iconPaths[icon] && iconPaths[icon].trim().length > 0;

  return (
    <motion.a
      href={url || '#'}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group block h-full"
    >
      <div className="h-full bg-gradient-to-br from-[#050508] to-[#0a0a0f] border border-white/8 rounded-lg p-6 hover:border-white/15 transition-all duration-300 glass backdrop-blur-[22px]">
        {/* Icon and Header */}
        <div className="flex items-start justify-between mb-4">
          {hasValidIcon ? (
            <Icon name={icon} size={40} color="#A855F7" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-swarm-accent/20 flex items-center justify-center text-sm font-semibold text-swarm-accent">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          {url && (
            <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-[#667eea] transition-colors opacity-0 group-hover:opacity-100" />
          )}
        </div>

        {/* Title and Status */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-[#667eea] transition-colors">
            {name}
          </h3>
          {status && (
            <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/70 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.a>
  );
}
