import type { KeyValueStore } from '../../core/contracts/KeyValueStore';

export class MemoryKeyValueStore implements KeyValueStore {
  constructor(private readonly data = new Map<string, string>()) {}

  async getItem(key: string): Promise<string | null> {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }
}
