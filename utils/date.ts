import {
  format,
  isToday,
  isYesterday,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  subMonths,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatShortDate(iso: string): string {
  const date = parseISO(iso);
  if (isToday(date)) return 'Hoje';
  if (isYesterday(date)) return 'Ontem';
  return format(date, "dd MMM", { locale: ptBR });
}

export function formatFullDate(iso: string): string {
  return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

export function formatMonthLabel(year: number, month: number): string {
  const date = new Date(year, month, 1);
  return format(date, 'MMMM yyyy', { locale: ptBR });
}

export function monthRange(year: number, month: number) {
  const date = new Date(year, month, 1);
  return { start: startOfMonth(date), end: endOfMonth(date) };
}

export function isInMonth(iso: string, year: number, month: number): boolean {
  const { start, end } = monthRange(year, month);
  const date = parseISO(iso);
  return isWithinInterval(date, { start: startOfDay(start), end: endOfDay(end) });
}

export function previousMonth(year: number, month: number): { year: number; month: number } {
  const date = subMonths(new Date(year, month, 1), 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayIso(): string {
  return new Date().toISOString();
}

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];
