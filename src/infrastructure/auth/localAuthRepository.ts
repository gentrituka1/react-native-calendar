import type { AuthRepository } from '../../core/contracts/AuthRepository';
import type { KeyValueStore } from '../../core/contracts/KeyValueStore';
import { AppError } from '../../core/errors/AppError';
import type { AuthSession, AuthUser } from '../../core/types/auth';
import {
  createMimicToken,
  hashSecret,
  parseMimicToken,
} from '../../features/auth/domain/mimicToken';
import { normalizeEmail } from '../../features/auth/validation/authValidation';
import { createId } from '../../shared/utils/id';

const USERS_KEY = '@rnc/users';
const SESSION_KEY = '@rnc/session';

type StoredUser = {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type AuthRepositoryOptions = {
  store: KeyValueStore;
  ttlMs: number;
  now?: () => number;
  createIdFn?: () => string;
};

async function readUsers(store: KeyValueStore): Promise<StoredUser[]> {
  const raw = await store.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

export function createLocalAuthRepository(
  options: AuthRepositoryOptions,
): AuthRepository {
  const now = options.now ?? Date.now;
  const nextId = options.createIdFn ?? createId;

  return {
    async signUp(email, password) {
      const normalized = normalizeEmail(email);
      const users = await readUsers(options.store);
      if (users.some(user => user.email === normalized)) {
        throw new AppError(
          'An account with this email already exists.',
          'email_taken',
        );
      }

      const user: StoredUser = {
        id: nextId(),
        email: normalized,
        passwordHash: hashSecret(password, `rnc:${normalized}`),
        createdAt: new Date(now()).toISOString(),
      };
      await options.store.setItem(USERS_KEY, JSON.stringify([...users, user]));
      return persistSession(options.store, user, now(), options.ttlMs);
    },

    async signIn(email, password) {
      const normalized = normalizeEmail(email);
      const users = await readUsers(options.store);
      const user = users.find(item => item.email === normalized);
      const passwordHash = hashSecret(password, `rnc:${normalized}`);
      if (!user || user.passwordHash !== passwordHash) {
        throw new AppError('Invalid email or password.', 'invalid_credentials');
      }
      return persistSession(options.store, user, now(), options.ttlMs);
    },

    async signOut() {
      await options.store.removeItem(SESSION_KEY);
    },

    async restoreSession() {
      const raw = await options.store.getItem(SESSION_KEY);
      if (!raw) {
        return null;
      }
      try {
        const session = JSON.parse(raw) as AuthSession;
        const user = parseMimicToken(session.token, now());
        if (!user) {
          await options.store.removeItem(SESSION_KEY);
          return null;
        }
        return { user, token: session.token };
      } catch {
        await options.store.removeItem(SESSION_KEY);
        return null;
      }
    },
  };
}

async function persistSession(
  store: KeyValueStore,
  user: AuthUser,
  issuedAt: number,
  ttlMs: number,
): Promise<AuthSession> {
  const session: AuthSession = {
    user: { id: user.id, email: user.email },
    token: createMimicToken({ id: user.id, email: user.email }, issuedAt, ttlMs),
  };
  await store.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}
