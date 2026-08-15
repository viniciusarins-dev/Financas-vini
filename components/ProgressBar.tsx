import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useThemeColors } from '@/hooks/useThemeColors';

interface ProgressBarProps {
  progress: number; // 0-100+
  color?: string;
  height?: number;
  trackColor?: string;
}

export function ProgressBar({ progress, color, height = 8, trackColor }: ProgressBarProps) {
  const colors = useThemeColors();
  const width = useSharedValue(0);
  const clamped = Math.max(0, Math.min(progress, 100));

  useEffect(() => {
    width.value = withTiming(clamped, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [clamped, width]);

  const style = useAnimatedStyle(() => ({ width: `${width.value}%` }));

  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: trackColor ?? colors.border,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        style={[
          style,
          {
            height: '100%',
            borderRadius: height / 2,
            backgroundColor: color ?? colors.accent,
          },
        ]}
      />
    </View>
  );
}
