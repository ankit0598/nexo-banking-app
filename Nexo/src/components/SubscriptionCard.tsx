import type { Subscription } from '../types'
import { useStore, formatINR } from '../store'

const categoryColors: Record<Subscription['category'], string> = {
  entertainment: 'bg-purple-500/15 text-purple-300',
  productivity: 'bg-blue-500/15 text-blue-300',
  health: 'bg-emerald-500/15 text-emerald-300',
  cloud: 'bg-cyan-500/15 text-cyan-300',
  utilities: 'bg-amber-500/15 text-amber-300',
  other: 'bg-slate-500/15 text-slate-300',
}

interface SubscriptionCardProps {
  subscription: Subscription
}

export default function SubscriptionCard({ subscription: sub }: SubscriptionCardProps) {
  const cancelSubscription = useStore((s) => s.cancelSubscription)

  const nextDate = new Date(sub.nextBillingDate)
  const TODAY = new Date('2026-05-25T10:30:00+05:30')
  const daysUntil = Math.round((nextDate.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))

  const monthlyEquiv =
    sub.frequency === 'annual' ? Math.round(sub.amount / 12) : sub.amount

  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 ${sub.status === 'cancelled' ? 'opacity-50' : ''}`}>
      {/* Logo */}
      <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center text-xl shrink-0">
        {sub.logo}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white truncate">{sub.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[sub.category]}`}>
            {sub.category}
          </span>
          {sub.status === 'cancelled' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-400">Cancelled</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-slate-400">
            {sub.frequency === 'annual' ? `₹${sub.amount.toLocaleString('en-IN')}/yr` : `₹${sub.amount.toLocaleString('en-IN')}/mo`}
          </span>
          {sub.frequency === 'annual' && (
            <span className="text-xs text-slate-500">≈ {formatINR(monthlyEquiv)}/mo</span>
          )}
          <span className={`text-xs ${daysUntil <= 7 ? 'text-amber-400' : 'text-slate-500'}`}>
            {daysUntil === 0 ? 'Due today' : `Due in ${daysUntil}d`}
          </span>
        </div>
      </div>

      {/* Action */}
      {sub.status === 'active' && (
        <button
          onClick={() => cancelSubscription(sub.id)}
          className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 px-3 py-1 rounded-lg transition-colors shrink-0"
        >
          Cancel
        </button>
      )}
    </div>
  )
}
