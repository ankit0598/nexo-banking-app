import type { Category } from '../types'

interface CategoryPillProps {
  category: Category
}

const map: Record<Category, { label: string; cls: string }> = {
  food: { label: 'Food', cls: 'bg-orange-500/15 text-orange-300' },
  transport: { label: 'Transport', cls: 'bg-cyan-500/15 text-cyan-300' },
  shopping: { label: 'Shopping', cls: 'bg-pink-500/15 text-pink-300' },
  bills: { label: 'Bills', cls: 'bg-amber-500/15 text-amber-300' },
  entertainment: { label: 'Entertainment', cls: 'bg-purple-500/15 text-purple-300' },
  salary: { label: 'Salary', cls: 'bg-emerald-500/15 text-emerald-300' },
  transfer: { label: 'Transfer', cls: 'bg-blue-500/15 text-blue-300' },
  other: { label: 'Other', cls: 'bg-slate-500/15 text-slate-300' },
}

export const categoryColor: Record<Category, string> = {
  food: '#fb923c',
  transport: '#22d3ee',
  shopping: '#ec4899',
  bills: '#f59e0b',
  entertainment: '#a855f7',
  salary: '#10b981',
  transfer: '#3b82f6',
  other: '#94a3b8',
}

export default function CategoryPill({ category }: CategoryPillProps) {
  const m = map[category]
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${m.cls}`}>{m.label}</span>
}
