'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MagicLinkRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'request' | 'sent' | 'error'>('request');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState('');

  const handleRequestMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/magic-link/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase(),
          name: name.trim() || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to send magic link');
        setStep('error');
        return;
      }

      setSentEmail(email);
      setStep('sent');
    } catch (err) {
      setError('Failed to request magic link. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRequest = () => {
    setStep('request');
    setError('');
    setEmail('');
    setName('');
  };

  if (step === 'sent') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✉️</div>
          <h1>Check Your Email</h1>
          <p style={styles.subtitle}>
            We've sent a magic link to <strong>{sentEmail}</strong>
          </p>

          <div style={styles.infoBox}>
            <h3>What happens next:</h3>
            <ol>
              <li>Open the email from SyncPulse</li>
              <li>Click the "Authenticate Now" button</li>
              <li>You'll be automatically logged in</li>
            </ol>
          </div>

          <div style={styles.warningBox}>
            <p style={{ margin: '0 0 10px 0' }}>⏰ <strong>Link expires in 15 minutes</strong></p>
            <p style={{ margin: '0' }}>📧 Check your spam folder if you don't see the email</p>
          </div>

          <button
            onClick={handleBackToRequest}
            style={{
              ...styles.button,
              backgroundColor: '#6b7280'
            }}
          >
            Request Another Link
          </button>
        </div>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>Something Went Wrong</h1>
          {error && <div style={styles.error}>{error}</div>}

          <button
            onClick={handleBackToRequest}
            style={styles.button}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🔐 SyncPulse Magic Link</h1>
        <p style={styles.subtitle}>
          Enter your email to receive a secure authentication link. No password needed!
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleRequestMagicLink}>
          <div style={styles.formGroup}>
            <label htmlFor="name">Full Name (Optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              disabled={loading}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={!email || loading}
            style={{
              ...styles.button,
              opacity: !email || loading ? 0.5 : 1,
              cursor: !email || loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <div style={styles.infoBox}>
          <h3>How Magic Links Work:</h3>
          <ul>
            <li>Click the button to request a secure link</li>
            <li>Check your email for the link (valid for 15 minutes)</li>
            <li>Click the link to automatically log in</li>
            <li>No passwords to remember or manage</li>
          </ul>
        </div>

        <div style={styles.divider}>
          <span>or</span>
        </div>

        <p style={{ textAlign: 'center', color: '#cbd5e1' }}>
          <a href="/auth/login" style={styles.link}>
            Use traditional login with password
          </a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '40px',
    color: '#e2e8f0'
  },
  subtitle: {
    color: '#cbd5e1',
    marginBottom: '30px'
  },
  error: {
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #dc2626'
  },
  formGroup: {
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0f172a',
    border: '1px solid #475569',
    borderRadius: '4px',
    color: '#e2e8f0',
    fontSize: '14px',
    marginTop: '8px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
    cursor: 'pointer'
  },
  infoBox: {
    backgroundColor: '#1a1f35',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  warningBox: {
    backgroundColor: '#5f3f00',
    border: '1px solid #b45309',
    color: '#fef3c7',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  successIcon: {
    fontSize: '48px',
    textAlign: 'center',
    marginBottom: '20px'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    color: '#64748b'
  },
  link: {
    color: '#667eea',
    textDecoration: 'none'
  }
};
