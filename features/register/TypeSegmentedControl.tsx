import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { TransactionType } from '@/types/finance';
import { useThemeColors } from '@/hooks/useThemeColors';

const OPTIONS: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Despesa' },
  { value: 'income', label: 'Entrada' },
  { value: 'saving', label: 'Guardado' },
];

interface TypeSegmentedControlProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}

export function TypeSegmentedControl({ value, onChange }: TypeSegmentedControlProps) {
  const colors = useThemeColors();
  const toneColor = value === 'income' ? colors.income : value === 'saving' ? colors.saving : colors.expense;

  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.raised, borderRadius: 14, padding: 4, gap: 4 }}>
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: active ? `${toneColor}26` : 'transparent',
            }}
          >
            <Text style={{ color: active ? toneColor : colors.muted, fontWeight: '700', fontSize: 13 }}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
