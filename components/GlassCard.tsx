import React from 'react';
import { View, StyleSheet, type ViewProps, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useIsDark, useThemeColors } from '@/hooks/useThemeColors';

interface GlassCardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  radius?: number;
  bordered?: boolean;
}

export function GlassCard({ children, style, intensity = 32, radius = 24, bordered = true, ...rest }: GlassCardProps) {
  const isDark = useIsDark();
  const colors = useThemeColors();

  return (
    <View style={[{ borderRadius: radius, overflow: 'hidden' }, style]} {...rest}>
      <BlurView intensity={intensity} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: colors.glassFill,
            borderRadius: radius,
            borderWidth: bordered ? 1 : 0,
            borderColor: colors.glassBorder,
          },
        ]}
      />
      <View style={{ borderRadius: radius }}>{children}</View>
    </View>
  );
}
