import { useColorScheme } from 'react-native';
import { palette, type ThemeColors } from '@/constants/theme';
import { useSettingsStore } from '@/store/useSettingsStore';

export function useIsDark(): boolean {
  const themeMode = useSettingsStore((s) => s.settings.themeMode);
  const system = useColorScheme();
  if (themeMode === 'system') return system !== 'light';
  return themeMode === 'dark';
}

export function useThemeColors(): ThemeColors {
  const isDark = useIsDark();
  return isDark ? palette.dark : palette.light;
}
