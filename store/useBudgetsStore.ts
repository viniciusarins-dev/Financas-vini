import { create } from 'zustand';
import type { Budget } from '@/types/finance';
import { budgetsRepo } from '@/database/repositories';
import { generateId } from '@/utils/id';
import { nowIso } from '@/utils/date';

interface BudgetsState {
  budgets: Budget[];
  isLoaded: boolean;
  load: () => Promise<void>;
  addBudget: (categoryId: string, monthlyLimit: number) => Promise<Budget>;
  updateBudget: (id: string, monthlyLimit: number) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
}

export const useBudgetsStore = create<BudgetsState>((set, get) => ({
  budgets: [],
  isLoaded: false,

  load: async () => {
    const items = await budgetsRepo.list();
    set({ budgets: items, isLoaded: true });
  },

  addBudget: async (categoryId, monthlyLimit) => {
    const now = nowIso();
    const budget: Budget = { id: generateId('bud'), categoryId, monthlyLimit, createdAt: now, updatedAt: now };
    await budgetsRepo.add(budget);
    set({ budgets: [...get().budgets, budget] });
    return budget;
  },

  updateBudget: async (id, monthlyLimit) => {
    const updated = await budgetsRepo.update(id, { monthlyLimit, updatedAt: nowIso() });
    if (!updated) return;
    set({ budgets: get().budgets.map((b) => (b.id === id ? updated : b)) });
  },

  removeBudget: async (id) => {
    await budgetsRepo.remove(id);
    set({ budgets: get().budgets.filter((b) => b.id !== id) });
  },
}));
