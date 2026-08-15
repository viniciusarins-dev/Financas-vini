import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency, formatPercentage } from '@/utils/currency';
import type { MonthlySummary } from '@/types/finance';

function StatCell({ label, value, color, isPercentage }: { label: string; value: number; color: string; isPercentage?: boolean }) {
  const colors = useThemeColors();
  return (
    <GlassCard style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 6 }}>
        <Text style={{ color: colors.muted, fontSize: 12.5, fontWeight: '600' }}>{label}</Text>
        {isPercentage ? (
          <Text style={{ color, fontSize: 20, fontWeight: '800' }}>{formatPercentage(value)}</Text>
        ) : (
          <AnimatedNumber value={value} formatter={formatCurrency} style={{ color, fontSize: 18, fontWeight: '800' }} />
        )}
      </View>
    </GlassCard>
  );
}

interface MonthStatsGridProps {
  summary: MonthlySummary;
}

export function MonthStatsGrid({ summary }: MonthStatsGridProps) {
  const colors = useThemeColors();
  return (
    <View style={{ gap: 10, marginTop: 16 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <StatCell label="Entrou" value={summary.income} color={colors.income} />
        <StatCell label="Saiu" value={summary.expense} color={colors.expense} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <StatCell label="Guardado" value={summary.saving} color={colors.saving} />
        <StatCell label="Taxa de economia" value={summary.savingsRate} color={colors.accent} isPercentage />
      </View>
      <StatCell label="Saldo final" value={summary.balance} color={summary.balance >= 0 ? colors.income : colors.expense} />
    </View>
  );
}
