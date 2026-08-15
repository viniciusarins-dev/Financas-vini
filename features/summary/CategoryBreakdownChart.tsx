import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { GlassCard } from '@/components/GlassCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency, formatPercentage } from '@/utils/currency';
import type { CategoryBreakdownItem } from '@/types/finance';

interface CategoryBreakdownChartProps {
  items: CategoryBreakdownItem[];
  total: number;
}

export function CategoryBreakdownChart({ items, total }: CategoryBreakdownChartProps) {
  const colors = useThemeColors();
  const pieData = items.slice(0, 6).map((item) => ({ value: item.total, color: item.category.color }));

  return (
    <GlassCard style={{ marginTop: 16 }}>
      <View style={{ padding: 18 }}>
        <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '700', marginBottom: 16 }}>
          Despesas por categoria
        </Text>
        {items.length === 0 ? (
          <Text style={{ color: colors.faint, fontSize: 13 }}>Nenhuma despesa neste período.</Text>
        ) : (
          <>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <PieChart
                data={pieData}
                donut
                radius={72}
                innerRadius={50}
                innerCircleColor={colors.surface}
                centerLabelComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: colors.faint, fontSize: 11 }}>Total</Text>
                    <Text style={{ color: colors.ink, fontSize: 15, fontWeight: '800' }}>{formatCurrency(total)}</Text>
                  </View>
                )}
              />
            </View>
            <View style={{ gap: 14 }}>
              {items.slice(0, 6).map((item) => (
                <View key={item.categoryId} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <CategoryBadge category={item.category} size={32} />
                  <Text style={{ flex: 1, color: colors.ink, fontSize: 13.5, fontWeight: '600' }}>{item.category.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '600' }}>
                    {formatPercentage(item.percentage)} · {formatCurrency(item.total)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </GlassCard>
  );
}
