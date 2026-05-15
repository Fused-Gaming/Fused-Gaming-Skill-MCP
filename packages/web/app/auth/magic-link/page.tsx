'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function MagicLinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'validating' | 'success' | 'error'>('validating');
  const [error, setError] = useState('');

  useEffect(() => {
    const validateAndAuthenticateWithMagicLink = async () => {
      if (!token) {
        setError('No magic link token provided');
        setStatus('error');
        return;
      }

      try {
        const response = await fetch('/api/auth/magic-link/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || 'Failed to validate magic link');
          setStatus('error');
          return;
        }

        const data = await response.json();

        // Set session cookie
        document.cookie = `sessionToken=${data.sessionToken}; path=/; max-age=86400; samesite=strict`;

        setStatus('success');

        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (err) {
        setError('Failed to authenticate with magic link. Please try again.');
        setStatus('error');
      }
    };

    validateAndAuthenticateWithMagicLink();
  }, [token, router]);

  if (status === 'success') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>✓</div>
          <h1>Authenticated Successfully!</h1>
          <p style={styles.subtitle}>
            Welcome to SyncPulse. Redirecting to your dashboard...
          </p>
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>Authentication Failed</h1>
          <div style={styles.error}>{error}</div>

          <div style={styles.buttonContainer}>
            <button
              onClick={() => router.push('/auth/magic-link-request')}
              style={styles.button}
            >
              Request New Magic Link
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              style={{
                ...styles.button,
                backgroundColor: '#6b7280'
              }}
            >
              Use Password Login
            </button>
          </div>

          <div style={styles.infoBox}>
            <h3>Why did this happen?</h3>
            <ul>
              <li>The magic link may have expired (valid for 15 minutes)</li>
              <li>The link may have been used already</li>
              <li>There may be an issue with the authentication server</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Validating state
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Authenticating...</h1>
        <p style={styles.subtitle}>
          Verifying your magic link. Please wait...
        </p>
        <div style={styles.spinner}></div>
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
    color: '#e2e8f0',
    textAlign: 'center'
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
  button: {
    padding: '12px 24px',
    backgroundColor: '#667eea',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginRight: '10px',
    marginTop: '20px'
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  infoBox: {
    backgroundColor: '#1a1f35',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px',
    fontSize: '14px',
    textAlign: 'left'
  },
  successIcon: {
    fontSize: '48px',
    color: '#10b981',
    marginBottom: '20px'
  },
  spinner: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    border: '3px solid #334155',
    borderTop: '3px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginTop: '20px'
  }
};

// Add CSS for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
