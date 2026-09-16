import {
  getPasswordChecks,
  hasAuthFieldErrors,
  normalizeEmail,
  validateAuthForm,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from './authValidation';

describe('authValidation', () => {
  it('normalizes email casing and whitespace', () => {
    expect(normalizeEmail('  Ada@Example.COM ')).toBe('ada@example.com');
  });

  it('rejects empty or malformed emails', () => {
    expect(validateEmail('')).toBe('Email is required.');
    expect(validateEmail('not-an-email')).toBe('Enter a valid email address.');
  });

  it('accepts a valid email', () => {
    expect(validateEmail('user@procredit.com')).toBeUndefined();
  });

  it('enforces password rules', () => {
    expect(validatePassword('')).toBe('Password is required.');
    expect(validatePassword('short1')).toBe(
      'Password must be at least 8 characters.',
    );
    expect(validatePassword('longpassword')).toBe(
      'Password must include a letter and a number.',
    );
    expect(validatePassword('Password1')).toBeUndefined();
  });

  it('collects field errors for a form', () => {
    const errors = validateAuthForm('bad', 'x');
    expect(hasAuthFieldErrors(errors)).toBe(true);
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
    expect(hasAuthFieldErrors(validateAuthForm('a@b.co', 'Password1'))).toBe(
      false,
    );
  });

  it('tracks password rule progress', () => {
    expect(getPasswordChecks('ab')).toEqual({
      minLength: false,
      letter: true,
      number: false,
    });
    expect(getPasswordChecks('Password1')).toEqual({
      minLength: true,
      letter: true,
      number: true,
    });
  });

  it('requires matching confirmation', () => {
    expect(validatePasswordConfirmation('Password1', '')).toBe(
      'Confirm your password.',
    );
    expect(validatePasswordConfirmation('Password1', 'Password2')).toBe(
      'Passwords do not match.',
    );
    expect(validatePasswordConfirmation('Password1', 'Password1')).toBeUndefined();
  });
});
