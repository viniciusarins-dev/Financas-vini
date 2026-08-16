import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { CategoryPicker } from '@/features/register/CategoryPicker';
import { TypeSegmentedControl } from '@/features/register/TypeSegmentedControl';
import { RecurringRuleCard } from '@/features/recurring/RecurringRuleCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRecurringStore } from '@/store/useRecurringStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { parseLocaleNumber } from '@/utils/currency';
import type { TransactionType } from '@/types/finance';

export default function RecurringScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const rules = useRecurringStore((s) => s.rules);
  const addRule = useRecurringStore((s) => s.addRule);
  const updateRule = useRecurringStore((s) => s.updateRule);
  const removeRule = useRecurringStore((s) => s.removeRule);
  const allCategories = useCategoriesStore((s) => s.allCategories);

  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<TransactionType>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dayOfMonth, setDayOfMonth] = useState('5');

  const categoriesForType = allCategories().filter((c) => c.type === type || c.type === 'any');
  const day = Math.min(Math.max(parseInt(dayOfMonth, 10) || 1, 1), 28);
  const canSave = description.trim().length > 0 && parseLocaleNumber(amount) > 0 && categoryId;

  async function handleAdd() {
    if (!canSave) return;
    await addRule({
      type,
      amount: parseLocaleNumber(amount),
      categoryId,
      description: description.trim(),
      paymentMethod: null,
      dayOfMonth: day,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAdding(false);
    setDescription('');
    setAmount('');
    setCategoryId('');
    setDayOfMonth('5');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }}>Recorrentes</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => setAdding((v) => !v)}
              style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={16} color={colors.accent} />
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
          <Text style={{ color: colors.faint, fontSize: 13, marginBottom: 18, lineHeight: 19 }}>
            Cadastre salário, assinaturas ou outras contas fixas — o Fluxo registra automaticamente a movimentação todo mês, a partir do dia escolhido.
          </Text>

          {adding && (
            <GlassCard style={{ marginBottom: 18 }}>
              <View style={{ padding: 16, gap: 14 }}>
                <TypeSegmentedControl value={type} onChange={(t) => { setType(t); setCategoryId(''); }} />
                <View>
                  <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Descrição</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Ex: Netflix, Salário, Aluguel"
                    placeholderTextColor={colors.faint}
                    style={{ color: colors.ink, fontSize: 15, backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                  />
                </View>
                <View>
                  <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Valor</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder="0,00"
                    placeholderTextColor={colors.faint}
                    style={{ color: colors.ink, fontSize: 18, fontWeight: '700', backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                  />
                </View>
                <View>
                  <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Todo dia (1-28)</Text>
                  <TextInput
                    value={dayOfMonth}
                    onChangeText={setDayOfMonth}
                    keyboardType="number-pad"
                    maxLength={2}
                    style={{ color: colors.ink, fontSize: 15, backgroundColor: colors.raised, borderRadius: 12, padding: 12, width: 80 }}
                  />
                </View>
                <View>
                  <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Categoria</Text>
                  <CategoryPicker categories={categoriesForType} selectedId={categoryId} onSelect={setCategoryId} />
                </View>
                <GradientButton label="Salvar recorrência" onPress={handleAdd} disabled={!canSave} />
              </View>
            </GlassCard>
          )}

          {rules.length === 0 ? (
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text style={{ color: colors.faint }}>Nenhuma recorrência cadastrada.</Text>
            </View>
          ) : (
            rules.map((rule) => (
              <RecurringRuleCard
                key={rule.id}
                rule={rule}
                onToggleActive={(active) => updateRule(rule.id, { active })}
                onDelete={() => removeRule(rule.id)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
