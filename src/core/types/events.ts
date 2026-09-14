export const EVENT_COLOR_KEYS = [
  'moss',
  'terracotta',
  'indigo',
  'gold',
  'plum',
] as const;

export type EventColorKey = (typeof EVENT_COLOR_KEYS)[number];

export type CalendarEvent = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  color: EventColorKey;
  createdAt: string;
  updatedAt: string;
};

export type EventDraft = {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  color: EventColorKey;
};
