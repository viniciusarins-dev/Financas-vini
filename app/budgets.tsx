import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { CategoryPicker } from '@/features/register/CategoryPicker';
import { BudgetCard } from '@/features/budgets/BudgetCard';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useBudgetsStore } from '@/store/useBudgetsStore';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { computeBudgetProgress } from '@/services/financeCalculations';
import { parseLocaleNumber } from '@/utils/currency';

export default function BudgetsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const budgets = useBudgetsStore((s) => s.budgets);
  const addBudget = useBudgetsStore((s) => s.addBudget);
  const removeBudget = useBudgetsStore((s) => s.removeBudget);
  const transactions = useTransactionsStore((s) => s.transactions);
  const allCategories = useCategoriesStore((s) => s.allCategories);

  const [adding, setAdding] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');

  const now = new Date();
  const progress = useMemo(
    () => computeBudgetProgress(transactions, budgets, now.getFullYear(), now.getMonth()),
    [transactions, budgets],
  );

  const availableCategories = useMemo(
    () => allCategories().filter((c) => c.type === 'expense' && !budgets.some((b) => b.categoryId === c.id)),
    [allCategories, budgets],
  );

  async function handleAdd() {
    const value = parseLocaleNumber(limit);
    if (!categoryId || value <= 0) return;
    await addBudget(categoryId, value);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAdding(false);
    setCategoryId('');
    setLimit('');
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }}>Orçamentos</Text>
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
          {adding && (
            <GlassCard style={{ marginBottom: 18 }}>
              <View style={{ padding: 16, gap: 14 }}>
                <Text style={{ color: colors.faint, fontSize: 12 }}>Categoria</Text>
                <CategoryPicker categories={availableCategories} selectedId={categoryId} onSelect={setCategoryId} />
                <Text style={{ color: colors.faint, fontSize: 12 }}>Limite mensal</Text>
                <TextInput
                  value={limit}
                  onChangeText={setLimit}
                  keyboardType="decimal-pad"
                  placeholder="0,00"
                  placeholderTextColor={colors.faint}
                  style={{ color: colors.ink, fontSize: 18, fontWeight: '700', backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                />
                <GradientButton label="Salvar orçamento" onPress={handleAdd} disabled={!categoryId || parseLocaleNumber(limit) <= 0} />
              </View>
            </GlassCard>
          )}

          {progress.length === 0 ? (
            <View style={{ paddingTop: 60, alignItems: 'center' }}>
              <Text style={{ color: colors.faint }}>Nenhum orçamento definido ainda.</Text>
            </View>
          ) : (
            progress.map((item) => (
              <BudgetCard key={item.budget.id} item={item} onDelete={() => removeBudget(item.budget.id)} />
            ))
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
