import { mapFirebaseAuthError } from './firebaseAuthErrors';

describe('mapFirebaseAuthError', () => {
  it('maps known Firebase codes to product copy', () => {
    expect(mapFirebaseAuthError('auth/email-already-in-use')).toBe(
      'An account with this email already exists.',
    );
    expect(mapFirebaseAuthError('auth/invalid-credential')).toBe(
      'Invalid email or password.',
    );
  });

  it('falls back for unknown codes', () => {
    expect(mapFirebaseAuthError('auth/something-new')).toBe(
      'Authentication failed. Please try again.',
    );
  });
});
