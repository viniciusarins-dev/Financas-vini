import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { ProgressBar } from '@/components/ProgressBar';
import { DynamicIcon } from '@/components/DynamicIcon';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useGoalsStore } from '@/store/useGoalsStore';
import { formatCurrency, parseLocaleNumber } from '@/utils/currency';
import { formatShortDate } from '@/utils/date';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const goals = useGoalsStore((s) => s.goals);
  const contributions = useGoalsStore((s) => s.contributions);
  const addFunds = useGoalsStore((s) => s.addFunds);
  const removeGoal = useGoalsStore((s) => s.removeGoal);

  const [amount, setAmount] = useState('');

  const goal = useMemo(() => goals.find((g) => g.id === id), [goals, id]);
  const goalContributions = useMemo(() => contributions.filter((c) => c.goalId === id), [contributions, id]);

  if (!goal) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.faint }}>Meta não encontrada.</Text>
      </View>
    );
  }

  const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;

  async function handleAddFunds() {
    const value = parseLocaleNumber(amount);
    if (value <= 0) return;
    await addFunds(goal!.id, value);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAmount('');
  }

  function handleDelete() {
    Alert.alert('Excluir meta', `Deseja excluir a meta "${goal!.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await removeGoal(goal!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }} numberOfLines={1}>
            {goal.title}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={handleDelete}
              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: `${colors.expense}1A`, alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={15} color={colors.expense} />
            </Pressable>
            <Pressable
              onPress={() => router.back()}
              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <GlassCard>
            <View style={{ padding: 22, alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 22,
                  backgroundColor: `${goal.color}22`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DynamicIcon name={goal.icon} size={32} color={goal.color} />
              </View>
              <Text style={{ color: colors.ink, fontSize: 26, fontWeight: '800' }}>{formatCurrency(goal.currentAmount)}</Text>
              <Text style={{ color: colors.muted, fontSize: 13.5 }}>de {formatCurrency(goal.targetAmount)}</Text>
              <View style={{ width: '100%', marginTop: 4 }}>
                <ProgressBar progress={percentage} color={goal.color} height={10} />
              </View>
              <Text style={{ color: goal.color, fontSize: 14, fontWeight: '700' }}>{Math.round(percentage)}% concluído</Text>
            </View>
          </GlassCard>

          <View style={{ marginTop: 18 }}>
            <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 8 }}>Adicionar dinheiro à meta</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0,00"
                placeholderTextColor={colors.faint}
                style={{ flex: 1, color: colors.ink, fontSize: 18, fontWeight: '700', backgroundColor: colors.raised, borderRadius: 14, padding: 14 }}
              />
              <GradientButton label="Adicionar" onPress={handleAddFunds} disabled={parseLocaleNumber(amount) <= 0} />
            </View>
          </View>

          {goalContributions.length > 0 && (
            <View style={{ marginTop: 24 }}>
              <Text style={{ color: colors.faint, fontSize: 12, fontWeight: '700', marginBottom: 10 }}>HISTÓRICO</Text>
              <GlassCard>
                <View style={{ paddingHorizontal: 16 }}>
                  {goalContributions.map((c, i) => (
                    <View
                      key={c.id}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 12,
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <Text style={{ color: colors.muted, fontSize: 13 }}>{formatShortDate(c.date)}</Text>
                      <Text style={{ color: colors.income, fontSize: 13.5, fontWeight: '700' }}>+{formatCurrency(c.amount)}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
