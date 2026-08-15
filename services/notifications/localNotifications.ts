import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

const DAILY_REMINDER_ID = 'fluxo-daily-reminder';

export async function scheduleDailyReminder(hour = 20, minute = 0): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: {
      title: 'Fluxo',
      body: 'Você ainda não registrou nenhuma despesa hoje.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID);
}

export async function sendBudgetWarning(categoryName: string, percentage: number): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Orçamento quase no limite',
      body: `Você já utilizou ${Math.round(percentage)}% do seu orçamento de ${categoryName}.`,
    },
    trigger: null,
  });
}

export async function sendBudgetExceeded(categoryName: string, overAmount: number): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Orçamento ultrapassado',
      body: `Você ultrapassou seu orçamento de ${categoryName} em R$ ${overAmount.toFixed(2)}.`,
    },
    trigger: null,
  });
}
