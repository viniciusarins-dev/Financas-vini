import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency } from '@/utils/currency';
import type { BudgetProgress } from '@/services/financeCalculations';

interface BudgetCardProps {
  item: BudgetProgress;
  onDelete: () => void;
}

export function BudgetCard({ item, onDelete }: BudgetCardProps) {
  const colors = useThemeColors();
  const barColor = item.isOverLimit ? colors.expense : item.isNearLimit ? colors.warning : item.category.color;

  let statusText: string | null = null;
  if (item.isOverLimit) {
    statusText = `Você ultrapassou seu orçamento de ${item.category.name.toLowerCase()} em ${formatCurrency(Math.abs(item.remaining))}.`;
  } else if (item.isNearLimit) {
    statusText = `Você já utilizou ${Math.round(item.percentage)}% do seu orçamento de ${item.category.name.toLowerCase()}.`;
  }

  return (
    <GlassCard style={{ marginBottom: 14 }}>
      <View style={{ padding: 16, gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <CategoryBadge category={item.category} size={40} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.ink, fontSize: 15, fontWeight: '700' }}>{item.category.name}</Text>
            <Text style={{ color: colors.muted, fontSize: 12.5, marginTop: 2 }}>
              {formatCurrency(item.spent)} de {formatCurrency(item.budget.monthlyLimit)}
            </Text>
          </View>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Trash2 size={16} color={colors.faint} />
          </Pressable>
        </View>
        <ProgressBar progress={item.percentage} color={barColor} height={7} />
        {statusText && (
          <Text style={{ color: item.isOverLimit ? colors.expense : colors.warning, fontSize: 12.5, fontWeight: '600' }}>
            {statusText}
          </Text>
        )}
      </View>
    </GlassCard>
  );
}
