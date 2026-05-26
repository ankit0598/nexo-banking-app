import { useStore } from '../store'

function scoreColor(score: number) {
  if (score >= 75) return { text: 'text-emerald-400', bg: 'bg-emerald-500', stroke: '#10b981', label: 'Excellent', labelBg: 'bg-emerald-500/15 text-emerald-400' }
  if (score >= 55) return { text: 'text-blue-400', bg: 'bg-blue-500', stroke: '#3b82f6', label: 'Good', labelBg: 'bg-blue-500/15 text-blue-400' }
  if (score >= 35) return { text: 'text-amber-400', bg: 'bg-amber-500', stroke: '#f59e0b', label: 'Fair', labelBg: 'bg-amber-500/15 text-amber-400' }
  return { text: 'text-red-400', bg: 'bg-red-500', stroke: '#ef4444', label: 'Needs Attention', labelBg: 'bg-red-500/15 text-red-400' }
}

interface ScorePillProps {
  label: string
  score: number
  maxScore: number
  color: string
}

function ScorePill({ label, score, maxScore, color }: ScorePillProps) {
  const pct = Math.round((score / maxScore) * 100)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-mono font-semibold text-white">{score}/{maxScore}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function HealthScore() {
  const goals = useStore((s) => s.goals)
  const loans = useStore((s) => s.loans)
  const sips = useStore((s) => s.sips)

  const monthlyIncome = 185000

  // 1. Emergency fund (25 pts)
  const emergencyGoal = goals.find((g) => g.category === 'emergency_fund')
  const emergencyPct = emergencyGoal
    ? Math.min(emergencyGoal.currentAmount / emergencyGoal.targetAmount, 1)
    : 0
  const emergencyScore = Math.round(emergencyPct * 25)

  // 2. Debt ratio (25 pts)
  const monthlyEMI = loans.filter((l) => l.status === 'active').reduce((s, l) => s + l.emiAmount, 0)
  const debtRatio = monthlyEMI / monthlyIncome
  let debtScore = 25
  if (debtRatio > 0.5) debtScore = 0
  else if (debtRatio > 0.4) debtScore = 8
  else if (debtRatio > 0.3) debtScore = 15

  // 3. Investment rate (25 pts)
  const monthlySIP = sips.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.amount, 0)
  const investRate = monthlySIP / monthlyIncome
  let investScore = 5
  if (investRate > 0.2) investScore = 25
  else if (investRate > 0.15) investScore = 20
  else if (investRate > 0.1) investScore = 15
  else if (investRate > 0.05) investScore = 10

  // 4. Goal progress (25 pts)
  const avgProgress =
    goals.length > 0
      ? goals.reduce((sum, g) => sum + Math.min(g.currentAmount / g.targetAmount, 1), 0) /
        goals.length
      : 0
  const goalScore = Math.round(avgProgress * 25)

  const totalScore = emergencyScore + debtScore + investScore + goalScore
  const palette = scoreColor(totalScore)

  // SVG arc for circular gauge
  const radius = 54
  const cx = 70
  const cy = 70
  const strokeWidth = 10
  const circumference = 2 * Math.PI * radius
  // Arc spans from 135° to 405° (270° sweep)
  const sweepAngle = 270
  const startAngle = 135
  const fillAngle = (totalScore / 100) * sweepAngle
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const arcX = (ang: number) => cx + radius * Math.cos(toRad(ang))
  const arcY = (ang: number) => cy + radius * Math.sin(toRad(ang))

  const trackPath = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${radius} ${radius} 0 1 1 ${arcX(startAngle + sweepAngle)} ${arcY(startAngle + sweepAngle)}`
  const fillPath = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${radius} ${radius} 0 ${fillAngle > 180 ? 1 : 0} 1 ${arcX(startAngle + fillAngle)} ${arcY(startAngle + fillAngle)}`

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Financial Health Score</h2>
          <p className="text-xs text-slate-400 mt-0.5">Based on 4 key metrics</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${palette.labelBg}`}>
          {palette.label}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <path
              d={trackPath}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {totalScore > 0 && (
              <path
                d={fillPath}
                fill="none"
                stroke={palette.stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />
            )}
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              className="fill-white"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '28px', fontWeight: 700 }}
            >
              {totalScore}
            </text>
            <text
              x={cx}
              y={cy + 16}
              textAnchor="middle"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fill: '#94a3b8' }}
            >
              out of 100
            </text>
          </svg>
        </div>

        {/* Sub-scores */}
        <div className="flex-1 space-y-3">
          <ScorePill label="Emergency Fund" score={emergencyScore} maxScore={25} color={palette.bg} />
          <ScorePill label="Debt Ratio" score={debtScore} maxScore={25} color={palette.bg} />
          <ScorePill label="Investment Rate" score={investScore} maxScore={25} color={palette.bg} />
          <ScorePill label="Goal Progress" score={goalScore} maxScore={25} color={palette.bg} />
        </div>
      </div>
    </div>
  )
}
