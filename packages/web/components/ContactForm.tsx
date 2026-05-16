'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  agents: string;
  message: string;
}

interface ContactFormProps {
  variant?: 'full' | 'compact';
  onSubmit?: (data: FormData) => void;
}

export default function ContactForm({
  variant = 'full',
  onSubmit,
}: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    agents: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Call contact-sales API endpoint
      const response = await fetch('/api/contact-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Contact form error:', data.error);
        throw new Error(data.error || 'Failed to submit form');
      }

      if (onSubmit) {
        onSubmit(formData);
      }

      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', agents: '', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swarm-accent/50 transition-colors"
          />
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swarm-accent/50 transition-colors"
          />
        </div>
        <textarea
          name="message"
          placeholder="Tell us about your needs..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swarm-accent/50 transition-colors resize-none"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || submitted}
          className="w-full py-3 px-6 bg-swarm-accent text-swarm-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-swarm-accent/50 transition-all disabled:opacity-50"
        >
          {submitted ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Message Sent!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              {loading ? 'Sending...' : 'Send Message'}
              <Send className="w-4 h-4" />
            </span>
          )}
        </motion.button>
      </form>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-white mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swarm-accent/50 transition-colors"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="john@company.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swarm-accent/50 transition-colors"
          />
        </motion.div>
      </div>

      {/* Company and Agent Count */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-white mb-2">
            Company
          </label>
          <input
            type="text"
            name="company"
            placeholder="Acme Inc."
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swarm-accent/50 transition-colors"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <label className="block text-sm font-semibold text-white mb-2">
            Number of Agents
          </label>
          <select
            name="agents"
            value={formData.agents}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-swarm-accent/50 transition-colors"
          >
            <option value="">Select...</option>
            <option value="under-10">Under 10</option>
            <option value="10-50">10-50</option>
            <option value="50-100">50-100</option>
            <option value="100-500">100-500</option>
            <option value="500-plus">500+</option>
          </select>
        </motion.div>
      </div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <label className="block text-sm font-semibold text-white mb-2">
          Message
        </label>
        <textarea
          name="message"
          placeholder="Tell us about your project and how we can help..."
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-swarm-accent/50 transition-colors resize-none"
        />
      </motion.div>

      {/* Submit Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || submitted}
        className="w-full py-4 px-6 bg-swarm-accent text-swarm-dark rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-swarm-accent/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitted ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Message Sent! We&apos;ll be in touch soon.
          </>
        ) : (
          <>
            {loading ? 'Sending...' : 'Send Message'}
            <Send className="w-5 h-5" />
          </>
        )}
      </motion.button>

      {/* Privacy Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="text-xs text-slate-500 text-center"
      >
        We&apos;ll never share your information. See our{' '}
        <a href="/privacy" className="text-swarm-accent hover:underline">
          privacy policy
        </a>
        .
      </motion.p>
    </motion.form>
  );
}
