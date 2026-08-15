import React from 'react';
import { Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Plus } from 'lucide-react-native';
import { gradients } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingActionButton({ onPress, size = 64, style }: FloatingActionButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      accessibilityLabel="Registrar movimentação"
      onPressIn={() => {
        scale.value = withTiming(0.9, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withSequence(withTiming(1.06, { duration: 120 }), withTiming(1, { duration: 120 }));
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      style={[animatedStyle, style]}
    >
      <LinearGradient
        colors={gradients.accent}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#7C5CFF',
          shadowOpacity: 0.55,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        }}
      >
        <Plus color="#FFFFFF" size={size * 0.42} strokeWidth={2.6} />
      </LinearGradient>
    </AnimatedPressable>
  );
}
