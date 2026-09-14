import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import type { EventRepository } from '../../core/contracts/EventRepository';
import { AppError } from '../../core/errors/AppError';
import type { CalendarEvent, EventDraft } from '../../core/types/events';
import { createId } from '../../shared/utils/id';
import { getFirebaseFirestore } from '../firebase/app';

function eventsCollection(ownerId: string) {
  return collection(getFirebaseFirestore(), 'users', ownerId, 'events');
}

function eventDoc(ownerId: string, eventId: string) {
  return doc(getFirebaseFirestore(), 'users', ownerId, 'events', eventId);
}

function fromDraft(
  ownerId: string,
  eventId: string,
  draft: EventDraft,
  createdAt: string,
  updatedAt: string,
): CalendarEvent {
  return {
    id: eventId,
    ownerId,
    title: draft.title.trim(),
    description: draft.description.trim(),
    startAt: draft.startAt,
    endAt: draft.endAt,
    color: draft.color,
    createdAt,
    updatedAt,
  };
}

export function createFirebaseEventRepository(): EventRepository {
  return {
    async listByOwner(ownerId) {
      const snapshot = await getDocs(eventsCollection(ownerId));
      return snapshot.docs.map(item => item.data() as CalendarEvent);
    },

    async create(ownerId, draft) {
      const eventId = createId();
      const timestamp = new Date().toISOString();
      const event = fromDraft(ownerId, eventId, draft, timestamp, timestamp);
      await setDoc(eventDoc(ownerId, eventId), event);
      return event;
    },

    async update(ownerId, eventId, draft) {
      const existing = (await getDocs(eventsCollection(ownerId))).docs.find(
        item => item.id === eventId,
      );
      if (!existing) {
        throw new AppError('Meeting not found.', 'event_not_found');
      }
      const previous = existing.data() as CalendarEvent;
      const event = fromDraft(
        ownerId,
        eventId,
        draft,
        previous.createdAt,
        new Date().toISOString(),
      );
      await setDoc(eventDoc(ownerId, eventId), event);
      return event;
    },

    async remove(ownerId, eventId) {
      await deleteDoc(eventDoc(ownerId, eventId));
    },
  };
}
