import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  const colors = useThemeColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <View>
        {subtitle && <Text style={{ color: colors.muted, fontSize: 14, marginBottom: 2 }}>{subtitle}</Text>}
        <Text style={{ color: colors.ink, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>{title}</Text>
      </View>
      {right}
    </View>
  );
}
