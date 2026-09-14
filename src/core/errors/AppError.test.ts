import { getErrorMessage, AppError } from './AppError';

describe('AppError', () => {
  it('exposes a stable code', () => {
    const error = new AppError('Nope', 'nope');
    expect(error.code).toBe('nope');
    expect(getErrorMessage(error)).toBe('Nope');
  });

  it('unwraps unknown values safely', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
    expect(getErrorMessage('x')).toBe('Something went wrong. Please try again.');
  });
});
