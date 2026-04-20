import React, { useState, useEffect } from 'react';
import FirstLoginPasswordChange from './FirstLoginPasswordChange';
import Dashboard from './Dashboard';

type AppState = 'loading' | 'first-login' | 'authenticated' | 'error';

interface AuthStatus {
  enabled: boolean;
  changeRequired: boolean;
  createdAt: string;
  expiresAt: string;
  changedAt?: string;
}

export const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [_authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if first-login is required
        const response = await fetch('/api/auth/status');

        if (!response.ok) {
          throw new Error('Failed to check auth status');
        }

        const status: AuthStatus = await response.json();
        setAuthStatus(status);

        // Determine app state based on auth status
        if (status.changeRequired) {
          // Check if user has already gone through first login in this session
          const sessionToken = localStorage.getItem('sessionToken');
          if (sessionToken) {
            // User has completed initial login, now changing password
            setAppState('first-login');
          } else {
            // First login required
            setAppState('first-login');
          }
        } else if (status.changedAt) {
          // Password has been changed, user can access dashboard
          setAppState('authenticated');
        } else {
          // Auth system not initialized yet (new installation)
          setAppState('first-login');
        }
      } catch (err) {
        console.error('Auth status check failed:', err);
        setError('Failed to initialize application. Please try again.');
        setAppState('error');
      }
    };

    checkAuthStatus();
  }, []);

  const handleFirstLoginSuccess = () => {
    setAppState('authenticated');
    // Clear any stored session tokens
    localStorage.removeItem('sessionToken');
  };

  if (appState === 'error') {
    return (
      <div style={styles.errorContainer}>
        <h1>Application Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  if (appState === 'loading') {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
        <p>Initializing Orchestration Panel...</p>
      </div>
    );
  }

  if (appState === 'first-login') {
    return <FirstLoginPasswordChange onSuccess={handleFirstLoginSuccess} />;
  }

  return <Dashboard />;
};

const styles: Record<string, React.CSSProperties> = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#e2e8f0'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #334155',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#fca5a5',
    padding: '20px'
  }
};

export default App;
