import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { X, Pencil, Check, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { GlassCard } from '@/components/GlassCard';
import { GradientButton } from '@/components/GradientButton';
import { CategoryBadge } from '@/components/CategoryBadge';
import { CategoryPicker } from '@/features/register/CategoryPicker';
import { TypeSegmentedControl } from '@/features/register/TypeSegmentedControl';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { parseTransactionText } from '@/services/nlp/parseTransactionText';
import { getCategoryById } from '@/constants/categories';
import { formatCurrency, parseLocaleNumber } from '@/utils/currency';
import type { ParsedTransactionDraft } from '@/types/ai';
import type { PaymentMethod } from '@/types/finance';

const EXAMPLES = ['Gastei 45 no almoço', 'Recebi 2300 de salário', 'Guardei 500 reais', 'Gastei 120 de gasolina'];

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  pix: 'Pix',
  cash: 'Dinheiro',
  credit_card: 'Crédito',
  debit_card: 'Débito',
  transfer: 'Transferência',
  other: 'Outro',
};

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const addTransaction = useTransactionsStore((s) => s.addTransaction);
  const allCategories = useCategoriesStore((s) => s.allCategories);

  const [text, setText] = useState('');
  const [draft, setDraft] = useState<ParsedTransactionDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleInterpret() {
    const result = parseTransactionText(text);
    if (!result.ok) {
      setError(result.reason);
      setDraft(null);
      return;
    }
    setError(null);
    setDraft(result.draft);
    setEditing(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function handleConfirm() {
    if (!draft) return;
    await addTransaction({
      type: draft.type,
      amount: draft.amount,
      categoryId: draft.categoryId,
      description: draft.description,
      date: draft.date,
      paymentMethod: draft.paymentMethod,
      notes: draft.notes,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaved(true);
    setTimeout(() => router.back(), 650);
  }

  const category = draft ? getCategoryById(draft.categoryId) : null;
  const categoriesForType = draft ? allCategories().filter((c) => c.type === draft.type || c.type === 'any') : [];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ color: colors.ink, fontSize: 20, fontWeight: '800' }}>Registrar</Text>
          <Pressable
            onPress={() => router.back()}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.raised, alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={16} color={colors.muted} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {saved ? (
            <Animated.View entering={FadeIn} style={{ alignItems: 'center', paddingTop: 80, gap: 16 }}>
              <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: `${colors.income}22`, alignItems: 'center', justifyContent: 'center' }}>
                <Check size={40} color={colors.income} strokeWidth={2.6} />
              </View>
              <Text style={{ color: colors.ink, fontSize: 17, fontWeight: '700' }}>Registrado com sucesso!</Text>
            </Animated.View>
          ) : (
            <>
              <GlassCard>
                <TextInput
                  value={text}
                  onChangeText={(v) => {
                    setText(v);
                    setDraft(null);
                    setError(null);
                  }}
                  placeholder="O que aconteceu com seu dinheiro?"
                  placeholderTextColor={colors.faint}
                  multiline
                  style={{ minHeight: 90, padding: 18, fontSize: 17, color: colors.ink, textAlignVertical: 'top' }}
                  autoFocus
                />
              </GlassCard>

              {error && (
                <Text style={{ color: colors.expense, marginTop: 10, fontSize: 13, fontWeight: '600' }}>{error}</Text>
              )}

              {!draft && (
                <>
                  <Pressable
                    onPress={handleInterpret}
                    disabled={!text.trim()}
                    style={{ marginTop: 16, opacity: text.trim() ? 1 : 0.5 }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: colors.raised,
                        borderRadius: 16,
                        paddingVertical: 14,
                      }}
                    >
                      <Sparkles size={16} color={colors.accent} />
                      <Text style={{ color: colors.ink, fontWeight: '700', fontSize: 15 }}>Entender mensagem</Text>
                    </View>
                  </Pressable>

                  <Text style={{ color: colors.faint, fontSize: 12.5, fontWeight: '600', marginTop: 24, marginBottom: 10 }}>
                    EXEMPLOS
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {EXAMPLES.map((ex) => (
                      <Pressable
                        key={ex}
                        onPress={() => setText(ex)}
                        style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, backgroundColor: colors.raised }}
                      >
                        <Text style={{ color: colors.muted, fontSize: 12.5 }}>{ex}</Text>
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              {draft && category && (
                <Animated.View entering={FadeInDown.duration(400).springify()} style={{ marginTop: 20 }}>
                  <GlassCard>
                    <View style={{ padding: 20, gap: 16 }}>
                      <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '600' }}>Entendi isso:</Text>

                      {!editing ? (
                        <View style={{ alignItems: 'center', gap: 10, paddingVertical: 8 }}>
                          <Text style={{ color: colors.ink, fontSize: 32, fontWeight: '800' }}>
                            {formatCurrency(draft.amount)}
                          </Text>
                          <CategoryBadge category={category} showLabel />
                          <Text style={{ color: colors.muted, fontSize: 14 }}>{draft.description}</Text>
                          {draft.paymentMethod && (
                            <Text style={{ color: colors.faint, fontSize: 12 }}>{PAYMENT_LABELS[draft.paymentMethod]}</Text>
                          )}
                        </View>
                      ) : (
                        <View style={{ gap: 14 }}>
                          <TypeSegmentedControl
                            value={draft.type}
                            onChange={(type) => setDraft({ ...draft, type })}
                          />
                          <View>
                            <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Valor</Text>
                            <TextInput
                              value={String(draft.amount)}
                              onChangeText={(v) => setDraft({ ...draft, amount: parseLocaleNumber(v) })}
                              keyboardType="decimal-pad"
                              style={{ color: colors.ink, fontSize: 22, fontWeight: '700', backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                            />
                          </View>
                          <View>
                            <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Descrição</Text>
                            <TextInput
                              value={draft.description}
                              onChangeText={(v) => setDraft({ ...draft, description: v })}
                              style={{ color: colors.ink, fontSize: 15, backgroundColor: colors.raised, borderRadius: 12, padding: 12 }}
                            />
                          </View>
                          <View>
                            <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Categoria</Text>
                            <CategoryPicker
                              categories={categoriesForType}
                              selectedId={draft.categoryId}
                              onSelect={(categoryId) => setDraft({ ...draft, categoryId })}
                            />
                          </View>
                          <View>
                            <Text style={{ color: colors.faint, fontSize: 12, marginBottom: 6 }}>Forma de pagamento</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                              {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((pm) => {
                                const active = draft.paymentMethod === pm;
                                return (
                                  <Pressable
                                    key={pm}
                                    onPress={() => setDraft({ ...draft, paymentMethod: pm })}
                                    style={{
                                      paddingHorizontal: 12,
                                      paddingVertical: 8,
                                      borderRadius: 12,
                                      backgroundColor: active ? `${colors.accent}26` : colors.raised,
                                    }}
                                  >
                                    <Text style={{ color: active ? colors.accent : colors.muted, fontSize: 12.5, fontWeight: '600' }}>
                                      {PAYMENT_LABELS[pm]}
                                    </Text>
                                  </Pressable>
                                );
                              })}
                            </View>
                          </View>
                        </View>
                      )}

                      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                        <Pressable
                          onPress={() => setEditing((v) => !v)}
                          style={{ flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, backgroundColor: colors.raised }}
                        >
                          <Pencil size={14} color={colors.muted} />
                          <Text style={{ color: colors.muted, fontWeight: '700', fontSize: 14 }}>
                            {editing ? 'Concluir edição' : 'Editar'}
                          </Text>
                        </Pressable>
                        <View style={{ flex: 1 }}>
                          <GradientButton label="Confirmar" onPress={handleConfirm} />
                        </View>
                      </View>
                    </View>
                  </GlassCard>
                </Animated.View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
