import { create } from 'zustand';
import type { Goal, GoalContribution } from '@/types/finance';
import { goalsRepo, goalContributionsRepo } from '@/database/repositories';
import { generateId } from '@/utils/id';
import { nowIso } from '@/utils/date';

interface GoalsState {
  goals: Goal[];
  contributions: GoalContribution[];
  isLoaded: boolean;
  load: () => Promise<void>;
  addGoal: (input: Omit<Goal, 'id' | 'currentAmount' | 'createdAt' | 'updatedAt'>) => Promise<Goal>;
  removeGoal: (id: string) => Promise<void>;
  addFunds: (goalId: string, amount: number, note?: string) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  contributions: [],
  isLoaded: false,

  load: async () => {
    const [goals, contributions] = await Promise.all([goalsRepo.list(), goalContributionsRepo.list()]);
    set({ goals, contributions, isLoaded: true });
  },

  addGoal: async (input) => {
    const now = nowIso();
    const goal: Goal = { ...input, id: generateId('goal'), currentAmount: 0, createdAt: now, updatedAt: now };
    await goalsRepo.add(goal);
    set({ goals: [goal, ...get().goals] });
    return goal;
  },

  removeGoal: async (id) => {
    await goalsRepo.remove(id);
    set({ goals: get().goals.filter((g) => g.id !== id) });
  },

  addFunds: async (goalId, amount, note) => {
    const goal = get().goals.find((g) => g.id === goalId);
    if (!goal) return;
    const updated = await goalsRepo.update(goalId, { currentAmount: goal.currentAmount + amount, updatedAt: nowIso() });
    const contribution: GoalContribution = {
      id: generateId('contrib'),
      goalId,
      amount,
      date: nowIso(),
      note: note ?? null,
    };
    await goalContributionsRepo.add(contribution);
    set({
      goals: get().goals.map((g) => (g.id === goalId && updated ? updated : g)),
      contributions: [contribution, ...get().contributions],
    });
  },
}));
