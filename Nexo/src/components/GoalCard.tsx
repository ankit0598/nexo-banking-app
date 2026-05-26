import { formatINR } from '../store'
import type { FinancialGoal } from '../types'

const goalCategoryIcon: Record<string, string> = {
  emergency_fund: '🏦',
  vacation: '✈️',
  education: '🎓',
  home_down_payment: '🏠',
  vehicle: '🚗',
  retirement: '🌴',
  wedding: '💍',
  other: '🎯',
}

const statusColor: Record<string, string> = {
  on_track: 'text-emerald-400 bg-emerald-500/10',
  behind: 'text-amber-400 bg-amber-500/10',
  achieved: 'text-blue-400 bg-blue-500/10',
}

const statusLabel: Record<string, string> = {
  on_track: 'On Track',
  behind: 'Behind',
  achieved: '✓ Achieved',
}

const progressColor: Record<string, string> = {
  on_track: 'from-emerald-500 to-teal-500',
  behind: 'from-amber-500 to-orange-500',
  achieved: 'from-blue-500 to-indigo-500',
}

export interface GoalCardProps {
  goal: FinancialGoal
}

export default function GoalCard({ goal }: GoalCardProps) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = goal.targetAmount - goal.currentAmount
  const targetDate = new Date(goal.targetDate)

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{goalCategoryIcon[goal.category]}</div>
          <div>
            <div className="text-sm font-semibold text-white">{goal.name}</div>
            <div className="text-[11px] text-slate-500">
              Target: {targetDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${statusColor[goal.status]}`}
        >
          {statusLabel[goal.status]}
        </span>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
        <span className="font-mono">{formatINR(goal.currentAmount)}</span>
        <span className="font-mono">{formatINR(goal.targetAmount)}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${progressColor[goal.status]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] mb-4">
        <span className="text-slate-500">{progress.toFixed(0)}% funded</span>
        {remaining > 0 && (
          <span className="text-slate-500 font-mono">{formatINR(remaining)} to go</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="text-[11px] text-slate-500">Monthly contribution</div>
        <div className="text-sm font-mono font-semibold text-emerald-400">
          {formatINR(goal.monthlyContribution)}/mo
        </div>
      </div>
    </div>
  )
}
