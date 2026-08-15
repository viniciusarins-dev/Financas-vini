export type TransactionType = 'income' | 'expense' | 'saving';

export type PaymentMethod = 'pix' | 'cash' | 'credit_card' | 'debit_card' | 'transfer' | 'other';

export type CategoryType = TransactionType | 'any';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  paymentMethod: PaymentMethod | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  icon: string;
  color: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note: string | null;
}

export interface MonthlySummary {
  year: number;
  month: number;
  income: number;
  expense: number;
  saving: number;
  balance: number;
  savingsRate: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  category: Category;
  total: number;
  percentage: number;
  transactionCount: number;
}

export interface AppSettings {
  themeMode: 'dark' | 'light' | 'system';
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  userName: string;
}
