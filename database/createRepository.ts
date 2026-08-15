import { readCollection, writeCollection } from './storage';

interface Identifiable {
  id: string;
}

export function createRepository<T extends Identifiable>(storageKey: string) {
  return {
    async list(): Promise<T[]> {
      return readCollection<T>(storageKey);
    },
    async add(item: T): Promise<T> {
      const items = await readCollection<T>(storageKey);
      items.unshift(item);
      await writeCollection(storageKey, items);
      return item;
    },
    async update(id: string, patch: Partial<T>): Promise<T | null> {
      const items = await readCollection<T>(storageKey);
      const index = items.findIndex((i) => i.id === id);
      if (index === -1) return null;
      const updated = { ...items[index], ...patch };
      items[index] = updated;
      await writeCollection(storageKey, items);
      return updated;
    },
    async remove(id: string): Promise<void> {
      const items = await readCollection<T>(storageKey);
      await writeCollection(
        storageKey,
        items.filter((i) => i.id !== id),
      );
    },
    async replaceAll(items: T[]): Promise<void> {
      await writeCollection(storageKey, items);
    },
  };
}
