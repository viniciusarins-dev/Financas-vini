import React from 'react';
import { View, Text } from 'react-native';
import { ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { useThemeColors } from '@/hooks/useThemeColors';

interface StatItemProps {
  label: string;
  value: number;
  color: string;
  Icon: typeof ArrowUpRight;
}

function StatItem({ label, value, color, Icon }: StatItemProps) {
  const colors = useThemeColors();
  return (
    <GlassCard style={{ flex: 1 }}>
      <View style={{ padding: 14, gap: 8 }}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: `${color}22`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} color={color} strokeWidth={2.4} />
        </View>
        <Text style={{ color: colors.muted, fontSize: 12.5, fontWeight: '600' }}>{label}</Text>
        <AnimatedNumber value={value} style={{ color: colors.ink, fontSize: 16, fontWeight: '700' }} />
      </View>
    </GlassCard>
  );
}

interface SummaryStatsRowProps {
  income: number;
  expense: number;
  saving: number;
}

export function SummaryStatsRow({ income, expense, saving }: SummaryStatsRowProps) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
      <StatItem label="Entradas" value={income} color={colors.income} Icon={ArrowUpRight} />
      <StatItem label="Despesas" value={expense} color={colors.expense} Icon={ArrowDownRight} />
      <StatItem label="Guardado" value={saving} color={colors.saving} Icon={PiggyBank} />
    </View>
  );
}
