import type { ParseResult } from '@/types/ai';
import type { PaymentMethod, TransactionType } from '@/types/finance';
import { parseLocaleNumber } from '@/utils/currency';
import { containsWholeWord } from '@/utils/textMatch';
import { guessCategoryId } from './categoryKeywords';

const INCOME_VERBS = ['recebi', 'ganhei', 'caiu', 'entrou', 'me pagaram', 'faturei'];
const SAVING_VERBS = ['guardei', 'poupei', 'reservei', 'investi', 'separei'];
const EXPENSE_VERBS = ['gastei', 'paguei', 'comprei', 'gasto', 'torrei'];

const PAYMENT_KEYWORDS: [PaymentMethod, string[]][] = [
  ['pix', ['pix']],
  ['credit_card', ['cartão de crédito', 'cartao de credito', 'no crédito', 'no credito', 'crédito', 'credito']],
  ['debit_card', ['cartão de débito', 'cartao de debito', 'no débito', 'no debito', 'débito', 'debito']],
  ['transfer', ['transferência', 'transferencia', 'ted', 'doc']],
  ['cash', ['dinheiro', 'espécie', 'especie', 'em cash']],
];

const AMOUNT_REGEX = /(?:r\$\s*)?(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+(?:[.,]\d{1,2})?)(?:\s*(?:reais|contos|pila))?/i;

function detectType(lowerText: string): TransactionType {
  if (SAVING_VERBS.some((v) => containsWholeWord(lowerText, v))) return 'saving';
  if (INCOME_VERBS.some((v) => containsWholeWord(lowerText, v))) return 'income';
  if (EXPENSE_VERBS.some((v) => containsWholeWord(lowerText, v))) return 'expense';
  return 'expense';
}

function detectPaymentMethod(lowerText: string): PaymentMethod | null {
  for (const [method, keywords] of PAYMENT_KEYWORDS) {
    if (keywords.some((k) => containsWholeWord(lowerText, k))) return method;
  }
  return null;
}

function detectDate(lowerText: string): string {
  const now = new Date();
  if (lowerText.includes('anteontem')) {
    now.setDate(now.getDate() - 2);
  } else if (lowerText.includes('ontem')) {
    now.setDate(now.getDate() - 1);
  }
  return now.toISOString();
}

function extractDescription(originalText: string, matchedAmountText: string): string {
  let text = originalText;

  for (const verb of [...INCOME_VERBS, ...SAVING_VERBS, ...EXPENSE_VERBS]) {
    text = text.replace(new RegExp(verb, 'ig'), '');
  }
  text = text.replace(matchedAmountText, '');
  text = text.replace(/r\$/gi, '');
  text = text.replace(/\b(reais|conto|contos|pila)\b/gi, '');
  text = text.replace(/\b(no pix|com pix|pix)\b/gi, '');
  text = text.replace(/\b(no cr[eé]dito|no d[eé]bito|cart[aã]o de cr[eé]dito|cart[aã]o de d[eé]bito)\b/gi, '');
  text = text.replace(/\b(hoje|ontem|anteontem)\b/gi, '');
  text = text.replace(/^\s*(de|do|da|em|no|na|com|para)\s+/i, '');
  text = text.replace(/\s+(de|do|da)\s*$/i, '');
  text = text.replace(/\s{2,}/g, ' ').trim();

  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function parseTransactionText(rawText: string): ParseResult {
  const text = rawText.trim();
  if (!text) {
    return { ok: false, reason: 'Digite algo como "Gastei 35 reais no almoço".' };
  }

  const lower = text.toLowerCase();
  const amountMatch = text.match(AMOUNT_REGEX);
  if (!amountMatch || !amountMatch[1]) {
    return { ok: false, reason: 'Não consegui identificar um valor. Tente incluir algo como "R$ 35".' };
  }

  const amount = parseLocaleNumber(amountMatch[1]);
  if (amount <= 0) {
    return { ok: false, reason: 'O valor precisa ser maior que zero.' };
  }

  const type = detectType(lower);
  const fallbackCategory = type === 'income' ? 'cat-other-income' : type === 'saving' ? 'cat-saving' : 'cat-other-expense';
  const categoryId = guessCategoryId(lower, fallbackCategory);
  const paymentMethod = detectPaymentMethod(lower);
  const date = detectDate(lower);
  const description = extractDescription(text, amountMatch[0]) || defaultDescription(categoryId);

  const confidence = amountMatch && categoryId !== fallbackCategory ? 0.9 : 0.65;

  return {
    ok: true,
    draft: {
      type,
      amount,
      categoryId,
      description,
      date,
      paymentMethod,
      notes: null,
      confidence,
      rawText: text,
    },
  };
}

function defaultDescription(categoryId: string): string {
  const map: Record<string, string> = {
    'cat-food': 'Alimentação',
    'cat-transport': 'Transporte',
    'cat-home': 'Casa',
    'cat-shopping': 'Compras',
    'cat-leisure': 'Lazer',
    'cat-health': 'Saúde',
    'cat-education': 'Educação',
    'cat-subscriptions': 'Assinatura',
    'cat-travel': 'Viagem',
    'cat-salary': 'Salário',
    'cat-freelance': 'Freelance',
    'cat-investments': 'Investimento',
    'cat-saving': 'Guardado',
  };
  return map[categoryId] ?? 'Movimentação';
}
