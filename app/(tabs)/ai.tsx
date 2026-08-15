import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/hooks/useThemeColors';
import { AIMessageBubble } from '@/features/ai/AIMessageBubble';
import { AIQuickPrompts } from '@/features/ai/AIQuickPrompts';
import { useTransactionsStore } from '@/store/useTransactionsStore';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { useGoalsStore } from '@/store/useGoalsStore';
import { useBudgetsStore } from '@/store/useBudgetsStore';
import { askFinanceAssistant } from '@/services/ai';
import { generateId } from '@/utils/id';
import { nowIso } from '@/utils/date';
import type { AIChatMessage } from '@/types/ai';

const WELCOME: AIChatMessage = {
  id: 'welcome',
  role: 'assistant',
  text: 'Olá! Eu sou a Finance AI. Pergunte sobre seus gastos, entradas ou economia — por exemplo "Quanto gastei esse mês?".',
  createdAt: nowIso(),
};

export default function FinanceAIScreen() {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const listRef = useRef<FlatList>(null);

  const transactions = useTransactionsStore((s) => s.transactions);
  const allCategories = useCategoriesStore((s) => s.allCategories);
  const categories = allCategories();
  const goals = useGoalsStore((s) => s.goals);
  const budgets = useBudgetsStore((s) => s.budgets);

  const [messages, setMessages] = useState<AIChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  async function handleSend(text?: string) {
    const question = (text ?? input).trim();
    if (!question) return;

    const userMessage: AIChatMessage = { id: generateId('msg'), role: 'user', text: question, createdAt: nowIso() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setThinking(true);
    Haptics.selectionAsync();

    const answer = await askFinanceAssistant(question, { transactions, categories, goals, budgets, now: new Date() });

    const assistantMessage: AIChatMessage = {
      id: generateId('msg'),
      role: 'assistant',
      text: answer.text,
      createdAt: nowIso(),
      visual: answer.visual,
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setThinking(false);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Sparkles size={20} color={colors.accent} />
          <Text style={{ color: colors.ink, fontSize: 22, fontWeight: '800' }}>Finance AI</Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        renderItem={({ item }) => <AIMessageBubble message={item} />}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />

      {thinking && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
          <Text style={{ color: colors.faint, fontSize: 12.5 }}>Finance AI está pensando…</Text>
        </View>
      )}

      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100, paddingTop: 6, gap: 10 }}>
        <AIQuickPrompts onSelect={(p) => handleSend(p)} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.raised,
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 6,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Pergunte sobre suas finanças…"
            placeholderTextColor={colors.faint}
            style={{ flex: 1, color: colors.ink, fontSize: 14.5, paddingHorizontal: 8, paddingVertical: 8 }}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <Pressable
            onPress={() => handleSend()}
            disabled={!input.trim()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.accent,
              opacity: input.trim() ? 1 : 0.5,
            }}
          >
            <Send size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
