import React from 'react';
import { ScrollView, Pressable, View, Text } from 'react-native';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Category } from '@/types/finance';

interface CategoryPickerProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function CategoryPicker({ categories, selectedId, onSelect }: CategoryPickerProps) {
  const colors = useThemeColors();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
      {categories.map((cat) => {
        const active = cat.id === selectedId;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(cat.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 9,
              borderRadius: 16,
              backgroundColor: active ? `${cat.color}26` : colors.raised,
              borderWidth: 1,
              borderColor: active ? cat.color : colors.border,
            }}
          >
            <DynamicIcon name={cat.icon} size={14} color={active ? cat.color : colors.muted} />
            <Text style={{ color: active ? cat.color : colors.muted, fontWeight: '600', fontSize: 12.5 }}>
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
