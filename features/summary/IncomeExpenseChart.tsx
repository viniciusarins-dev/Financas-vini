import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { GlassCard } from '@/components/GlassCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency } from '@/utils/currency';

interface IncomeExpenseChartProps {
  income: number;
  expense: number;
  saving: number;
}

export function IncomeExpenseChart({ income, expense, saving }: IncomeExpenseChartProps) {
  const colors = useThemeColors();
  const maxValue = Math.max(income, expense, saving, 1);

  const data = [
    { value: income, label: 'Entrou', frontColor: colors.income },
    { value: expense, label: 'Saiu', frontColor: colors.expense },
    { value: saving, label: 'Guardado', frontColor: colors.saving },
  ];

  return (
    <GlassCard style={{ marginTop: 16 }}>
      <View style={{ padding: 18 }}>
        <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '700', marginBottom: 16 }}>Entradas x Despesas</Text>
        <BarChart
          data={data}
          barWidth={44}
          spacing={28}
          roundedTop
          barBorderRadius={8}
          hideRules
          hideYAxisText
          xAxisColor="transparent"
          yAxisColor="transparent"
          xAxisLabelTextStyle={{ color: colors.faint, fontSize: 11, fontWeight: '600' }}
          noOfSections={4}
          maxValue={maxValue * 1.2}
          height={140}
          renderTooltip={() => null}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
          {data.map((d) => (
            <Text key={d.label} style={{ color: d.frontColor, fontSize: 12.5, fontWeight: '700' }}>
              {formatCurrency(d.value)}
            </Text>
          ))}
        </View>
      </View>
    </GlassCard>
  );
}
