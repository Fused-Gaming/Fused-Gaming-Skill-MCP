'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Activity } from 'lucide-react';
import VersionBadge from './VersionBadge';
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb';

interface NavigationProps {
  isAuthenticated?: boolean;
  userName?: string;
  onLogout?: () => void;
  onLogin?: () => void;
  onMagicLink?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
}

export default function Navigation({
  isAuthenticated = false,
  userName = 'User',
  onLogout = () => {},
  onLogin = () => {},
  onMagicLink = () => {},
  breadcrumbs = [],
  showBreadcrumbs = false,
}: NavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '#docs' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    document.cookie = 'sessionToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    onLogout();
    router.push('/');
  };

  const isLandingPage = pathname === '/landing' || pathname === '/';
  const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  return (
    <nav className="sticky top-0 z-50">
      {/* Glass morphism background */}
      <div
        className={`absolute inset-0 transition-all duration-300 -z-10 ${
          isScrolled ? 'glass border-b border-white/[0.1]' : 'bg-transparent'
        }`}
      />

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex cursor-pointer items-center gap-3"
            onClick={() => router.push('/')}
          >
            <Activity size={28} color="#667eea" />
            <div>
              <div className="text-lg font-bold text-white">SyncPulse</div>
              {isDashboard && (
                <div className="text-xs text-white/60">Dashboard</div>
              )}
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          {isLandingPage && (
            <div className="hidden items-center gap-8 md:flex">
              {navigationLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-[#667eea]"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          )}

          {/* Right Side: Version Badge + Auth Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <VersionBadge variant="small" />

            {!isAuthenticated ? (
              <>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={onLogin}
                  className="text-sm font-medium text-white/70 transition-colors hover:text-[#667eea]"
                >
                  Login
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  onClick={onMagicLink}
                  className="rounded-lg border border-[#667eea]/50 bg-[#667eea]/10 px-4 py-2 text-sm font-medium text-[#667eea] transition-all hover:bg-[#667eea]/20 hover:shadow-lg hover:shadow-[#667eea]/20"
                >
                  Magic Link
                </motion.button>
              </>
            ) : (
              <div className="relative">
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border border-white/[0.15] bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-[#667eea]/30 hover:bg-white/10"
                >
                  {userName}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-white/[0.15] shadow-xl glass"
                    >
                      <a
                        href="/dashboard"
                        className="flex items-center gap-3 border-b border-white/[0.1] px-4 py-3 text-sm text-white/70 transition-all hover:bg-white/5 hover:text-[#667eea]"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </a>
                      <button
                        onClick={handleLogoutClick}
                        className="w-full px-4 py-3 text-left text-sm text-white/70 transition-all hover:bg-white/5 hover:text-red-400 flex items-center gap-3"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={toggleMenu}
            className="text-[#667eea] transition-colors hover:text-[#8ea5f8] md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 md:hidden mt-4"
            >
              {isLandingPage &&
                navigationLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-2 text-sm text-white/70 transition-all hover:bg-white/5 hover:text-[#667eea]"
                  >
                    {link.label}
                  </motion.a>
                ))}

              {/* Mobile Auth Buttons */}
              <div className="border-t border-white/[0.1] pt-4 mt-4 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        onLogin();
                        closeMenu();
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-white/70 transition-colors hover:text-[#667eea]"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        onMagicLink();
                        closeMenu();
                      }}
                      className="w-full rounded-lg border border-[#667eea]/50 bg-[#667eea]/10 px-4 py-2 text-sm font-medium text-[#667eea] transition-all hover:bg-[#667eea]/20"
                    >
                      Magic Link
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 transition-colors hover:text-[#667eea]"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </a>
                    <button
                      onClick={() => {
                        handleLogoutClick();
                        closeMenu();
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 transition-colors hover:text-red-400"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </>
                )}
              </div>

              {/* Mobile Version Badge */}
              <div className="border-t border-white/[0.1] pt-4 mt-4">
                <div className="px-4">
                  <VersionBadge variant="small" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Breadcrumb Navigation */}
      {showBreadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} variant="compact" showVersion={false} showStatus={false} />
      )}
    </nav>
  );
}
