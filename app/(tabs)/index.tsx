import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Settings } from 'lucide-react-native';
import { Screen } from '@/components/Screen';
import { BalanceCard } from '@/features/dashboard/BalanceCard';
import { SummaryStatsRow } from '@/features/dashboard/SummaryStatsRow';
import { BalanceEvolutionChart } from '@/features/dashboard/BalanceEvolutionChart';
import { TopCategoriesCard } from '@/features/dashboard/TopCategoriesCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { computeMonthlySummary, computeCategoryBreakdown, computeBalanceEvolution } from '@/services/financeCalculations';

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const transactions = useTransactionsStore((s) => s.transactions);
  const userName = useSettingsStore((s) => s.settings.userName);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const summary = useMemo(() => computeMonthlySummary(transactions, year, month), [transactions, year, month]);
  const breakdown = useMemo(() => computeCategoryBreakdown(transactions, year, month, 'expense'), [transactions, year, month]);
  const evolution = useMemo(() => computeBalanceEvolution(transactions, year, month), [transactions, year, month]);

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View>
          <Text style={{ color: colors.muted, fontSize: 14, fontWeight: '600' }}>{greeting}</Text>
          <Text style={{ color: colors.ink, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            Olá, {userName} 👋
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/settings')}
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.raised }}
        >
          <Settings size={18} color={colors.muted} />
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.duration(500).springify()}>
        <BalanceCard balance={summary.balance} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(80).springify()}>
        <SummaryStatsRow income={summary.income} expense={summary.expense} saving={summary.saving} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(160).springify()}>
        <BalanceEvolutionChart points={evolution} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(240).springify()}>
        <TopCategoriesCard items={breakdown} />
      </Animated.View>
    </Screen>
  );
}
