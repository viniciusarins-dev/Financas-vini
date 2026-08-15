import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { GlassCard } from '@/components/GlassCard';
import { TransactionFilters, type TypeFilter } from '@/features/transactions/TransactionFilters';
import { TransactionItem } from '@/features/transactions/TransactionItem';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { formatShortDate } from '@/utils/date';
import { getCategoryById } from '@/constants/categories';

export default function TransactionsScreen() {
  const colors = useThemeColors();
  const transactions = useTransactionsStore((s) => s.transactions);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const filtered = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();
    return transactions.filter((t) => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (!lowerSearch) return true;
      const category = getCategoryById(t.categoryId);
      return (
        t.description.toLowerCase().includes(lowerSearch) || category.name.toLowerCase().includes(lowerSearch)
      );
    });
  }, [transactions, search, typeFilter]);

  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const t of filtered) {
      const key = formatShortDate(t.date);
      const list = map.get(key) ?? [];
      list.push(t);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <Screen scroll={false} padded={false}>
      <View style={{ paddingHorizontal: 20 }}>
        <ScreenHeader title="Transações" />
        <TransactionFilters search={search} onSearchChange={setSearch} typeFilter={typeFilter} onTypeFilterChange={setTypeFilter} />
      </View>

      <Animated.FlatList
        data={groups}
        keyExtractor={([label]) => label}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: [label, items], index }) => (
          <Animated.View entering={FadeInDown.duration(400).delay(Math.min(index, 6) * 40)} style={{ marginBottom: 18 }}>
            <Text style={{ color: colors.faint, fontSize: 12.5, fontWeight: '700', marginBottom: 8, letterSpacing: 0.4 }}>
              {label.toUpperCase()}
            </Text>
            <GlassCard>
              <View style={{ paddingHorizontal: 14 }}>
                {items.map((t, i) => (
                  <View key={t.id} style={{ borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border }}>
                    <TransactionItem transaction={t} />
                  </View>
                ))}
              </View>
            </GlassCard>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={{ paddingTop: 80, alignItems: 'center' }}>
            <Text style={{ color: colors.faint }}>Nenhuma transação encontrada.</Text>
          </View>
        }
      />
    </Screen>
  );
}
