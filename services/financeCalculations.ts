import type { Transaction, Category, MonthlySummary, CategoryBreakdownItem, Budget } from '@/types/finance';
import { getCategoryById } from '@/constants/categories';
import { isInMonth, monthRange, previousMonth } from '@/utils/date';
import { parseISO } from 'date-fns';

export function filterByMonth(transactions: Transaction[], year: number, month: number): Transaction[] {
  return transactions.filter((t) => isInMonth(t.date, year, month));
}

export function computeMonthlySummary(transactions: Transaction[], year: number, month: number): MonthlySummary {
  const monthTx = filterByMonth(transactions, year, month);
  const income = sumByType(monthTx, 'income');
  const expense = sumByType(monthTx, 'expense');
  const saving = sumByType(monthTx, 'saving');
  const balance = income - expense - saving;
  const savingsRate = income > 0 ? (saving / income) * 100 : 0;
  return { year, month, income, expense, saving, balance, savingsRate };
}

export function sumByType(transactions: Transaction[], type: Transaction['type']): number {
  return transactions.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);
}

export function computeCategoryBreakdown(
  transactions: Transaction[],
  year: number,
  month: number,
  type: Transaction['type'] = 'expense',
): CategoryBreakdownItem[] {
  const monthTx = filterByMonth(transactions, year, month).filter((t) => t.type === type);
  const total = monthTx.reduce((acc, t) => acc + t.amount, 0);

  const byCategory = new Map<string, { total: number; count: number }>();
  for (const t of monthTx) {
    const current = byCategory.get(t.categoryId) ?? { total: 0, count: 0 };
    current.total += t.amount;
    current.count += 1;
    byCategory.set(t.categoryId, current);
  }

  const items: CategoryBreakdownItem[] = Array.from(byCategory.entries()).map(([categoryId, { total: catTotal, count }]) => ({
    categoryId,
    category: getCategoryById(categoryId),
    total: catTotal,
    percentage: total > 0 ? (catTotal / total) * 100 : 0,
    transactionCount: count,
  }));

  return items.sort((a, b) => b.total - a.total);
}

export interface BalancePoint {
  day: number;
  balance: number;
}

export function computeBalanceEvolution(transactions: Transaction[], year: number, month: number): BalancePoint[] {
  const { end } = monthRange(year, month);
  const daysInMonth = end.getDate();
  const monthTx = filterByMonth(transactions, year, month);

  const dailyDelta = new Array(daysInMonth + 1).fill(0);
  for (const t of monthTx) {
    const day = parseISO(t.date).getDate();
    const signed = t.type === 'income' ? t.amount : -t.amount;
    dailyDelta[day] += signed;
  }

  const points: BalancePoint[] = [];
  let running = 0;
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const lastDay = isCurrentMonth ? today.getDate() : daysInMonth;

  for (let day = 1; day <= lastDay; day++) {
    running += dailyDelta[day];
    points.push({ day, balance: running });
  }
  return points;
}

export interface BudgetProgress {
  budget: Budget;
  category: Category;
  spent: number;
  percentage: number;
  remaining: number;
  isOverLimit: boolean;
  isNearLimit: boolean;
}

export function computeBudgetProgress(
  transactions: Transaction[],
  budgets: Budget[],
  year: number,
  month: number,
): BudgetProgress[] {
  const monthTx = filterByMonth(transactions, year, month).filter((t) => t.type === 'expense');
  return budgets.map((budget) => {
    const spent = monthTx.filter((t) => t.categoryId === budget.categoryId).reduce((acc, t) => acc + t.amount, 0);
    const percentage = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
    return {
      budget,
      category: getCategoryById(budget.categoryId),
      spent,
      percentage,
      remaining: budget.monthlyLimit - spent,
      isOverLimit: spent > budget.monthlyLimit,
      isNearLimit: percentage >= 80 && percentage <= 100,
    };
  });
}

export interface Insight {
  id: string;
  text: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export function generateInsights(transactions: Transaction[], year: number, month: number): Insight[] {
  const insights: Insight[] = [];
  const current = computeMonthlySummary(transactions, year, month);
  const prev = previousMonth(year, month);
  const previous = computeMonthlySummary(transactions, prev.year, prev.month);

  const currentBreakdown = computeCategoryBreakdown(transactions, year, month, 'expense');
  const previousBreakdown = computeCategoryBreakdown(transactions, prev.year, prev.month, 'expense');

  for (const item of currentBreakdown.slice(0, 5)) {
    const prevItem = previousBreakdown.find((p) => p.categoryId === item.categoryId);
    if (!prevItem || prevItem.total === 0) continue;
    const change = ((item.total - prevItem.total) / prevItem.total) * 100;
    if (Math.abs(change) >= 15) {
      insights.push({
        id: `cat-${item.categoryId}`,
        text:
          change > 0
            ? `Você gastou ${Math.round(change)}% a mais com ${item.category.name.toLowerCase()} este mês.`
            : `Seu gasto com ${item.category.name.toLowerCase()} caiu ${Math.round(Math.abs(change))}%.`,
        tone: change > 0 ? 'negative' : 'positive',
      });
    }
  }

  if (previous.saving > 0 && current.saving > previous.saving) {
    insights.push({
      id: 'saving-up',
      text: 'Você economizou mais neste mês do que no mês passado.',
      tone: 'positive',
    });
  } else if (previous.saving > 0 && current.saving < previous.saving) {
    insights.push({
      id: 'saving-down',
      text: 'Você guardou menos dinheiro este mês em comparação ao mês passado.',
      tone: 'negative',
    });
  }

  if (current.expense > current.income && current.income > 0) {
    insights.push({
      id: 'overspending',
      text: 'Suas despesas ultrapassaram sua renda este mês.',
      tone: 'negative',
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: 'stable',
      text: 'Seus gastos estão estáveis em comparação ao mês passado.',
      tone: 'neutral',
    });
  }

  return insights;
}

export function projectEndOfMonthSpending(transactions: Transaction[], year: number, month: number): number {
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  if (!isCurrentMonth) {
    return computeMonthlySummary(transactions, year, month).expense;
  }
  const dayOfMonth = today.getDate();
  const { end } = monthRange(year, month);
  const daysInMonth = end.getDate();
  const spentSoFar = computeMonthlySummary(transactions, year, month).expense;
  const dailyAverage = spentSoFar / Math.max(dayOfMonth, 1);
  return dailyAverage * daysInMonth;
}
