'use client';

interface GlassmorphCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassmorphCard({ children, className = '', onClick }: GlassmorphCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        backdrop-blur-[22px] bg-gradient-to-br from-slate-800/50 to-slate-900/50
        border border-white/[0.08]
        rounded-[24px] p-6
        shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_0_28px_rgba(168,85,247,0.06)]
        hover:border-white/[0.12] transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
