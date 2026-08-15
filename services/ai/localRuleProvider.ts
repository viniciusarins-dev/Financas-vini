import type { AIAnswer, AIProvider, FinanceDataSnapshot } from '@/types/ai';
import { formatCurrency, formatPercentage } from '@/utils/currency';
import { MONTH_NAMES_PT } from '@/utils/date';
import {
  computeMonthlySummary,
  computeCategoryBreakdown,
  projectEndOfMonthSpending,
  filterByMonth,
} from '@/services/financeCalculations';
import { guessCategoryId } from '@/services/nlp/categoryKeywords';
import { getCategoryById, DEFAULT_CATEGORIES } from '@/constants/categories';
import { parseLocaleNumber } from '@/utils/currency';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function findMonthMentions(lower: string, now: Date): { year: number; month: number }[] {
  const results: { year: number; month: number }[] = [];
  const normalizedMonths = MONTH_NAMES_PT.map((m) => normalize(m));
  normalizedMonths.forEach((name, index) => {
    if (lower.includes(name)) {
      let year = now.getFullYear();
      if (index > now.getMonth()) year -= 1;
      results.push({ year, month: index });
    }
  });
  return results;
}

function biggestExpense(snapshot: FinanceDataSnapshot, year: number, month: number) {
  const tx = filterByMonth(snapshot.transactions, year, month).filter((t) => t.type === 'expense');
  if (tx.length === 0) return null;
  return tx.reduce((max, t) => (t.amount > max.amount ? t : max), tx[0]);
}

function topCategoryName(snapshot: FinanceDataSnapshot, year: number, month: number): string | null {
  const breakdown = computeCategoryBreakdown(snapshot.transactions, year, month, 'expense');
  return breakdown[0]?.category.name ?? null;
}

function matchCategoryFromText(lower: string): string | null {
  const guessed = guessCategoryId(lower, '');
  if (guessed) return guessed;
  const byName = DEFAULT_CATEGORIES.find((c) => lower.includes(normalize(c.name)));
  return byName?.id ?? null;
}

