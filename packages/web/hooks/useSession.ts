'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  getSessionTokenFromCookies,
  clearSessionCookie,
  setSessionCookie,
  isValidSessionToken,
} from '@/lib/session';

interface UseSessionReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionToken: string | undefined;
  login: (token: string, expiresIn?: number) => void;
  logout: () => void;
}

/**
 * Custom hook for managing user session and authentication state
 * Handles session validation, token management, and redirects
 * @returns Session state and control functions
 */
export function useSession(): UseSessionReturn {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState<string | undefined>(undefined);
  const checkInitialized = useRef(false);

  // Check session status on mount
  useEffect(() => {
    if (checkInitialized.current) return;
    checkInitialized.current = true;

    const token = getSessionTokenFromCookies();
    const isValid = isValidSessionToken(token);

    setSessionToken(token);
    setIsAuthenticated(isValid);
    setIsLoading(false);
  }, []);

  const login = useCallback((token: string, expiresIn?: number) => {
    if (!isValidSessionToken(token)) {
      console.error('Invalid session token provided to login');
      return;
    }

    setSessionCookie(token, expiresIn);
    setSessionToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearSessionCookie();
    setSessionToken(undefined);
    setIsAuthenticated(false);
    router.push('/');
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    sessionToken,
    login,
    logout,
  };
}
