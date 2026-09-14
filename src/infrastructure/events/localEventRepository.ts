import type { EventRepository } from '../../core/contracts/EventRepository';
import type { KeyValueStore } from '../../core/contracts/KeyValueStore';
import { AppError } from '../../core/errors/AppError';
import type { CalendarEvent } from '../../core/types/events';
import { createId } from '../../shared/utils/id';

type EventRepositoryOptions = {
  store: KeyValueStore;
  now?: () => Date;
  createIdFn?: () => string;
};

function storageKey(ownerId: string): string {
  return `@rnc/events/${ownerId}`;
}

async function readEvents(
  store: KeyValueStore,
  ownerId: string,
): Promise<CalendarEvent[]> {
  const raw = await store.getItem(storageKey(ownerId));
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw) as CalendarEvent[];
  } catch {
    return [];
  }
}

export function createLocalEventRepository(
  options: EventRepositoryOptions,
): EventRepository {
  const now = options.now ?? (() => new Date());
  const nextId = options.createIdFn ?? createId;

  return {
    async listByOwner(ownerId) {
      return readEvents(options.store, ownerId);
    },

    async create(ownerId, draft) {
      const events = await readEvents(options.store, ownerId);
      const timestamp = now().toISOString();
      const event: CalendarEvent = {
        id: nextId(),
        ownerId,
        title: draft.title.trim(),
        description: draft.description.trim(),
        startAt: draft.startAt,
        endAt: draft.endAt,
        color: draft.color,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await options.store.setItem(
        storageKey(ownerId),
        JSON.stringify([...events, event]),
      );
      return event;
    },

    async update(ownerId, eventId, draft) {
      const events = await readEvents(options.store, ownerId);
      const index = events.findIndex(event => event.id === eventId);
      if (index === -1) {
        throw new AppError('Meeting not found.', 'event_not_found');
      }
      const updated: CalendarEvent = {
        ...events[index],
        title: draft.title.trim(),
        description: draft.description.trim(),
        startAt: draft.startAt,
        endAt: draft.endAt,
        color: draft.color,
        updatedAt: now().toISOString(),
      };
      const next = [...events];
      next[index] = updated;
      await options.store.setItem(storageKey(ownerId), JSON.stringify(next));
      return updated;
    },

    async remove(ownerId, eventId) {
      const events = await readEvents(options.store, ownerId);
      const next = events.filter(event => event.id !== eventId);
      if (next.length === events.length) {
        throw new AppError('Meeting not found.', 'event_not_found');
      }
      await options.store.setItem(storageKey(ownerId), JSON.stringify(next));
    },
  };
}