function handle(lower: string, rawText: string, snapshot: FinanceDataSnapshot): AIAnswer {
  const now = snapshot.now;
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthLabel = MONTH_NAMES_PT[month];
  const summary = computeMonthlySummary(snapshot.transactions, year, month);

  // Comparação entre dois meses citados no texto
  const mentionedMonths = findMonthMentions(lower, now);
  if (lower.includes('compar') && mentionedMonths.length >= 2) {
    const [a, b] = mentionedMonths;
    const sa = computeMonthlySummary(snapshot.transactions, a.year, a.month);
    const sb = computeMonthlySummary(snapshot.transactions, b.year, b.month);
    const diff = sb.expense - sa.expense;
    const diffText = diff === 0 ? 'ficaram iguais' : diff > 0 ? `aumentaram ${formatCurrency(Math.abs(diff))}` : `caíram ${formatCurrency(Math.abs(diff))}`;
    return {
      text: `Em ${MONTH_NAMES_PT[a.month]} você gastou ${formatCurrency(sa.expense)} e em ${MONTH_NAMES_PT[b.month]} gastou ${formatCurrency(sb.expense)}. Seus gastos ${diffText}.`,
      visual: {
        kind: 'comparison',
        a: { label: MONTH_NAMES_PT[a.month], value: sa.expense },
        b: { label: MONTH_NAMES_PT[b.month], value: sb.expense },
      },
    };
  }

  // Últimos N meses (entradas)
  const lastMonthsMatch = lower.match(/[uú]ltimos?\s+(\d+)\s+mes/);
  if (lastMonthsMatch && (lower.includes('entrou') || lower.includes('entrada') || lower.includes('recebi'))) {
    const n = parseInt(lastMonthsMatch[1], 10);
    let total = 0;
    for (let i = 0; i < n; i++) {
      const d = new Date(year, month - i, 1);
      total += computeMonthlySummary(snapshot.transactions, d.getFullYear(), d.getMonth()).income;
    }
    return { text: `Nos últimos ${n} meses, entraram ${formatCurrency(total)} nas suas contas.` };
  }

  // Meta: quanto economizar por mês para juntar X
  if ((lower.includes('preciso') || lower.includes('quanto devo')) && lower.includes('economizar')) {
    const amountMatch = rawText.match(/(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)/);
    const monthsMatch = lower.match(/(\d+)\s*mes/);
    if (amountMatch) {
      const target = parseLocaleNumber(amountMatch[1]);
      const months = monthsMatch ? parseInt(monthsMatch[1], 10) : 12;
      const perMonth = target / months;
      return {
        text: `Para juntar ${formatCurrency(target)} em ${months} meses, você precisa guardar ${formatCurrency(perMonth)} por mês.`,
      };
    }
  }

  // Projeção de gasto até o fim do mês
  if (lower.includes('se eu continuar') || (lower.includes('posso gastar') && lower.includes('final do mes')) || lower.includes('vou gastar até')) {
    const projected = projectEndOfMonthSpending(snapshot.transactions, year, month);
    return {
      text: `No ritmo atual, você deve terminar ${monthLabel} com um gasto total de aproximadamente ${formatCurrency(projected)}.`,
    };
  }
  if (lower.includes('posso gastar')) {
    const projected = projectEndOfMonthSpending(snapshot.transactions, year, month);
    const remaining = Math.max(summary.income - projected, 0);
    return {
      text: `Considerando sua renda e seu ritmo de gastos, ainda sobram cerca de ${formatCurrency(remaining)} até o fim do mês.`,
    };
  }

  // Maior despesa individual
  if ((lower.includes('maior despesa') || lower.includes('maior gasto')) && !lower.includes('categoria')) {
    const biggest = biggestExpense(snapshot, year, month);
    if (biggest) {
      const category = getCategoryById(biggest.categoryId);
      return { text: `Sua maior despesa em ${monthLabel} foi "${biggest.description}" (${category.name}), no valor de ${formatCurrency(biggest.amount)}.` };
    }
    return { text: `Você ainda não registrou despesas em ${monthLabel}.` };
  }

  // Categoria que mais consome / em que mais gastou
  if (lower.includes('em que') && lower.includes('mais gast')) {
    return categoryBreakdownAnswer(snapshot, year, month, monthLabel);
  }
  if (lower.includes('categoria') && (lower.includes('mais') || lower.includes('consumindo'))) {
    return categoryBreakdownAnswer(snapshot, year, month, monthLabel);
  }

  // Gasto com categoria específica (comida, gasolina, etc.)
  if (lower.includes('quanto') && lower.includes('gast') && lower.includes('com')) {
    const categoryId = matchCategoryFromText(lower);
    if (categoryId) {
      const category = getCategoryById(categoryId);
      const tx = filterByMonth(snapshot.transactions, year, month).filter((t) => t.type === 'expense' && t.categoryId === categoryId);
      const total = tx.reduce((acc, t) => acc + t.amount, 0);
      const pct = summary.expense > 0 ? (total / summary.expense) * 100 : 0;
      return {
        text: total > 0
          ? `Você gastou ${formatCurrency(total)} com ${category.name.toLowerCase()} em ${monthLabel}, o equivalente a ${formatPercentage(pct)} das suas despesas.`
          : `Não encontrei gastos com ${category.name.toLowerCase()} em ${monthLabel}.`,
      };
    }
  }

  // Quanto guardei / consegui economizar
  if (lower.includes('guard') || (lower.includes('economiz') && !lower.includes('preciso'))) {
    return {
      text: `Você guardou ${formatCurrency(summary.saving)} em ${monthLabel}, o que representa ${formatPercentage(summary.savingsRate)} da sua renda.`,
      visual: { kind: 'stat-cards', items: [{ label: 'Guardado', value: formatCurrency(summary.saving), tone: 'saving' }] },
    };
  }

  // Quanto entrou
  if (lower.includes('entrou') || lower.includes('recebi') || (lower.includes('quanto') && lower.includes('renda'))) {
    return {
      text: `Entraram ${formatCurrency(summary.income)} em ${monthLabel}.`,
      visual: { kind: 'stat-cards', items: [{ label: 'Entradas', value: formatCurrency(summary.income), tone: 'income' }] },
    };
  }

  // Quanto sobrou / saldo
  if (lower.includes('sobrou') || lower.includes('saldo')) {
    return {
      text: `Seu saldo em ${monthLabel} é de ${formatCurrency(summary.balance)}.`,
      visual: { kind: 'stat-cards', items: [{ label: 'Saldo', value: formatCurrency(summary.balance), tone: summary.balance >= 0 ? 'income' : 'expense' }] },
    };
  }

  // Quanto gastei esse mês (padrão geral)
  if (lower.includes('gast')) {
    return {
      text: `Você gastou ${formatCurrency(summary.expense)} em ${monthLabel}. Sua maior categoria foi ${topCategoryName(snapshot, year, month) ?? 'nenhuma'}.`,
      visual: { kind: 'stat-cards', items: [{ label: 'Despesas', value: formatCurrency(summary.expense), tone: 'expense' }] },
    };
  }

  // fallback: resumo geral
  return {
    text: `Em ${monthLabel}: entraram ${formatCurrency(summary.income)}, saíram ${formatCurrency(summary.expense)} e você guardou ${formatCurrency(summary.saving)}. Seu saldo é de ${formatCurrency(summary.balance)}.`,
    visual: {
      kind: 'stat-cards',
      items: [
        { label: 'Entradas', value: formatCurrency(summary.income), tone: 'income' },
        { label: 'Despesas', value: formatCurrency(summary.expense), tone: 'expense' },
        { label: 'Guardado', value: formatCurrency(summary.saving), tone: 'saving' },
      ],
    },
  };
}

function categoryBreakdownAnswer(snapshot: FinanceDataSnapshot, year: number, month: number, monthLabel: string): AIAnswer {
  const breakdown = computeCategoryBreakdown(snapshot.transactions, year, month, 'expense');
  const top = breakdown[0];
  if (!top) {
    return { text: `Você ainda não registrou despesas em ${monthLabel}.` };
  }
  return {
    text: `Sua maior categoria de gastos em ${monthLabel} foi ${top.category.name}, representando ${formatPercentage(top.percentage)} das suas despesas (${formatCurrency(top.total)}).`,
    visual: {
      kind: 'category-breakdown',
      items: breakdown.slice(0, 5).map((b) => ({ label: b.category.name, value: b.total, color: b.category.color })),
    },
  };
}

export const localRuleProvider: AIProvider = {
  name: 'Fluxo Local',
  isAvailable: () => true,
  async ask(question: string, snapshot: FinanceDataSnapshot): Promise<AIAnswer> {
    const lower = normalize(question);
    return handle(lower, question, snapshot);
  },
};
