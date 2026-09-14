import type { CalendarEvent, EventDraft } from '../types/events';

export interface EventRepository {
  listByOwner(ownerId: string): Promise<CalendarEvent[]>;
  create(ownerId: string, draft: EventDraft): Promise<CalendarEvent>;
  update(
    ownerId: string,
    eventId: string,
    draft: EventDraft,
  ): Promise<CalendarEvent>;
  remove(ownerId: string, eventId: string): Promise<void>;
}
