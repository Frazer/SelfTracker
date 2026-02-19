import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
});

export const entrySchema = z.object({
  id: z.string(),
  date: z.string(), // YYYY-MM-DD
  categoryId: z.string(),
  score: z.number().min(0).max(10),
});

export type Category = z.infer<typeof categorySchema>;
export type Entry = z.infer<typeof entrySchema>;

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Workout', color: 'hsl(var(--chart-1))' },
  { id: '2', name: 'Eat healthy', color: 'hsl(var(--chart-2))' },
  { id: '3', name: 'Sleep', color: 'hsl(var(--chart-3))' },
  { id: '4', name: 'Meditate', color: 'hsl(var(--chart-4))' },
];
