import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { formatMonthLabel } from '@/utils/date';

interface MonthPickerProps {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}

export function MonthPicker({ year, month, onChange }: MonthPickerProps) {
  const colors = useThemeColors();
  const label = formatMonthLabel(year, month);

  function shift(delta: number) {
    const date = new Date(year, month + delta, 1);
    onChange(date.getFullYear(), date.getMonth());
  }

  const isCurrentMonth = (() => {
    const now = new Date();
    return now.getFullYear() === year && now.getMonth() === month;
  })();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.raised,
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 10,
      }}
    >
      <Pressable onPress={() => shift(-1)} style={{ padding: 8 }}>
        <ChevronLeft size={18} color={colors.muted} />
      </Pressable>
      <Text style={{ color: colors.ink, fontSize: 15, fontWeight: '700', textTransform: 'capitalize' }}>{label}</Text>
      <Pressable onPress={() => shift(1)} disabled={isCurrentMonth} style={{ padding: 8, opacity: isCurrentMonth ? 0.3 : 1 }}>
        <ChevronRight size={18} color={colors.muted} />
      </Pressable>
    </View>
  );
}
