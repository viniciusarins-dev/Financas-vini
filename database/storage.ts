import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  transactions: '@fluxo/transactions',
  categories: '@fluxo/categories',
  goals: '@fluxo/goals',
  goalContributions: '@fluxo/goal_contributions',
  budgets: '@fluxo/budgets',
  recurringRules: '@fluxo/recurring_rules',
  settings: '@fluxo/settings',
  seeded: '@fluxo/seeded_v1',
} as const;

export async function readCollection<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeCollection<T>(key: string, items: T[]): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(items));
}

export async function readValue<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeValue<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
