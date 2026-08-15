import React from 'react';
import { View, Text, Pressable, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Moon, Sun, Smartphone, Bell, Wallet } from 'lucide-react-native';
import { GlassCard } from '@/components/GlassCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useSettingsStore } from '@/store/useSettingsStore';
import {
  requestNotificationPermission,
  scheduleDailyReminder,
  cancelDailyReminder,
} from '@/services/notifications/localNotifications';
import type { AppSettings } from '@/types/finance';

const THEME_OPTIONS: { value: AppSettings['themeMode']; label: string; Icon: typeof Moon }[] = [
  { value: 'dark', label: 'Escuro', Icon: Moon },
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'system', label: 'Sistema', Icon: Smartphone },
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  async function handleToggleNotifications(value: boolean) {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    } else {
      await cancelDailyReminder();
    }
    await update({ notificationsEnabled: value, dailyReminderEnabled: value ? settings.dailyReminderEnabled : false });
  }

  async function handleToggleDailyReminder(value: boolean) {
    if (value) {
      await scheduleDailyReminder(20, 0);
    } else {
      await cancelDailyReminder();
    }
    await update({ dailyReminderEnabled: value });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }}>Configurações</Text>
          <Pressable
            onPress={() => router.back()}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} color={colors.muted} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text style={{ color: colors.faint, fontSize: 12, fontWeight: '700', marginBottom: 10 }}>APARÊNCIA</Text>
        <GlassCard style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', padding: 8, gap: 8 }}>
            {THEME_OPTIONS.map(({ value, label, Icon }) => {
              const active = settings.themeMode === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => update({ themeMode: value })}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    gap: 6,
                    paddingVertical: 14,
                    borderRadius: 14,
                    backgroundColor: active ? `${colors.accent}22` : 'transparent',
                  }}
                >
                  <Icon size={18} color={active ? colors.accent : colors.muted} />
                  <Text style={{ color: active ? colors.accent : colors.muted, fontSize: 12, fontWeight: '700' }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        <Text style={{ color: colors.faint, fontSize: 12, fontWeight: '700', marginBottom: 10 }}>NOTIFICAÇÕES</Text>
        <GlassCard style={{ marginBottom: 24 }}>
          <View style={{ padding: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 }}>
              <Bell size={18} color={colors.muted} />
              <Text style={{ flex: 1, color: colors.ink, fontSize: 14.5, fontWeight: '600' }}>Ativar notificações</Text>
              <Switch value={settings.notificationsEnabled} onValueChange={handleToggleNotifications} trackColor={{ true: colors.accent }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 }}>
              <Bell size={18} color={colors.muted} />
              <Text style={{ flex: 1, color: colors.ink, fontSize: 14.5, fontWeight: '600' }}>Lembrete diário às 20h</Text>
              <Switch
                value={settings.dailyReminderEnabled}
                onValueChange={handleToggleDailyReminder}
                disabled={!settings.notificationsEnabled}
                trackColor={{ true: colors.accent }}
              />
            </View>
          </View>
        </GlassCard>

        <Text style={{ color: colors.faint, fontSize: 12, fontWeight: '700', marginBottom: 10 }}>FINANÇAS</Text>
        <GlassCard>
          <Pressable
            onPress={() => router.push('/budgets')}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}
          >
            <Wallet size={18} color={colors.muted} />
            <Text style={{ flex: 1, color: colors.ink, fontSize: 14.5, fontWeight: '600' }}>Orçamentos</Text>
          </Pressable>
        </GlassCard>
      </ScrollView>
    </View>
  );
}
