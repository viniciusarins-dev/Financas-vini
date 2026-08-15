import { create } from 'zustand';
import type { Transaction } from '@/types/finance';
import { transactionsRepo } from '@/database/repositories';
import { generateId } from '@/utils/id';
import { nowIso } from '@/utils/date';

interface TransactionsState {
  transactions: Transaction[];
  isLoaded: boolean;
  load: () => Promise<void>;
  addTransaction: (input: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Transaction>;
  updateTransaction: (id: string, patch: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  isLoaded: false,

  load: async () => {
    const items = await transactionsRepo.list();
    items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    set({ transactions: items, isLoaded: true });
  },

  addTransaction: async (input) => {
    const now = nowIso();
    const transaction: Transaction = { ...input, id: generateId('tx'), createdAt: now, updatedAt: now };
    await transactionsRepo.add(transaction);
    set({ transactions: [transaction, ...get().transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) });
    return transaction;
  },

  updateTransaction: async (id, patch) => {
    const updated = await transactionsRepo.update(id, { ...patch, updatedAt: nowIso() });
    if (!updated) return;
    set({
      transactions: get()
        .transactions.map((t) => (t.id === id ? updated : t))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    });
  },

  removeTransaction: async (id) => {
    await transactionsRepo.remove(id);
    set({ transactions: get().transactions.filter((t) => t.id !== id) });
  },
}));
