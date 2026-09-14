export type EventFieldErrors = {
  title?: string;
  time?: string;
};

export function validateEventDraft(input: {
  title: string;
  startAt: Date;
  endAt: Date;
}): EventFieldErrors {
  const errors: EventFieldErrors = {};
  const title = input.title.trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length > 80) {
    errors.title = 'Title must be 80 characters or less.';
  }

  if (!(input.startAt instanceof Date) || Number.isNaN(input.startAt.getTime())) {
    errors.time = 'Start time is invalid.';
  } else if (!(input.endAt instanceof Date) || Number.isNaN(input.endAt.getTime())) {
    errors.time = 'End time is invalid.';
  } else if (input.endAt.getTime() <= input.startAt.getTime()) {
    errors.time = 'End time must be after the start time.';
  }

  return errors;
}

export function hasEventFieldErrors(errors: EventFieldErrors): boolean {
  return Boolean(errors.title || errors.time);
}
