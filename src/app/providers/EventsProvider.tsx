import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CalendarEvent, EventDraft } from '../../core/types/events';
import { useAuth } from './AuthProvider';
import { useDependencies } from './DependenciesProvider';

type EventsContextValue = {
  events: CalendarEvent[];
  isLoading: boolean;
  createEvent: (draft: EventDraft) => Promise<CalendarEvent>;
  updateEvent: (eventId: string, draft: EventDraft) => Promise<CalendarEvent>;
  removeEvent: (eventId: string) => Promise<void>;
  getEvent: (eventId: string) => CalendarEvent | undefined;
};

const EventsContext = createContext<EventsContextValue | null>(null);

export function EventsProvider({ children }: { children: ReactNode }) {
  const { eventRepository } = useDependencies();
  const { session } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!session) {
      setEvents([]);
      return;
    }
    setIsLoading(true);
    try {
      const next = await eventRepository.listByOwner(session.user.id);
      setEvents(next);
    } finally {
      setIsLoading(false);
    }
  }, [eventRepository, session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createEvent = useCallback(
    async (draft: EventDraft) => {
      if (!session) {
        throw new Error('Not authenticated');
      }
      const created = await eventRepository.create(session.user.id, draft);
      setEvents(current => [...current, created]);
      return created;
    },
    [eventRepository, session],
  );

  const updateEvent = useCallback(
    async (eventId: string, draft: EventDraft) => {
      if (!session) {
        throw new Error('Not authenticated');
      }
      const updated = await eventRepository.update(
        session.user.id,
        eventId,
        draft,
      );
      setEvents(current =>
        current.map(event => (event.id === eventId ? updated : event)),
      );
      return updated;
    },
    [eventRepository, session],
  );

  const removeEvent = useCallback(
    async (eventId: string) => {
      if (!session) {
        throw new Error('Not authenticated');
      }
      await eventRepository.remove(session.user.id, eventId);
      setEvents(current => current.filter(event => event.id !== eventId));
    },
    [eventRepository, session],
  );

  const getEvent = useCallback(
    (eventId: string) => events.find(event => event.id === eventId),
    [events],
  );

  const value = useMemo(
    () => ({
      events,
      isLoading,
      createEvent,
      updateEvent,
      removeEvent,
      getEvent,
    }),
    [createEvent, events, getEvent, isLoading, removeEvent, updateEvent],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
}

export function useEvents(): EventsContextValue {
  const value = useContext(EventsContext);
  if (!value) {
    throw new Error('useEvents must be used inside EventsProvider');
  }
  return value;
}
