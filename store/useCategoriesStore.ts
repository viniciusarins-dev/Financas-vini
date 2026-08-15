import { create } from 'zustand';
import type { Category } from '@/types/finance';
import { categoriesRepo } from '@/database/repositories';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { generateId } from '@/utils/id';

interface CategoriesState {
  customCategories: Category[];
  isLoaded: boolean;
  load: () => Promise<void>;
  allCategories: () => Category[];
  addCategory: (input: Omit<Category, 'id' | 'isCustom'>) => Promise<Category>;
  removeCategory: (id: string) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  customCategories: [],
  isLoaded: false,

  load: async () => {
    const items = await categoriesRepo.list();
    set({ customCategories: items, isLoaded: true });
  },

  allCategories: () => [...DEFAULT_CATEGORIES, ...get().customCategories],

  addCategory: async (input) => {
    const category: Category = { ...input, id: generateId('cat'), isCustom: true };
    await categoriesRepo.add(category);
    set({ customCategories: [...get().customCategories, category] });
    return category;
  },

  removeCategory: async (id) => {
    await categoriesRepo.remove(id);
    set({ customCategories: get().customCategories.filter((c) => c.id !== id) });
  },
}));
