import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, ArrowLeftRight, PieChart, Target, Bot } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useIsDark, useThemeColors } from '@/hooks/useThemeColors';
import { FloatingActionButton } from './FloatingActionButton';

const TAB_ICONS: Record<string, typeof Home> = {
  index: Home,
  transactions: ArrowLeftRight,
  summary: PieChart,
  goals: Target,
  ai: Bot,
};

const TAB_LABELS: Record<string, string> = {
  index: 'Início',
  transactions: 'Transações',
  summary: 'Resumo',
  goals: 'Metas',
  ai: 'IA',
};

function TabButton({ routeName, isFocused, onPress }: { routeName: string; isFocused: boolean; onPress: () => void }) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const Icon = TAB_ICONS[routeName] ?? Home;

  return (
    <Animated.View style={[style, { flex: 1, alignItems: 'center' }]}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(0.88, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 140 });
        }}
        onPress={onPress}
        style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 6, gap: 4, width: '100%' }}
      >
        <View
          style={{
            width: 40,
            height: 30,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isFocused ? `${colors.accent}26` : 'transparent',
          }}
        >
          <Icon size={20} color={isFocused ? colors.accent : colors.faint} strokeWidth={2.3} />
        </View>
        <Text
          style={{
            fontSize: 10.5,
            fontWeight: isFocused ? '700' : '500',
            color: isFocused ? colors.accent : colors.faint,
          }}
        >
          {TAB_LABELS[routeName] ?? routeName}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const isDark = useIsDark();
  const colors = useThemeColors();
  const router = useRouter();

  const leftRoutes = state.routes.slice(0, 2);
  const rightRoutes = state.routes.slice(2);

  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} pointerEvents="box-none">
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: insets.bottom + 8,
          borderRadius: 28,
          overflow: 'hidden',
        }}
      >
        <BlurView intensity={46} tint={isDark ? 'dark' : 'light'} style={{ position: 'absolute', inset: 0 }} />
        <View
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: colors.glassFill,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            borderRadius: 28,
          }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 66, paddingHorizontal: 8 }}>
          {leftRoutes.map((route, index) => (
            <TabButton
              key={route.key}
              routeName={route.name}
              isFocused={state.index === index}
              onPress={() => {
                Haptics.selectionAsync();
                navigation.navigate(route.name);
              }}
            />
          ))}
          <View style={{ width: 64 }} />
          {rightRoutes.map((route, i) => {
            const index = i + 2;
            return (
              <TabButton
                key={route.key}
                routeName={route.name}
                isFocused={state.index === index}
                onPress={() => {
                  Haptics.selectionAsync();
                  navigation.navigate(route.name);
                }}
              />
            );
          })}
        </View>
      </View>
      <View style={{ position: 'absolute', alignSelf: 'center', bottom: insets.bottom + 8 + 33 - 32 }}>
        <FloatingActionButton onPress={() => router.push('/register')} />
      </View>
    </View>
  );
}
