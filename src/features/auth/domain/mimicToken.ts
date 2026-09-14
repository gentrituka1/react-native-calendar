import type { AuthUser } from '../../../core/types/auth';

type TokenPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

function toHex(value: string): string {
  let result = '';
  for (let index = 0; index < value.length; index += 1) {
    result += value.charCodeAt(index).toString(16).padStart(2, '0');
  }
  return result;
}

function fromHex(value: string): string | null {
  if (value.length % 2 !== 0) {
    return null;
  }
  let result = '';
  for (let index = 0; index < value.length; index += 2) {
    const code = Number.parseInt(value.slice(index, index + 2), 16);
    if (Number.isNaN(code)) {
      return null;
    }
    result += String.fromCharCode(code);
  }
  return result;
}

export function createMimicToken(
  user: AuthUser,
  issuedAt: number,
  ttlMs: number,
): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    iat: issuedAt,
    exp: issuedAt + ttlMs,
  };
  return `local.${toHex(JSON.stringify(payload))}`;
}

export function parseMimicToken(
  token: string,
  now: number,
): AuthUser | null {
  if (!token.startsWith('local.')) {
    return null;
  }
  const encoded = token.slice('local.'.length);
  const decoded = fromHex(encoded);
  if (!decoded) {
    return null;
  }
  try {
    const payload = JSON.parse(decoded) as TokenPayload;
    if (!payload.sub || !payload.email || !payload.exp) {
      return null;
    }
    if (payload.exp <= now) {
      return null;
    }
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function hashSecret(secret: string, salt: string): string {
  const input = `${salt}:${secret}`;
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    // FNV-1a: bitwise ops are required for a stable 32-bit hash.
    // eslint-disable-next-line no-bitwise
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  // eslint-disable-next-line no-bitwise
  return (hash >>> 0).toString(16);
}
