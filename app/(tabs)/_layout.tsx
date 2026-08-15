import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '@/components/BottomTabBar';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transações' }} />
      <Tabs.Screen name="summary" options={{ title: 'Resumo' }} />
      <Tabs.Screen name="goals" options={{ title: 'Metas' }} />
      <Tabs.Screen name="ai" options={{ title: 'IA' }} />
    </Tabs>
  );
}
