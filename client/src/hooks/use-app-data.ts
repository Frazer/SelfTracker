import { useLocalStorage } from "./use-local-storage";
import { format } from "date-fns";
import { nanoid } from "nanoid";

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Entry {
  id: string;
  date: string; // YYYY-MM-DD
  categoryId: string;
  score: number; // 0-10
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Workout', color: '#ef4444' }, // red-500
  { id: '2', name: 'Eat Healthy', color: '#22c55e' }, // green-500
  { id: '3', name: 'Sleep', color: '#3b82f6' }, // blue-500
  { id: '4', name: 'Meditate', color: '#a855f7' }, // purple-500
];

export function useAppData() {
  const [categories, setCategories] = useLocalStorage<Category[]>("app-categories", DEFAULT_CATEGORIES);
  const [entries, setEntries] = useLocalStorage<Entry[]>("app-entries", []);

  // --- Categories Operations ---
  const addCategory = (name: string, color: string) => {
    const newCategory: Category = { id: nanoid(), name, color };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter(c => c.id !== id));
    // Also cleanup entries for this category? Optional, but cleaner.
    setEntries((prev) => prev.filter(e => e.categoryId !== id));
  };

  // --- Entries Operations ---
  const getEntryValue = (date: Date, categoryId: string): number | undefined => {
    const dateStr = format(date, "yyyy-MM-dd");
    const entry = entries.find(e => e.date === dateStr && e.categoryId === categoryId);
    return entry?.score;
  };

  const setEntryValue = (date: Date, categoryId: string, score: number) => {
    const dateStr = format(date, "yyyy-MM-dd");
    
    setEntries((prev) => {
      const existingIndex = prev.findIndex(e => e.date === dateStr && e.categoryId === categoryId);
      
      if (existingIndex >= 0) {
        // Update existing
        const newEntries = [...prev];
        newEntries[existingIndex] = { ...newEntries[existingIndex], score };
        return newEntries;
      } else {
        // Create new
        return [...prev, { id: nanoid(), date: dateStr, categoryId, score }];
      }
    });
  };

  return {
    categories,
    entries,
    addCategory,
    updateCategory,
    deleteCategory,
    getEntryValue,
    setEntryValue
  };
}
