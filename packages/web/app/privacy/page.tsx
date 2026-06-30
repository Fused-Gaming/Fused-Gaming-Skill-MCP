'use client';

import { motion } from 'framer-motion';
import PageFooter from '@/components/PageFooter';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
              <p>
                SyncPulse ("we", "our", or "us") operates the SyncPulse Swarm Controller website and ecosystem (the "Service").
                This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use
                our Service and the choices you have associated with that data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information Collection and Use</h2>
              <p className="mb-4">
                We collect several different types of information for various purposes to provide and improve our Service to you.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Personal Data: When you create an account, we may collect your name, email address, and usage patterns</li>
                <li>Usage Data: We automatically collect information about how you interact with our Service</li>
                <li>Cookies: We use cookies to enhance your experience and analyze traffic patterns</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <p>
                The security of your data is important to us but remember that no method of transmission over the Internet or
                method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your
                Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@vln.gg" className="text-[#667eea] hover:text-[#8ea5f8]">privacy@vln.gg</a>
              </p>
            </section>

            <section className="mt-12 pt-8 border-t border-white/10">
              <p className="text-sm text-white/60">
                Last updated: June 30, 2026
              </p>
            </section>
          </div>
        </motion.div>
      </div>

      <PageFooter
        items={[{ label: 'Privacy', href: '/privacy' }]}
        showVersion={true}
        showStatus={false}
        showCopyright={true}
        links={[
          { label: 'Terms', href: '/terms' },
          { label: 'Security', href: '/.well-known/security.txt' },
          { label: 'GitHub', href: 'https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP' },
        ]}
      />
    </main>
  );
}
