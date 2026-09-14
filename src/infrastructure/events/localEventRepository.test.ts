import { createLocalEventRepository } from './localEventRepository';
import { MemoryKeyValueStore } from '../storage/memoryStore';
import type { EventDraft } from '../../core/types/events';

const draft: EventDraft = {
  title: ' Standup ',
  description: ' Daily ',
  startAt: '2026-09-14T08:00:00.000Z',
  endAt: '2026-09-14T08:30:00.000Z',
  color: 'moss',
};

describe('createLocalEventRepository', () => {
  function setup() {
    const store = new MemoryKeyValueStore();
    const events = createLocalEventRepository({
      store,
      now: () => new Date('2026-09-14T12:00:00.000Z'),
      createIdFn: () => 'evt-1',
    });
    return { store, events };
  }

  it('creates, lists, updates and removes events for one owner', async () => {
    const { events } = setup();
    const created = await events.create('user-1', draft);
    expect(created).toMatchObject({
      id: 'evt-1',
      ownerId: 'user-1',
      title: 'Standup',
      description: 'Daily',
    });
    await expect(events.listByOwner('user-1')).resolves.toEqual([created]);

    const updated = await events.update('user-1', 'evt-1', {
      ...draft,
      title: 'Planning',
    });
    expect(updated.title).toBe('Planning');
    expect(updated.createdAt).toBe(created.createdAt);

    await events.remove('user-1', 'evt-1');
    await expect(events.listByOwner('user-1')).resolves.toEqual([]);
  });

  it('keeps another user\'s events isolated', async () => {
    const { events } = setup();
    await events.create('user-1', draft);
    await expect(events.listByOwner('user-2')).resolves.toEqual([]);
  });

  it('throws when updating or deleting a missing meeting', async () => {
    const { events } = setup();
    await expect(events.update('user-1', 'missing', draft)).rejects.toMatchObject({
      code: 'event_not_found',
    });
    await expect(events.remove('user-1', 'missing')).rejects.toMatchObject({
      code: 'event_not_found',
    });
  });
});
