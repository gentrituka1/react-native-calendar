import { createLocalAuthRepository } from './localAuthRepository';
import { MemoryKeyValueStore } from '../storage/memoryStore';

describe('createLocalAuthRepository', () => {
  function setup(now = 1_000) {
    const store = new MemoryKeyValueStore();
    const auth = createLocalAuthRepository({
      store,
      ttlMs: 10_000,
      now: () => now,
      createIdFn: () => 'user-1',
    });
    return { store, auth, now };
  }

  it('registers a user and returns a mimic token session', async () => {
    const { auth } = setup();
    const session = await auth.signUp('Ada@Example.com', 'Password1');
    expect(session.user).toEqual({ id: 'user-1', email: 'ada@example.com' });
    expect(session.token.startsWith('local.')).toBe(true);
    await expect(auth.restoreSession()).resolves.toEqual(session);
  });

  it('rejects a duplicate email', async () => {
    const { auth } = setup();
    await auth.signUp('ada@example.com', 'Password1');
    await expect(auth.signUp('ADA@example.com', 'Password1')).rejects.toMatchObject({
      code: 'email_taken',
    });
  });

  it('signs in with the same credentials and rejects a bad password', async () => {
    const { auth } = setup();
    await auth.signUp('ada@example.com', 'Password1');
    await expect(auth.signIn('ada@example.com', 'Password1')).resolves.toMatchObject({
      user: { email: 'ada@example.com' },
    });
    await expect(auth.signIn('ada@example.com', 'WrongPass1')).rejects.toMatchObject({
      code: 'invalid_credentials',
    });
  });

  it('clears the session on sign out', async () => {
    const { auth } = setup();
    await auth.signUp('ada@example.com', 'Password1');
    await auth.signOut();
    await expect(auth.restoreSession()).resolves.toBeNull();
  });

  it('expires a restored session after the TTL', async () => {
    const store = new MemoryKeyValueStore();
    const auth = createLocalAuthRepository({
      store,
      ttlMs: 10_000,
      now: () => 1_000,
      createIdFn: () => 'user-1',
    });
    await auth.signUp('ada@example.com', 'Password1');

    const later = createLocalAuthRepository({
      store,
      ttlMs: 10_000,
      now: () => 20_000,
    });
    await expect(later.restoreSession()).resolves.toBeNull();
  });
});
