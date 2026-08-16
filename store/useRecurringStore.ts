import { create } from 'zustand';
import type { RecurringRule } from '@/types/finance';
import { recurringRulesRepo } from '@/database/repositories';
import { generateId } from '@/utils/id';
import { nowIso } from '@/utils/date';
import { useTransactionsStore } from './useTransactionsStore';

function currentYearMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

interface RecurringState {
  rules: RecurringRule[];
  isLoaded: boolean;
  load: () => Promise<void>;
  addRule: (input: Omit<RecurringRule, 'id' | 'active' | 'lastGeneratedYearMonth' | 'createdAt' | 'updatedAt'>) => Promise<RecurringRule>;
  updateRule: (id: string, patch: Partial<RecurringRule>) => Promise<void>;
  removeRule: (id: string) => Promise<void>;
  generateDueTransactions: () => Promise<number>;
}

export const useRecurringStore = create<RecurringState>((set, get) => ({
  rules: [],
  isLoaded: false,

  load: async () => {
    const rules = await recurringRulesRepo.list();
    set({ rules, isLoaded: true });
  },

  addRule: async (input) => {
    const now = nowIso();
    const rule: RecurringRule = { ...input, id: generateId('rec'), active: true, lastGeneratedYearMonth: null, createdAt: now, updatedAt: now };
    await recurringRulesRepo.add(rule);
    set({ rules: [rule, ...get().rules] });
    return rule;
  },

  updateRule: async (id, patch) => {
    const updated = await recurringRulesRepo.update(id, { ...patch, updatedAt: nowIso() });
    if (!updated) return;
    set({ rules: get().rules.map((r) => (r.id === id ? updated : r)) });
  },

  removeRule: async (id) => {
    await recurringRulesRepo.remove(id);
    set({ rules: get().rules.filter((r) => r.id !== id) });
  },

  generateDueTransactions: async () => {
    const today = new Date();
    const thisMonth = currentYearMonth(today);
    const dueRules = get().rules.filter(
      (r) => r.active && r.lastGeneratedYearMonth !== thisMonth && today.getDate() >= r.dayOfMonth,
    );

    if (dueRules.length === 0) return 0;

    const addTransaction = useTransactionsStore.getState().addTransaction;
    for (const rule of dueRules) {
      await addTransaction({
        type: rule.type,
        amount: rule.amount,
        categoryId: rule.categoryId,
        description: rule.description,
        date: nowIso(),
        paymentMethod: rule.paymentMethod,
        notes: 'Gerado automaticamente (recorrente)',
      });
      const updated = await recurringRulesRepo.update(rule.id, { lastGeneratedYearMonth: thisMonth, updatedAt: nowIso() });
      if (updated) {
        set({ rules: get().rules.map((r) => (r.id === rule.id ? updated : r)) });
      }
    }
    return dueRules.length;
  },
}));
