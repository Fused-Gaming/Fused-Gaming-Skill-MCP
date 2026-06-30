'use client';

import { motion } from 'framer-motion';
import PageFooter from '@/components/PageFooter';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-swarm-dark via-slate-900 to-swarm-dark">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

          <div className="space-y-8 text-white/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using the SyncPulse Service, you accept and agree to be bound by the terms and provision of this agreement.
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on the SyncPulse Service
                for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
                this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the Service</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Disclaimer</h2>
              <p>
                The materials on the SyncPulse Service are provided "as is". SyncPulse makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Limitations</h2>
              <p>
                In no event shall SyncPulse or its suppliers be liable for any damages (including, without limitation, damages for loss
                of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the
                SyncPulse Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on the SyncPulse Service could include technical, typographical, or photographic errors.
                SyncPulse does not warrant that any of the materials on its Service are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Modifications</h2>
              <p>
                SyncPulse may revise these terms of service for its Service at any time without notice. By using this Service, you are
                agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which
                SyncPulse operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
        items={[{ label: 'Terms', href: '/terms' }]}
        showVersion={true}
        showStatus={false}
        showCopyright={true}
        links={[
          { label: 'Privacy', href: '/privacy' },
          { label: 'Security', href: '/.well-known/security.txt' },
          { label: 'GitHub', href: 'https://github.com/Fused-Gaming/Fused-Gaming-Skill-MCP' },
        ]}
      />
    </main>
  );
}
