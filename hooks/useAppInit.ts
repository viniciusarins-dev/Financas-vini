import { useEffect, useState } from 'react';
import { seedIfNeeded } from '@/database/seed';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { useGoalsStore } from '@/store/useGoalsStore';
import { useBudgetsStore } from '@/store/useBudgetsStore';
import { useSettingsStore } from '@/store/useSettingsStore';

export function useAppInit(): { isReady: boolean } {
  const [isReady, setIsReady] = useState(false);
  const loadTransactions = useTransactionsStore((s) => s.load);
  const loadCategories = useCategoriesStore((s) => s.load);
  const loadGoals = useGoalsStore((s) => s.load);
  const loadBudgets = useBudgetsStore((s) => s.load);
  const loadSettings = useSettingsStore((s) => s.load);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      await seedIfNeeded();
      await Promise.all([loadTransactions(), loadCategories(), loadGoals(), loadBudgets(), loadSettings()]);
      if (!cancelled) setIsReady(true);
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isReady };
}
