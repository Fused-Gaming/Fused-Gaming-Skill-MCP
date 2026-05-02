import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ToolCardProps {
  name: string;
  description: string;
  icon: string;
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

  return (
    <motion.a
      href={url || '#'}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group block h-full"
    >
      <div className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-lg p-6 hover:border-swarm-accent/50 transition-all duration-300 glass">
        {/* Icon and Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          {url && (
            <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-swarm-accent transition-colors opacity-0 group-hover:opacity-100" />
          )}
        </div>

        {/* Title and Status */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-swarm-accent transition-colors">
            {name}
          </h3>
          {status && (
            <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded border border-slate-600/50"
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
