'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Copy, Check, ChevronDown } from 'lucide-react';
import Icon from './Icon';
import { type IconName, iconPaths } from '@/lib/design-tokens';

interface ToolCardProps {
  name: string;
  description: string;
  icon: IconName;
  url?: string;
  tags?: string[];
  status?: 'stable' | 'beta' | 'new';
  useCases?: string[];
}

export default function ToolCard({
  name,
  description,
  icon,
  url,
  tags = [],
  status = 'stable',
  useCases = []
}: ToolCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const statusColors = {
    stable: 'bg-green-500/20 text-green-300',
    beta: 'bg-yellow-500/20 text-yellow-300',
    new: 'bg-blue-500/20 text-blue-300'
  };

  const hasValidIcon = iconPaths[icon] && iconPaths[icon].trim().length > 0;

  // Extract package name from npm URL if provided, or generate from tool name
  let packageName = '';
  let npmUrl = url || '';

  if (npmUrl) {
    // Extract package name from npm URL: https://www.npmjs.com/package/@h4shed/skill-xyz -> @h4shed/skill-xyz
    const match = npmUrl.match(/npmjs\.com\/package\/([@\w\/\-]+)/);
    if (match) {
      packageName = match[1];
    }
  }

  const installCommand = packageName ? `npm install ${packageName}` : '';

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(installCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full"
    >
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-full bg-gradient-to-br from-[#050508] to-[#0a0a0f] border border-white/[0.08] rounded-lg p-6 hover:border-white/[0.15] transition-all duration-300 glass backdrop-blur-[22px] cursor-pointer group"
      >
        {/* Icon and Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            {hasValidIcon ? (
              <Icon name={icon} size={40} color="#A855F7" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-swarm-accent/20 flex items-center justify-center text-sm font-semibold text-swarm-accent">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-[#667eea] transition-colors">
                {name}
              </h3>
              {status && (
                <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${statusColors[status]}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="text-slate-400 group-hover:text-[#667eea] transition-colors"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/70 mb-4">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded border border-white/[0.1]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/[0.1] pt-4 mt-4 space-y-4"
            >
              {/* Installation Command */}
              {installCommand && (
                <div>
                  <p className="text-xs font-semibold text-white/60 mb-2">Installation</p>
                  <div className="flex items-center gap-2 bg-black/40 rounded-lg px-3 py-2 border border-white/[0.1]">
                    <code className="text-xs text-[#667eea] flex-1 font-mono">
                      {installCommand}
                    </code>
                    <button
                      onClick={copyToClipboard}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/60" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Use Cases */}
              {useCases.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-white/60 mb-2">Use Cases</p>
                  <ul className="text-xs text-white/70 space-y-1">
                    {useCases.map((useCase, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#667eea] mt-1">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Links */}
              <div className="flex gap-2 pt-2">
                {npmUrl && (
                  <a
                    href={npmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#667eea]/10 hover:bg-[#667eea]/20 border border-[#667eea]/30 rounded-lg text-sm text-[#667eea] font-medium transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on npm
                  </a>
                )}
                {url && url !== npmUrl && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/[0.15] rounded-lg text-sm text-white/70 font-medium transition-all`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Docs
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
