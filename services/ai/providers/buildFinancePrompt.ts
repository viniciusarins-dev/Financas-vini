import type { FinanceDataSnapshot } from '@/types/ai';
import { computeMonthlySummary, computeCategoryBreakdown } from '@/services/financeCalculations';
import { formatCurrency } from '@/utils/currency';
import { MONTH_NAMES_PT } from '@/utils/date';

/** Builds a compact, privacy-conscious summary instead of sending raw transaction history. */
export function buildFinancePrompt(question: string, snapshot: FinanceDataSnapshot): string {
  const year = snapshot.now.getFullYear();
  const month = snapshot.now.getMonth();
  const summary = computeMonthlySummary(snapshot.transactions, year, month);
  const breakdown = computeCategoryBreakdown(snapshot.transactions, year, month, 'expense').slice(0, 6);

  const lines = [
    `Você é o assistente financeiro do app Fluxo. Responda em português, de forma curta e direta.`,
    `Mês de referência: ${MONTH_NAMES_PT[month]} de ${year}.`,
    `Entradas: ${formatCurrency(summary.income)}`,
    `Despesas: ${formatCurrency(summary.expense)}`,
    `Guardado: ${formatCurrency(summary.saving)}`,
    `Saldo: ${formatCurrency(summary.balance)}`,
    `Principais categorias de despesa: ${breakdown.map((b) => `${b.category.name} ${formatCurrency(b.total)}`).join(', ') || 'nenhuma'}`,
    `Pergunta do usuário: ${question}`,
  ];
  return lines.join('\n');
}
