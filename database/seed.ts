import { readValue, writeValue, STORAGE_KEYS } from './storage';
import { transactionsRepo, goalsRepo, budgetsRepo } from './repositories';
import { generateId } from '@/utils/id';
import type { Transaction, Goal, Budget } from '@/types/finance';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60));
  return d.toISOString();
}

function makeTx(partial: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
  const now = new Date().toISOString();
  return { id: generateId('tx'), createdAt: now, updatedAt: now, ...partial };
}

export async function seedIfNeeded(): Promise<void> {
  const alreadySeeded = await readValue<boolean>(STORAGE_KEYS.seeded, false);
  if (alreadySeeded) return;

  const expenses: Transaction[] = [
    makeTx({ type: 'expense', amount: 42, categoryId: 'cat-food', description: 'McDonald\'s', date: daysAgoIso(0), paymentMethod: 'credit_card', notes: null }),
    makeTx({ type: 'expense', amount: 18.5, categoryId: 'cat-food', description: 'Padaria', date: daysAgoIso(1), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'expense', amount: 120, categoryId: 'cat-transport', description: 'Gasolina', date: daysAgoIso(1), paymentMethod: 'debit_card', notes: null }),
    makeTx({ type: 'expense', amount: 89.9, categoryId: 'cat-shopping', description: 'Camiseta', date: daysAgoIso(2), paymentMethod: 'credit_card', notes: null }),
    makeTx({ type: 'expense', amount: 65, categoryId: 'cat-leisure', description: 'Cinema', date: daysAgoIso(3), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'expense', amount: 240, categoryId: 'cat-home', description: 'Conta de luz', date: daysAgoIso(4), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'expense', amount: 35.9, categoryId: 'cat-subscriptions', description: 'Spotify + Netflix', date: daysAgoIso(4), paymentMethod: 'credit_card', notes: null }),
    makeTx({ type: 'expense', amount: 55, categoryId: 'cat-food', description: 'Ifood', date: daysAgoIso(5), paymentMethod: 'credit_card', notes: null }),
    makeTx({ type: 'expense', amount: 300, categoryId: 'cat-health', description: 'Farmácia', date: daysAgoIso(6), paymentMethod: 'debit_card', notes: null }),
    makeTx({ type: 'expense', amount: 70, categoryId: 'cat-transport', description: 'Uber', date: daysAgoIso(7), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'expense', amount: 150, categoryId: 'cat-shopping', description: 'Mercado', date: daysAgoIso(8), paymentMethod: 'debit_card', notes: null }),
    makeTx({ type: 'expense', amount: 22, categoryId: 'cat-food', description: 'Café', date: daysAgoIso(9), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'expense', amount: 480, categoryId: 'cat-home', description: 'Aluguel (parte)', date: daysAgoIso(10), paymentMethod: 'transfer', notes: null }),
    makeTx({ type: 'expense', amount: 90, categoryId: 'cat-leisure', description: 'Bar com amigos', date: daysAgoIso(11), paymentMethod: 'credit_card', notes: null }),
    makeTx({ type: 'expense', amount: 45, categoryId: 'cat-food', description: 'Almoço', date: daysAgoIso(12), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'expense', amount: 199, categoryId: 'cat-education', description: 'Curso online', date: daysAgoIso(13), paymentMethod: 'credit_card', notes: null }),
    makeTx({ type: 'expense', amount: 60, categoryId: 'cat-transport', description: 'Gasolina', date: daysAgoIso(15), paymentMethod: 'debit_card', notes: null }),
    makeTx({ type: 'expense', amount: 130, categoryId: 'cat-shopping', description: 'Tênis', date: daysAgoIso(17), paymentMethod: 'credit_card', notes: null }),
    makeTx({ type: 'expense', amount: 38, categoryId: 'cat-food', description: 'Jantar', date: daysAgoIso(18), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'expense', amount: 25, categoryId: 'cat-leisure', description: 'Jogo mobile', date: daysAgoIso(20), paymentMethod: 'credit_card', notes: null }),
  ];

  const incomes: Transaction[] = [
    makeTx({ type: 'income', amount: 2500, categoryId: 'cat-salary', description: 'Salário', date: daysAgoIso(5), paymentMethod: 'transfer', notes: null }),
    makeTx({ type: 'income', amount: 300, categoryId: 'cat-freelance', description: 'Freela de design', date: daysAgoIso(9), paymentMethod: 'pix', notes: null }),
    makeTx({ type: 'income', amount: 150, categoryId: 'cat-investments', description: 'Dividendos', date: daysAgoIso(14), paymentMethod: 'transfer', notes: null }),
    makeTx({ type: 'income', amount: 2500, categoryId: 'cat-salary', description: 'Salário', date: daysAgoIso(35), paymentMethod: 'transfer', notes: null }),
    makeTx({ type: 'income', amount: 50, categoryId: 'cat-other-income', description: 'Venda usada', date: daysAgoIso(22), paymentMethod: 'pix', notes: null }),
  ];

  const savings: Transaction[] = [
    makeTx({ type: 'saving', amount: 500, categoryId: 'cat-saving', description: 'Reserva de emergência', date: daysAgoIso(6), paymentMethod: 'transfer', notes: null }),
    makeTx({ type: 'saving', amount: 300, categoryId: 'cat-saving', description: 'Guardado do mês', date: daysAgoIso(20), paymentMethod: 'transfer', notes: null }),
  ];

  await transactionsRepo.replaceAll([...expenses, ...incomes, ...savings]);

  const goals: Goal[] = [
    {
      id: generateId('goal'),
      title: 'Reserva de emergência',
      icon: 'ShieldCheck',
      color: '#34D399',
      targetAmount: 10000,
      currentAmount: 4200,
      deadline: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('goal'),
      title: 'iPhone novo',
      icon: 'Smartphone',
      color: '#7C5CFF',
      targetAmount: 7000,
      currentAmount: 3500,
      deadline: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: generateId('goal'),
      title: 'Comprar uma moto',
      icon: 'Bike',
      color: '#4C8CFF',
      targetAmount: 15000,
      currentAmount: 6500,
      deadline: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  await goalsRepo.replaceAll(goals);

  const budgets: Budget[] = [
    { id: generateId('bud'), categoryId: 'cat-food', monthlyLimit: 800, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: generateId('bud'), categoryId: 'cat-transport', monthlyLimit: 500, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: generateId('bud'), categoryId: 'cat-leisure', monthlyLimit: 300, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ];
  await budgetsRepo.replaceAll(budgets);

  await writeValue(STORAGE_KEYS.seeded, true);
}
