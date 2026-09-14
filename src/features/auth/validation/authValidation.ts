const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthFieldErrors = {
  email?: string;
  password?: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | undefined {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return 'Email is required.';
  }
  if (!EMAIL_PATTERN.test(normalized)) {
    return 'Enter a valid email address.';
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include a letter and a number.';
  }
  return undefined;
}

export function validateAuthForm(
  email: string,
  password: string,
): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  if (emailError) {
    errors.email = emailError;
  }
  if (passwordError) {
    errors.password = passwordError;
  }
  return errors;
}

export function hasAuthFieldErrors(errors: AuthFieldErrors): boolean {
  return Boolean(errors.email || errors.password);
}
