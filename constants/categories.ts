import type { Category } from '@/types/finance';

export const DEFAULT_CATEGORIES: Category[] = [
  // expense
  { id: 'cat-food', name: 'Alimentação', icon: 'Utensils', color: '#FB923C', type: 'expense', isCustom: false },
  { id: 'cat-transport', name: 'Transporte', icon: 'Car', color: '#60A5FA', type: 'expense', isCustom: false },
  { id: 'cat-home', name: 'Casa', icon: 'Home', color: '#34D399', type: 'expense', isCustom: false },
  { id: 'cat-shopping', name: 'Compras', icon: 'ShoppingBag', color: '#F472B6', type: 'expense', isCustom: false },
  { id: 'cat-leisure', name: 'Lazer', icon: 'Gamepad2', color: '#A78BFA', type: 'expense', isCustom: false },
  { id: 'cat-health', name: 'Saúde', icon: 'HeartPulse', color: '#FB7185', type: 'expense', isCustom: false },
  { id: 'cat-education', name: 'Educação', icon: 'GraduationCap', color: '#22D3EE', type: 'expense', isCustom: false },
  { id: 'cat-subscriptions', name: 'Assinaturas', icon: 'Smartphone', color: '#7C5CFF', type: 'expense', isCustom: false },
  { id: 'cat-travel', name: 'Viagens', icon: 'Plane', color: '#4C8CFF', type: 'expense', isCustom: false },
  { id: 'cat-other-expense', name: 'Outros', icon: 'CircleEllipsis', color: '#8E8E9A', type: 'expense', isCustom: false },
  // income
  { id: 'cat-salary', name: 'Salário', icon: 'Briefcase', color: '#34D399', type: 'income', isCustom: false },
  { id: 'cat-freelance', name: 'Freelance', icon: 'Laptop', color: '#4C8CFF', type: 'income', isCustom: false },
  { id: 'cat-investments', name: 'Investimentos', icon: 'TrendingUp', color: '#FBBF24', type: 'income', isCustom: false },
  { id: 'cat-other-income', name: 'Outras receitas', icon: 'CircleEllipsis', color: '#8E8E9A', type: 'income', isCustom: false },
  // saving
  { id: 'cat-saving', name: 'Reserva', icon: 'PiggyBank', color: '#60A5FA', type: 'saving', isCustom: false },
];

export function getCategoryById(id: string): Category {
  return (
    DEFAULT_CATEGORIES.find((c) => c.id === id) ?? {
      id,
      name: 'Outros',
      icon: 'CircleEllipsis',
      color: '#8E8E9A',
      type: 'any',
      isCustom: false,
    }
  );
}
