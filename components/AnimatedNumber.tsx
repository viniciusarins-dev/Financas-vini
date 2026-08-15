import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter';
import { formatCurrency } from '@/utils/currency';

interface AnimatedNumberProps {
  value: number;
  style?: StyleProp<TextStyle>;
  formatter?: (n: number) => string;
  duration?: number;
}

export function AnimatedNumber({ value, style, formatter = formatCurrency, duration }: AnimatedNumberProps) {
  const display = useAnimatedCounter(value, duration);
  return <Text style={style}>{formatter(display)}</Text>;
}
