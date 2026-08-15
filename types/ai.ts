import type { TransactionType, PaymentMethod, Transaction, Category, Goal, Budget } from './finance';

export interface ParsedTransactionDraft {
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  paymentMethod: PaymentMethod | null;
  notes: string | null;
  confidence: number;
  rawText: string;
}

export type ParseResult =
  | { ok: true; draft: ParsedTransactionDraft }
  | { ok: false; reason: string };

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: string;
  visual?: AIVisualPayload;
}

export type AIVisualPayload =
  | { kind: 'category-breakdown'; items: { label: string; value: number; color: string }[] }
  | { kind: 'stat-cards'; items: { label: string; value: string; tone: 'income' | 'expense' | 'saving' | 'neutral' }[] }
  | { kind: 'comparison'; a: { label: string; value: number }; b: { label: string; value: number } };

export interface FinanceQueryContext {
  monthLabel: string;
  income: number;
  expense: number;
  saving: number;
  balance: number;
  savingsRate: number;
  categoryBreakdown: { name: string; total: number; percentage: number }[];
}

export interface FinanceDataSnapshot {
  transactions: Transaction[];
  categories: Category[];
  goals: Goal[];
  budgets: Budget[];
  now: Date;
}

export interface AIAnswer {
  text: string;
  visual?: AIVisualPayload;
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  ask(question: string, snapshot: FinanceDataSnapshot): Promise<AIAnswer>;
}
