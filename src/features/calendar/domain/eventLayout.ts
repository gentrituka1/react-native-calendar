import type { CalendarEvent } from '../../../core/types/events';
import { addDays, startOfDay } from './calendarDate';

export type PositionedEvent = {
  event: CalendarEvent;
  startMinutes: number;
  endMinutes: number;
  column: number;
  columnCount: number;
};

function overlapsDay(event: CalendarEvent, dayStart: Date, dayEnd: Date): boolean {
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  return start < dayEnd && end > dayStart;
}

export function eventsOnDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent[] {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, 1);
  return events
    .filter(event => overlapsDay(event, dayStart, dayEnd))
    .sort(
      (left, right) =>
        new Date(left.startAt).getTime() - new Date(right.startAt).getTime(),
    );
}

export function eventColorKeysOnDay(
  events: CalendarEvent[],
  day: Date,
): CalendarEvent['color'][] {
  const seen = new Set<CalendarEvent['color']>();
  const keys: CalendarEvent['color'][] = [];
  for (const event of eventsOnDay(events, day)) {
    if (!seen.has(event.color)) {
      seen.add(event.color);
      keys.push(event.color);
    }
    if (keys.length === 3) {
      break;
    }
  }
  return keys;
}

export function layoutDayEvents(
  events: CalendarEvent[],
  day: Date,
): PositionedEvent[] {
  const dayStart = startOfDay(day);
  const dayEnd = addDays(dayStart, 1);
  const dayStartMs = dayStart.getTime();
  const dayEndMs = dayEnd.getTime();

  const items = eventsOnDay(events, day).map(event => {
    const start = Math.max(new Date(event.startAt).getTime(), dayStartMs);
    const end = Math.min(new Date(event.endAt).getTime(), dayEndMs);
    return {
      event,
      startMinutes: Math.max(0, Math.round((start - dayStartMs) / 60000)),
      endMinutes: Math.max(
        Math.round((start - dayStartMs) / 60000) + 15,
        Math.round((end - dayStartMs) / 60000),
      ),
      column: 0,
      columnCount: 1,
    };
  });

  const columnEnds: number[] = [];

  for (const item of items) {
    let column = 0;
    while (column < columnEnds.length && columnEnds[column] > item.startMinutes) {
      column += 1;
    }
    item.column = column;
    columnEnds[column] = item.endMinutes;
  }

  const groups: PositionedEvent[][] = [];
  let currentGroup: PositionedEvent[] = [];
  let groupEnd = -1;

  for (const item of items) {
    if (currentGroup.length === 0 || item.startMinutes < groupEnd) {
      currentGroup.push(item);
      groupEnd = Math.max(groupEnd, item.endMinutes);
    } else {
      groups.push(currentGroup);
      currentGroup = [item];
      groupEnd = item.endMinutes;
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  for (const group of groups) {
    const columnCount = Math.max(...group.map(item => item.column)) + 1;
    for (const item of group) {
      item.columnCount = columnCount;
    }
  }

  return items;
}
