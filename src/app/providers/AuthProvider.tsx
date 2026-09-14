import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppError } from '../../core/errors/AppError';
import type { AuthSession } from '../../core/types/auth';
import { useDependencies } from './DependenciesProvider';

type AuthContextValue = {
  session: AuthSession | null;
  isReady: boolean;
  isSubmitting: boolean;
  biometricsAvailable: boolean;
  hasBiometricLogin: boolean;
  biometricLabel: string;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithBiometrics: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authRepository, biometrics } = useDependencies();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [hasBiometricLogin, setHasBiometricLogin] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('Biometrics');

  const refreshBiometricState = useCallback(async () => {
    const [available, stored, label] = await Promise.all([
      biometrics.isAvailable(),
      biometrics.hasStoredCredentials(),
      biometrics.getLabel(),
    ]);
    setBiometricsAvailable(available);
    setHasBiometricLogin(stored);
    setBiometricLabel(label);
  }, [biometrics]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const restored = await authRepository.restoreSession();
        if (!cancelled) {
          setSession(restored);
        }
        await refreshBiometricState();
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authRepository, refreshBiometricState]);

  const persistCredentials = useCallback(
    async (email: string, password: string) => {
      await biometrics.saveCredentials({ email, secret: password });
      await refreshBiometricState();
    },
    [biometrics, refreshBiometricState],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      setIsSubmitting(true);
      try {
        const next = await authRepository.signIn(email, password);
        await persistCredentials(email, password);
        setSession(next);
      } finally {
        setIsSubmitting(false);
      }
    },
    [authRepository, persistCredentials],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      setIsSubmitting(true);
      try {
        const next = await authRepository.signUp(email, password);
        await persistCredentials(email, password);
        setSession(next);
      } finally {
        setIsSubmitting(false);
      }
    },
    [authRepository, persistCredentials],
  );

  const signInWithBiometrics = useCallback(async () => {
    if (!biometricsAvailable) {
      throw new AppError(
        'Biometrics are not available on this device.',
        'biometrics_unavailable',
      );
    }
    const confirmed = await biometrics.authenticate(
      `Sign in with ${biometricLabel}`,
    );
    if (!confirmed) {
      throw new AppError('Biometric sign-in was cancelled.', 'biometrics_cancelled');
    }
    const stored = await biometrics.loadCredentials();
    if (!stored) {
      throw new AppError(
        'No previous sign-in was found for biometrics.',
        'biometrics_missing',
      );
    }
    await signIn(stored.email, stored.secret);
  }, [
    biometricLabel,
    biometrics,
    biometricsAvailable,
    signIn,
  ]);

  const signOut = useCallback(async () => {
    await authRepository.signOut();
    setSession(null);
  }, [authRepository]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isReady,
      isSubmitting,
      biometricsAvailable,
      hasBiometricLogin,
      biometricLabel,
      signIn,
      signUp,
      signInWithBiometrics,
      signOut,
    }),
    [
      biometricLabel,
      biometricsAvailable,
      hasBiometricLogin,
      isReady,
      isSubmitting,
      session,
      signIn,
      signInWithBiometrics,
      signOut,
      signUp,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
