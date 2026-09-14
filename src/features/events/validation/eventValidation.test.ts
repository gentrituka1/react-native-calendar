import {
  hasEventFieldErrors,
  validateEventDraft,
} from './eventValidation';

describe('eventValidation', () => {
  const startAt = new Date(2026, 8, 14, 9, 0);
  const endAt = new Date(2026, 8, 14, 10, 0);

  it('requires a title', () => {
    const errors = validateEventDraft({ title: '  ', startAt, endAt });
    expect(errors.title).toBe('Title is required.');
    expect(hasEventFieldErrors(errors)).toBe(true);
  });

  it('limits title length', () => {
    const errors = validateEventDraft({
      title: 'x'.repeat(81),
      startAt,
      endAt,
    });
    expect(errors.title).toBe('Title must be 80 characters or less.');
  });

  it('requires the end to be after the start', () => {
    const errors = validateEventDraft({
      title: 'Standup',
      startAt: endAt,
      endAt: startAt,
    });
    expect(errors.time).toBe('End time must be after the start time.');
  });

  it('accepts a valid draft', () => {
    expect(
      hasEventFieldErrors(
        validateEventDraft({ title: 'Standup', startAt, endAt }),
      ),
    ).toBe(false);
  });
});
