import React from 'react';
import { View, Text, Pressable, Switch } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency } from '@/utils/currency';
import { getCategoryById } from '@/constants/categories';
import type { RecurringRule } from '@/types/finance';

interface RecurringRuleCardProps {
  rule: RecurringRule;
  onToggleActive: (value: boolean) => void;
  onDelete: () => void;
}

export function RecurringRuleCard({ rule, onToggleActive, onDelete }: RecurringRuleCardProps) {
  const colors = useThemeColors();
  const category = getCategoryById(rule.categoryId);
  const tone = rule.type === 'income' ? colors.income : rule.type === 'saving' ? colors.saving : colors.expense;

  return (
    <GlassCard style={{ marginBottom: 14 }}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <CategoryBadge category={category} size={40} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.ink, fontSize: 14.5, fontWeight: '700' }}>{rule.description}</Text>
          <Text style={{ color: colors.muted, fontSize: 12.5, marginTop: 2 }}>
            Todo dia {rule.dayOfMonth} · <Text style={{ color: tone, fontWeight: '700' }}>{formatCurrency(rule.amount)}</Text>
          </Text>
        </View>
        <Switch value={rule.active} onValueChange={onToggleActive} trackColor={{ true: colors.accent }} />
        <Pressable onPress={onDelete} hitSlop={8}>
          <Trash2 size={16} color={colors.faint} />
        </Pressable>
      </View>
    </GlassCard>
  );
}
