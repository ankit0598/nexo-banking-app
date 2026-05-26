import { useStore, formatINR } from '../store'
import InsurancePolicyCard from '../components/InsurancePolicyCard'

interface KpiCardProps {
  label: string
  value: string
  tone: 'blue' | 'purple' | 'rose' | 'amber'
  icon: string
}

function KpiCard({ label, value, tone, icon }: KpiCardProps) {
  const toneMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    rose: 'text-rose-400 bg-rose-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  }
  const textColor = toneMap[tone].split(' ')[0]
  const bgColor = toneMap[tone].split(' ')[1]
  return (
    <div className={`rounded-xl p-4 ${bgColor}`}>
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">{label}</div>
      <div className={`text-lg font-mono font-bold ${textColor}`}>{value}</div>
    </div>
  )
}

export default function Insurance() {
  const policies = useStore((s) => s.policies)

  const activePolicies = policies.filter((p) => p.status === 'active')
  const lifeCover = policies
    .filter((p) => p.policyType === 'term' || p.policyType === 'ulip')
    .reduce((s, p) => s + p.coverAmount, 0)
  const healthCover = policies
    .filter((p) => p.policyType === 'health')
    .reduce((s, p) => s + p.coverAmount, 0)
  const annualPremium = policies
    .filter((p) => p.status === 'active')
    .reduce((s, p) => {
      if (p.premiumFrequency === 'annually') return s + p.premiumAmount
      if (p.premiumFrequency === 'quarterly') return s + p.premiumAmount * 4
      return s + p.premiumAmount * 12
    }, 0)

  const upcomingCount = policies.filter((p) => {
    const d = Math.round(
      (new Date(p.nextPremiumDate).getTime() - new Date('2026-05-25').getTime()) / 86400000,
    )
    return d >= 0 && d <= 30
  }).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Insurance</h1>
        <div className="text-sm text-slate-400 mt-0.5">Policy overview & premium tracking</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Active Policies" value={String(activePolicies.length)} tone="blue" icon="🛡️" />
        <KpiCard label="Life Cover" value={formatINR(lifeCover)} tone="purple" icon="🛡️" />
        <KpiCard label="Health Cover" value={formatINR(healthCover)} tone="rose" icon="🏥" />
        <KpiCard label="Annual Premium" value={formatINR(annualPremium)} tone="amber" icon="💰" />
      </div>

      {upcomingCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-lg">⚠️</span>
          <div>
            <div className="text-sm font-semibold text-amber-300">
              {upcomingCount} premium{upcomingCount > 1 ? 's' : ''} due within 30 days
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Ensure timely payment to keep policies active
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          All Policies
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {policies.map((policy) => (
            <InsurancePolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </div>
    </div>
  )
}
