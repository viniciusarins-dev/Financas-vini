import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from '@/components/GlassCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency, formatPercentage } from '@/utils/currency';
import type { CategoryBreakdownItem } from '@/types/finance';

interface TopCategoriesCardProps {
  items: CategoryBreakdownItem[];
}

export function TopCategoriesCard({ items }: TopCategoriesCardProps) {
  const colors = useThemeColors();
  const top = items.slice(0, 5);

  return (
    <GlassCard style={{ marginTop: 16 }}>
      <View style={{ padding: 18 }}>
        <Text style={{ color: colors.ink, fontSize: 16, fontWeight: '700', marginBottom: 16 }}>
          Seus maiores gastos
        </Text>
        {top.length === 0 && (
          <Text style={{ color: colors.faint, fontSize: 13 }}>Nenhuma despesa registrada este mês ainda.</Text>
        )}
        <View style={{ gap: 16 }}>
          {top.map((item) => (
            <View key={item.categoryId} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <CategoryBadge category={item.category} size={38} />
              <View style={{ flex: 1, gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.ink, fontSize: 14, fontWeight: '600' }}>{item.category.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '600' }}>
                    {formatCurrency(item.total)} · {formatPercentage(item.percentage)}
                  </Text>
                </View>
                <ProgressBar progress={item.percentage} color={item.category.color} height={6} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </GlassCard>
  );
}
