interface StatusBadgeProps {
  tone: 'emerald' | 'amber' | 'red' | 'blue' | 'slate'
  children: React.ReactNode
}

const map: Record<StatusBadgeProps['tone'], string> = {
  emerald: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-300',
  red: 'bg-red-500/15 text-red-300',
  blue: 'bg-blue-500/15 text-blue-300',
  slate: 'bg-slate-500/15 text-slate-300',
}

export default function StatusBadge({ tone, children }: StatusBadgeProps) {
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${map[tone]}`}>{children}</span>
}
