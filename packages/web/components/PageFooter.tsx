'use client';

import Breadcrumb, { type BreadcrumbItem } from './Breadcrumb';

interface PageFooterProps {
  items?: BreadcrumbItem[];
  showVersion?: boolean;
  showStatus?: boolean;
  showCopyright?: boolean;
  copyrightText?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

export default function PageFooter({
  items = [],
  showVersion = true,
  showStatus = true,
  showCopyright = true,
  copyrightText = '© 2026 SyncPulse. All rights reserved.',
  links,
}: PageFooterProps) {
  return (
    <footer className="border-t border-swarm-accent/10">
      <Breadcrumb items={items} showVersion={showVersion} showStatus={showStatus} />

      {(showCopyright || links) && (
        <div className="py-8 px-6 bg-gradient-to-r from-slate-900/50 to-transparent">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            {showCopyright && (
              <p className="text-sm text-slate-500">
                {copyrightText}
              </p>
            )}
            {links && links.length > 0 && (
              <div className="flex gap-6">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-swarm-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
