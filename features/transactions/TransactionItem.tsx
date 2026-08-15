import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CategoryBadge } from '@/components/CategoryBadge';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatCurrency } from '@/utils/currency';
import { formatShortDate } from '@/utils/date';
import { getCategoryById } from '@/constants/categories';
import type { Transaction } from '@/types/finance';

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const router = useRouter();
  const colors = useThemeColors();
  const category = getCategoryById(transaction.categoryId);
  const tone = transaction.type === 'income' ? colors.income : transaction.type === 'saving' ? colors.saving : colors.expense;
  const sign = transaction.type === 'expense' ? '-' : '+';

  return (
    <Pressable
      onPress={() => router.push(`/transaction/${transaction.id}`)}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <CategoryBadge category={category} size={42} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.ink, fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={{ color: colors.faint, fontSize: 12.5, marginTop: 2 }}>
          {category.name} · {formatShortDate(transaction.date)}
        </Text>
      </View>
      <Text style={{ color: tone, fontSize: 15, fontWeight: '700' }}>
        {sign}
        {formatCurrency(transaction.amount)}
      </Text>
    </Pressable>
  );
}
