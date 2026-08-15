import React, { useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useThemeColors } from '@/hooks/useThemeColors';
import { MonthPicker } from '@/features/summary/MonthPicker';
import { MonthStatsGrid } from '@/features/summary/MonthStatsGrid';
import { CategoryBreakdownChart } from '@/features/summary/CategoryBreakdownChart';
import { IncomeExpenseChart } from '@/features/summary/IncomeExpenseChart';
import { InsightsList } from '@/features/summary/InsightCard';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { computeMonthlySummary, computeCategoryBreakdown, generateInsights } from '@/services/financeCalculations';

export default function SummaryScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const transactions = useTransactionsStore((s) => s.transactions);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const summary = useMemo(() => computeMonthlySummary(transactions, year, month), [transactions, year, month]);
  const breakdown = useMemo(() => computeCategoryBreakdown(transactions, year, month, 'expense'), [transactions, year, month]);
  const insights = useMemo(() => generateInsights(transactions, year, month), [transactions, year, month]);

  return (
    <Screen>
      <ScreenHeader
        title="Resumo"
        subtitle="Visão geral do mês"
        right={
          <Pressable
            onPress={() => router.push('/budgets')}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center' }}
          >
            <Wallet size={18} color={colors.accent} />
          </Pressable>
        }
      />
      <MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />

      <Animated.View entering={FadeInDown.duration(450).springify()}>
        <MonthStatsGrid summary={summary} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(450).delay(100).springify()}>
        <IncomeExpenseChart income={summary.income} expense={summary.expense} saving={summary.saving} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(450).delay(200).springify()}>
        <CategoryBreakdownChart items={breakdown} total={summary.expense} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(450).delay(300).springify()}>
        <InsightsList insights={insights} />
      </Animated.View>
    </Screen>
  );
}
