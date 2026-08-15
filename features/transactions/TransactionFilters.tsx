import React from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { Search } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { TransactionType } from '@/types/finance';

export type TypeFilter = 'all' | TransactionType;

const FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Entradas' },
  { value: 'expense', label: 'Despesas' },
  { value: 'saving', label: 'Guardado' },
];

interface TransactionFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: TypeFilter;
  onTypeFilterChange: (value: TypeFilter) => void;
}

export function TransactionFilters({ search, onSearchChange, typeFilter, onTypeFilterChange }: TransactionFiltersProps) {
  const colors = useThemeColors();

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          backgroundColor: colors.raised,
          borderRadius: 16,
          paddingHorizontal: 14,
          height: 46,
        }}
      >
        <Search size={16} color={colors.faint} />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Pesquisar transações"
          placeholderTextColor={colors.faint}
          style={{ flex: 1, color: colors.ink, fontSize: 14 }}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {FILTERS.map((f) => {
          const active = f.value === typeFilter;
          return (
            <Pressable
              key={f.value}
              onPress={() => onTypeFilterChange(f.value)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 14,
                backgroundColor: active ? `${colors.accent}26` : colors.raised,
                borderWidth: 1,
                borderColor: active ? colors.accent : 'transparent',
              }}
            >
              <Text style={{ color: active ? colors.accent : colors.muted, fontWeight: '700', fontSize: 12.5 }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
