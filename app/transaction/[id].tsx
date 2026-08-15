import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { CategoryPicker } from '@/features/register/CategoryPicker';
import { TypeSegmentedControl } from '@/features/register/TypeSegmentedControl';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { parseLocaleNumber } from '@/utils/currency';
import type { TransactionType } from '@/types/finance';

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const transactions = useTransactionsStore((s) => s.transactions);
  const updateTransaction = useTransactionsStore((s) => s.updateTransaction);
  const removeTransaction = useTransactionsStore((s) => s.removeTransaction);
  const allCategories = useCategoriesStore((s) => s.allCategories);

  const original = useMemo(() => transactions.find((t) => t.id === id), [transactions, id]);

  const [type, setType] = useState<TransactionType>(original?.type ?? 'expense');
  const [amount, setAmount] = useState(String(original?.amount ?? 0));
  const [description, setDescription] = useState(original?.description ?? '');
  const [categoryId, setCategoryId] = useState(original?.categoryId ?? '');

  if (!original) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.faint }}>Transação não encontrada.</Text>
      </View>
    );
  }

  const categoriesForType = allCategories().filter((c) => c.type === type || c.type === 'any');

  async function handleSave() {
    await updateTransaction(original!.id, {
      type,
      amount: parseLocaleNumber(amount),
      description,
      categoryId,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  function handleDelete() {
    Alert.alert('Excluir transação', 'Tem certeza que deseja excluir essa movimentação?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await removeTransaction(original!.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }}>Editar movimentação</Text>
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
              <TypeSegmentedControl value={type} onChange={setType} />

              <View>
                <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Valor</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  style={{ color: colors.ink, fontSize: 22, fontWeight: '700', backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                />
              </View>

              <View>
                <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Descrição</Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  style={{ color: colors.ink, fontSize: 15, backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                />
              </View>

              <View>
                <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Categoria</Text>
                <CategoryPicker categories={categoriesForType} selectedId={categoryId} onSelect={setCategoryId} />
              </View>
            </View>
          </GlassCard>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
            <Pressable
              onPress={handleDelete}
              style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: `${colors.expense}1A`, alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={18} color={colors.expense} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <GradientButton label="Salvar alterações" onPress={handleSave} size="lg" />
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
