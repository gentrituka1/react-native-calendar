import type { CalendarEvent } from '../../../core/types/events';
import {
  eventColorKeysOnDay,
  eventsOnDay,
  layoutDayEvents,
} from './eventLayout';

function event(
  overrides: Partial<CalendarEvent> &
    Pick<CalendarEvent, 'id' | 'startAt' | 'endAt'>,
): CalendarEvent {
  return {
    ownerId: 'u1',
    title: overrides.title ?? overrides.id,
    description: '',
    color: overrides.color ?? 'moss',
    createdAt: '2026-09-14T00:00:00.000Z',
    updatedAt: '2026-09-14T00:00:00.000Z',
    ...overrides,
  };
}

describe('eventLayout', () => {
  const day = new Date(2026, 8, 14);

  it('returns only events that intersect the selected day, sorted', () => {
    const events = [
      event({
        id: 'later',
        startAt: new Date(2026, 8, 14, 15, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 16, 0).toISOString(),
      }),
      event({
        id: 'earlier',
        startAt: new Date(2026, 8, 14, 9, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 10, 0).toISOString(),
      }),
      event({
        id: 'other-day',
        startAt: new Date(2026, 8, 15, 9, 0).toISOString(),
        endAt: new Date(2026, 8, 15, 10, 0).toISOString(),
      }),
    ];

    expect(eventsOnDay(events, day).map(item => item.id)).toEqual([
      'earlier',
      'later',
    ]);
  });

  it('includes events that start the previous night and end on this day', () => {
    const events = [
      event({
        id: 'overnight',
        startAt: new Date(2026, 8, 13, 23, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 1, 0).toISOString(),
      }),
    ];
    expect(eventsOnDay(events, day)).toHaveLength(1);
  });

  it('collects up to three unique color dots', () => {
    const events = [
      event({
        id: 'a',
        color: 'moss',
        startAt: new Date(2026, 8, 14, 9, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 10, 0).toISOString(),
      }),
      event({
        id: 'b',
        color: 'gold',
        startAt: new Date(2026, 8, 14, 10, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 11, 0).toISOString(),
      }),
      event({
        id: 'c',
        color: 'moss',
        startAt: new Date(2026, 8, 14, 11, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 12, 0).toISOString(),
      }),
      event({
        id: 'd',
        color: 'plum',
        startAt: new Date(2026, 8, 14, 12, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 13, 0).toISOString(),
      }),
      event({
        id: 'e',
        color: 'indigo',
        startAt: new Date(2026, 8, 14, 13, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 14, 0).toISOString(),
      }),
    ];
    expect(eventColorKeysOnDay(events, day)).toEqual(['moss', 'gold', 'plum']);
  });

  it('places overlapping meetings into side-by-side columns', () => {
    const events = [
      event({
        id: 'a',
        startAt: new Date(2026, 8, 14, 9, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 11, 0).toISOString(),
      }),
      event({
        id: 'b',
        startAt: new Date(2026, 8, 14, 10, 0).toISOString(),
        endAt: new Date(2026, 8, 14, 12, 0).toISOString(),
      }),
    ];
    const layout = layoutDayEvents(events, day);
    expect(layout).toHaveLength(2);
    expect(layout[0].column).toBe(0);
    expect(layout[1].column).toBe(1);
    expect(layout[0].columnCount).toBe(2);
    expect(layout[1].startMinutes).toBe(10 * 60);
  });
});
