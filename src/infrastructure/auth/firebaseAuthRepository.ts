import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import type { AuthRepository } from '../../core/contracts/AuthRepository';
import { AppError } from '../../core/errors/AppError';
import type { AuthSession } from '../../core/types/auth';
import { normalizeEmail } from '../../features/auth/validation/authValidation';
import { mapFirebaseAuthError } from './firebaseAuthErrors';
import { getFirebaseAuth } from '../firebase/app';

function waitForCurrentUser(timeoutMs = 2500): Promise<User | null> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      unsubscribe();
      resolve(auth.currentUser);
    }, timeoutMs);
    const unsubscribe = onAuthStateChanged(auth, user => {
      clearTimeout(timer);
      unsubscribe();
      resolve(user);
    });
  });
}

async function toSession(user: User): Promise<AuthSession> {
  if (!user.email) {
    throw new AppError('Authenticated user is missing an email.', 'auth_invalid');
  }
  const token = await user.getIdToken();
  return {
    token,
    user: { id: user.uid, email: user.email },
  };
}

export function createFirebaseAuthRepository(): AuthRepository {
  return {
    async signUp(email, password) {
      try {
        const credential = await createUserWithEmailAndPassword(
          getFirebaseAuth(),
          normalizeEmail(email),
          password,
        );
        return toSession(credential.user);
      } catch (error) {
        const code =
          typeof error === 'object' && error && 'code' in error
            ? String((error as { code: string }).code)
            : '';
        throw new AppError(mapFirebaseAuthError(code), code || 'firebase_sign_up');
      }
    },

    async signIn(email, password) {
      try {
        const credential = await signInWithEmailAndPassword(
          getFirebaseAuth(),
          normalizeEmail(email),
          password,
        );
        return toSession(credential.user);
      } catch (error) {
        const code =
          typeof error === 'object' && error && 'code' in error
            ? String((error as { code: string }).code)
            : '';
        throw new AppError(mapFirebaseAuthError(code), code || 'firebase_sign_in');
      }
    },

    async signOut() {
      await signOut(getFirebaseAuth());
    },

    async restoreSession() {
      const user = await waitForCurrentUser();
      if (!user) {
        return null;
      }
      return toSession(user);
    },
  };
}
