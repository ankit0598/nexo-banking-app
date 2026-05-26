import { formatINR } from '../store'
import type { InsurancePolicy } from '../types'

const policyTypeLabel: Record<string, string> = {
  term: 'Term Life',
  health: 'Health',
  vehicle: 'Vehicle',
  ulip: 'ULIP',
}

const policyTypeColor: Record<string, string> = {
  term: 'text-blue-400 bg-blue-500/10',
  health: 'text-rose-400 bg-rose-500/10',
  vehicle: 'text-cyan-400 bg-cyan-500/10',
  ulip: 'text-purple-400 bg-purple-500/10',
}

const policyTypeIcon: Record<string, string> = {
  term: '🛡️',
  health: '❤️',
  vehicle: '🚗',
  ulip: '📈',
}

const TODAY = new Date('2026-05-25T00:00:00+05:30')

export interface InsurancePolicyCardProps {
  policy: InsurancePolicy
}

export default function InsurancePolicyCard({ policy }: InsurancePolicyCardProps) {
  const nextPremium = new Date(policy.nextPremiumDate)
  const daysToNext = Math.round((nextPremium.getTime() - TODAY.getTime()) / 86400000)
  const isUrgent = daysToNext <= 30

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{policyTypeIcon[policy.policyType]}</div>
          <div>
            <div className="text-sm font-semibold text-white">{policy.insurer}</div>
            <div className="text-[11px] font-mono text-slate-500">{policy.policyNumber}</div>
          </div>
        </div>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${policyTypeColor[policy.policyType]}`}
        >
          {policyTypeLabel[policy.policyType]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Sum Insured</div>
          <div className="text-base font-mono font-bold text-white">{formatINR(policy.coverAmount)}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Premium</div>
          <div className="text-base font-mono font-bold text-emerald-400">{formatINR(policy.premiumAmount)}</div>
          <div className="text-[10px] text-slate-500">/{policy.premiumFrequency}</div>
        </div>
      </div>

      <div
        className={`flex items-center justify-between rounded-lg px-3 py-2 ${
          isUrgent ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-white/5'
        }`}
      >
        <div className="text-xs text-slate-400">Next premium due</div>
        <div
          className={`text-xs font-mono font-semibold ${
            isUrgent ? 'text-amber-400' : 'text-slate-300'
          }`}
        >
          {isUrgent && '⚠️ '}
          {nextPremium.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' '}
          <span className="text-slate-500">({daysToNext}d)</span>
        </div>
      </div>
    </div>
  )
}
