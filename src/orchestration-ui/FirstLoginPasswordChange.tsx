import React, { useState } from 'react';

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  noRepeated: boolean;
  noCommon: boolean;
}

export const FirstLoginPasswordChange: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [oneTimePassword, setOneTimePassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'initial' | 'change' | 'success'>('initial');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    noRepeated: false,
    noCommon: false,
  });

  const validatePasswordStrength = (password: string) => {
    const validation: PasswordValidation = {
      length: password.length >= 16,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      noRepeated: !/(.)\1{2,}/.test(password),
      noCommon: !/123|456|789|qwerty|password/i.test(password),
    };

    setPasswordValidation(validation);
    return Object.values(validation).every(v => v);
  };

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: oneTimePassword })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Invalid password');
        return;
      }

      const data = await response.json();
      localStorage.setItem('sessionToken', data.sessionToken);
      setStep('change');
    } catch {
      setError('Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validatePasswordStrength(newPassword)) {
      setError('Password does not meet strength requirements');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        },
        body: JSON.stringify({ newPassword, confirmPassword })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to change password');
        return;
      }

      setStep('success');
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordValid = Object.values(passwordValidation).every(v => v);

  if (step === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>✓ Password Changed Successfully</h2>
        <p>Your password has been updated. Redirecting to dashboard...</p>
      </div>
    );
  }

  if (step === 'change') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>🔐 Set Your Admin Password</h1>
          <p style={styles.subtitle}>
            Please create a strong password to secure your orchestration panel.
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handlePasswordChange}>
            <div style={styles.formGroup}>
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  validatePasswordStrength(e.target.value);
                }}
                placeholder="Enter a strong password"
                style={styles.input}
                disabled={loading}
              />
            </div>

            <div style={styles.formGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                style={styles.input}
                disabled={loading}
              />
            </div>

            <div style={styles.requirements}>
              <h3>Password Requirements:</h3>
              <ul>
                <li style={{ color: passwordValidation.length ? 'green' : 'gray' }}>
                  {passwordValidation.length ? '✓' : '○'} At least 16 characters
                </li>
                <li style={{ color: passwordValidation.uppercase ? 'green' : 'gray' }}>
                  {passwordValidation.uppercase ? '✓' : '○'} At least one uppercase letter
                </li>
                <li style={{ color: passwordValidation.lowercase ? 'green' : 'gray' }}>
                  {passwordValidation.lowercase ? '✓' : '○'} At least one lowercase letter
                </li>
                <li style={{ color: passwordValidation.number ? 'green' : 'gray' }}>
                  {passwordValidation.number ? '✓' : '○'} At least one number
                </li>
                <li style={{ color: passwordValidation.special ? 'green' : 'gray' }}>
                  {passwordValidation.special ? '✓' : '○'} At least one special character (!@#$%)
                </li>
                <li style={{ color: passwordValidation.noRepeated ? 'green' : 'gray' }}>
                  {passwordValidation.noRepeated ? '✓' : '○'} No repeated characters (e.g., aaa)
                </li>
                <li style={{ color: passwordValidation.noCommon ? 'green' : 'gray' }}>
                  {passwordValidation.noCommon ? '✓' : '○'} No common patterns (qwerty, password)
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={!isPasswordValid || loading}
              style={{
                ...styles.button,
                opacity: !isPasswordValid || loading ? 0.5 : 1,
                cursor: !isPasswordValid || loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Updating...' : 'Change Password & Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🎮 Fused Gaming MCP - First Login</h1>
        <p style={styles.subtitle}>
          Enter your one-time administrator password to access the orchestration panel.
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleInitialLogin}>
          <div style={styles.formGroup}>
            <label>One-Time Administrator Password</label>
            <input
              type="password"
              value={oneTimePassword}
              onChange={(e) => setOneTimePassword(e.target.value)}
              placeholder="Enter your initial password"
              style={styles.input}
              disabled={loading}
              autoFocus
            />
            <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
              This password was provided during installation.
              Format: 4 words separated by hyphens (e.g., Quantum-Phoenix-Stellar-Cascade)
            </small>
          </div>

          <button
            type="submit"
            disabled={!oneTimePassword || loading}
            style={{
              ...styles.button,
              opacity: !oneTimePassword || loading ? 0.5 : 1,
              cursor: !oneTimePassword || loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div style={styles.info}>
          <h3>⚠️ Important Notes:</h3>
          <ul>
            <li>Your one-time password expires after 24 hours</li>
            <li>You have 5 login attempts before the account locks</li>
            <li>You MUST change your password after successful login</li>
            <li>Keep your new password secure and do not share it</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    padding: '20px'
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
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
    cursor: 'pointer'
  },
  requirements: {
    backgroundColor: '#1a1f35',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px',
    marginBottom: '20px'
  },
  info: {
    backgroundColor: '#1a1f35',
    padding: '15px',
    borderRadius: '4px',
    marginTop: '20px',
    fontSize: '14px'
  }
};

export default FirstLoginPasswordChange;
