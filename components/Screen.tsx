import React from 'react';
import { View, ScrollView, type ScrollViewProps, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors, useIsDark } from '@/hooks/useThemeColors';

interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
}

export function Screen({ children, scroll = true, padded = true, contentContainerStyle, ...rest }: ScreenProps) {
  const colors = useThemeColors();
  const isDark = useIsDark();
  const insets = useSafeAreaInsets();

  const content = (
    <View style={{ paddingHorizontal: padded ? 20 : 0, paddingTop: 8, paddingBottom: 140 }}>{children}</View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={{ height: insets.top, backgroundColor: colors.bg }} />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={contentContainerStyle}
          {...rest}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}
