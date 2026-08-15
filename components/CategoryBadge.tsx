import React from 'react';
import { View, Text } from 'react-native';
import { DynamicIcon } from './DynamicIcon';
import { useThemeColors } from '@/hooks/useThemeColors';
import type { Category } from '@/types/finance';

interface CategoryBadgeProps {
  category: Category;
  size?: number;
  showLabel?: boolean;
}

export function CategoryBadge({ category, size = 44, showLabel = false }: CategoryBadgeProps) {
  const colors = useThemeColors();
  return (
    <View style={{ alignItems: 'center', gap: 6 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: `${category.color}22`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <DynamicIcon name={category.icon} size={size * 0.48} color={category.color} strokeWidth={2.2} />
      </View>
      {showLabel && (
        <Text style={{ color: colors.ink, fontSize: 12, fontWeight: '500' }} numberOfLines={1}>
          {category.name}
        </Text>
      )}
    </View>
  );
}
