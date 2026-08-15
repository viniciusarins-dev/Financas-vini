import React, { useMemo } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { GlassCard } from '@/components/GlassCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrencyCompact } from '@/utils/currency';
import type { BalancePoint } from '@/services/financeCalculations';

interface BalanceEvolutionChartProps {
  points: BalancePoint[];
}

const screenWidth = Dimensions.get('window').width;

export function BalanceEvolutionChart({ points }: BalanceEvolutionChartProps) {
  const colors = useThemeColors();

  const data = useMemo(
    () =>
      points.map((p) => ({
        value: p.balance,
        label: p.day % 5 === 0 || p.day === 1 ? String(p.day) : '',
      })),
    [points],
  );

  const last = points[points.length - 1]?.balance ?? 0;

  return (
    <GlassCard style={{ marginTop: 20 }}>
      <View style={{ padding: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '700' }}>Evolução do saldo</Text>
          <Text style={{ color: last >= 0 ? colors.income : colors.expense, fontSize: 13, fontWeight: '700' }}>
            {formatCurrencyCompact(last)}
          </Text>
        </View>
        {data.length > 1 ? (
          <LineChart
            data={data}
            width={screenWidth - 88}
            height={140}
            thickness={3}
            color={colors.accent}
            startFillColor={colors.accent}
            endFillColor={colors.bg}
            startOpacity={0.35}
            endOpacity={0.02}
            areaChart
            curved
            hideDataPoints
            hideRules
            hideYAxisText
            xAxisColor="transparent"
            yAxisColor="transparent"
            xAxisLabelTextStyle={{ color: colors.faint, fontSize: 10 }}
            noOfSections={3}
            initialSpacing={4}
            endSpacing={4}
            spacing={Math.max((screenWidth - 100) / Math.max(data.length - 1, 1), 6)}
          />
        ) : (
          <View style={{ height: 140, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.faint }}>Sem dados suficientes ainda</Text>
          </View>
        )}
      </View>
    </GlassCard>
  );
}
