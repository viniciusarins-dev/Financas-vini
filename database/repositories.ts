import { createRepository } from './createRepository';
import { STORAGE_KEYS } from './storage';
import type { Transaction, Category, Goal, GoalContribution, Budget, RecurringRule } from '@/types/finance';

export const transactionsRepo = createRepository<Transaction>(STORAGE_KEYS.transactions);
export const categoriesRepo = createRepository<Category>(STORAGE_KEYS.categories);
export const goalsRepo = createRepository<Goal>(STORAGE_KEYS.goals);
export const goalContributionsRepo = createRepository<GoalContribution>(STORAGE_KEYS.goalContributions);
export const budgetsRepo = createRepository<Budget>(STORAGE_KEYS.budgets);
export const recurringRulesRepo = createRepository<RecurringRule>(STORAGE_KEYS.recurringRules);
