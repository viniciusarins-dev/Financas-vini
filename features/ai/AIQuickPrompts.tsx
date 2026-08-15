import React from 'react';
import { ScrollView, Pressable, Text } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

const PROMPTS = [
  'Quanto eu gastei esse mês?',
  'Em que eu mais gastei?',
  'Quanto consegui guardar?',
  'Quanto sobrou?',
  'Qual foi minha maior despesa?',
];

export function AIQuickPrompts({ onSelect }: { onSelect: (text: string) => void }) {
  const colors = useThemeColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
      {PROMPTS.map((p) => (
        <Pressable
          key={p}
          onPress={() => onSelect(p)}
          style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 16, backgroundColor: colors.raised }}
        >
          <Text style={{ color: colors.muted, fontSize: 12.5, fontWeight: '600' }}>{p}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
