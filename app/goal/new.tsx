import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGoalsStore } from '@/store/useGoalsStore';
import { parseLocaleNumber } from '@/utils/currency';
import { categoryPalette } from '@/constants/theme';

const ICONS = ['Target', 'ShieldCheck', 'Smartphone', 'Bike', 'Home', 'Plane', 'GraduationCap', 'Wallet'];

export default function NewGoalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const addGoal = useGoalsStore((s) => s.addGoal);

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(categoryPalette[0]);

  const canSave = title.trim().length > 0 && parseLocaleNumber(target) > 0;

  async function handleCreate() {
    await addGoal({ title: title.trim(), icon, color, targetAmount: parseLocaleNumber(target), deadline: null });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }}>Nova meta</Text>
          <Pressable
            onPress={() => router.back()}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} color={colors.muted} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <GlassCard>
            <View style={{ padding: 18, gap: 16 }}>
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 20,
                    backgroundColor: `${color}22`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <DynamicIcon name={icon} size={30} color={color} />
                </View>
              </View>

              <View>
                <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Nome da meta</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Ex: Comprar uma moto"
                  placeholderTextColor={colors.faint}
                  style={{ color: colors.ink, fontSize: 16, backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                />
              </View>

              <View>
                <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Valor alvo</Text>
                <TextInput
                  value={target}
                  onChangeText={setTarget}
                  keyboardType="decimal-pad"
                  placeholder="0,00"
                  placeholderTextColor={colors.faint}
                  style={{ color: colors.ink, fontSize: 22, fontWeight: '700', backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                />
              </View>

              <View>
                <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 8 }}>Ícone</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {ICONS.map((iconName) => {
                    const active = iconName === icon;
                    return (
                      <Pressable
                        key={iconName}
                        onPress={() => setIcon(iconName)}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: active ? `${color}26` : colors.raised,
                          borderWidth: active ? 1 : 0,
                          borderColor: color,
                        }}
                      >
                        <DynamicIcon name={iconName} size={19} color={active ? color : colors.muted} />
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View>
                <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 8 }}>Cor</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {categoryPalette.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setColor(c)}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: c,
                        borderWidth: c === color ? 3 : 0,
                        borderColor: colors.ink,
                      }}
                    />
                  ))}
                </View>
              </View>
            </View>
          </GlassCard>

          <View style={{ marginTop: 20 }}>
            <GradientButton label="Criar meta" onPress={handleCreate} disabled={!canSave} size="lg" />
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
