import { createMimicToken, hashSecret, parseMimicToken } from './mimicToken';

describe('mimicToken', () => {
  const user = { id: 'u1', email: 'ada@example.com' };

  it('creates a parseable local token', () => {
    const token = createMimicToken(user, 1_000, 5_000);
    expect(token.startsWith('local.')).toBe(true);
    expect(parseMimicToken(token, 1_000)).toEqual(user);
  });

  it('rejects expired tokens', () => {
    const token = createMimicToken(user, 1_000, 5_000);
    expect(parseMimicToken(token, 6_001)).toBeNull();
  });

  it('rejects malformed tokens', () => {
    expect(parseMimicToken('nope', 1_000)).toBeNull();
    expect(parseMimicToken('local.zz', 1_000)).toBeNull();
    expect(parseMimicToken('local.notjsonhex', 1_000)).toBeNull();
  });

  it('hashes secrets deterministically and with salt', () => {
    expect(hashSecret('Password1', 'rnc:a@b.co')).toBe(
      hashSecret('Password1', 'rnc:a@b.co'),
    );
    expect(hashSecret('Password1', 'salt-a')).not.toBe(
      hashSecret('Password1', 'salt-b'),
    );
  });
});
