import { useState, useMemo } from 'react'
import { useStore, formatINR } from '../store'

// ─── SIP Projection Chart ──────────────────────────────────────────────────────

interface ProjectionPoint {
  year: number
  corpus: number
}

function ProjectionChart({ points, color }: { points: ProjectionPoint[]; color: string }) {
  if (points.length < 2) return null
  const W = 400
  const H = 140
  const PAD = { top: 12, right: 12, bottom: 28, left: 56 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const maxVal = Math.max(...points.map((p) => p.corpus), 1)
  const xScale = (i: number) => PAD.left + (i / (points.length - 1)) * innerW
  const yScale = (v: number) => PAD.top + innerH - (v / maxVal) * innerH

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(p.corpus)}`)
    .join(' ')
  const fillD = `${pathD} L ${xScale(points.length - 1)} ${H - PAD.bottom} L ${PAD.left} ${H - PAD.bottom} Z`

  const yLabels = [0, 0.5, 1].map((f) => ({
    v: maxVal * f,
    y: yScale(maxVal * f),
  }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Y grid */}
      {yLabels.map(({ v, y }) => (
        <g key={y}>
          <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#64748b">
            {v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${(v / 1000).toFixed(0)}K`}
          </text>
        </g>
      ))}
      {/* Area fill */}
      <path d={fillD} fill={color} fillOpacity="0.12" />
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* X labels */}
      {points
        .filter((_, i) => i % Math.max(1, Math.floor(points.length / 5)) === 0 || i === points.length - 1)
        .map((p, _, arr) => {
          const idx = points.indexOf(p)
          return (
            <text key={p.year} x={xScale(idx)} y={H - 4} textAnchor="middle" fontSize="9" fill="#64748b">
              {p.year}
            </text>
          )
        })}
    </svg>
  )
}

// ─── Main Screen ───────────────────────────────────────────────────────────────

export default function Scenarios() {
  const sips = useStore((s) => s.sips)
  const loans = useStore((s) => s.loans)
  const transactions = useStore((s) => s.transactions)
  const goals = useStore((s) => s.goals)

  // ── Scenario 1: SIP Booster ────────────────────────────────────────────────
  const [extraSIP, setExtraSIP] = useState(5000)
  const [targetGoalId, setTargetGoalId] = useState(goals[0]?.id ?? '')
  const currentSIPTotal = sips.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.amount, 0)
  const newSIPTotal = currentSIPTotal + extraSIP
  const annualReturn = 0.12

  const targetGoal = goals.find((g) => g.id === targetGoalId)
  const targetAmount = targetGoal?.targetAmount ?? 2500000

  // Project corpus over 30 years
  const projectionPoints: ProjectionPoint[] = useMemo(() => {
    const baseYear = 2026
    return Array.from({ length: 31 }, (_, i) => {
      const months = i * 12
      const corpus = newSIPTotal * ((Math.pow(1 + annualReturn / 12, months) - 1) / (annualReturn / 12))
      return { year: baseYear + i, corpus: Math.round(corpus) }
    })
  }, [newSIPTotal])

  const targetHitYear = projectionPoints.find((p) => p.corpus >= targetAmount)?.year ?? null
  const currentHitYear = (() => {
    const baseYear = 2026
    for (let i = 0; i <= 30; i++) {
      const months = i * 12
      const corpus = currentSIPTotal * ((Math.pow(1 + annualReturn / 12, months) - 1) / (annualReturn / 12))
      if (corpus >= targetAmount) return baseYear + i
    }
    return null
  })()
  const yearsSaved = currentHitYear && targetHitYear ? currentHitYear - targetHitYear : null

  // ── Scenario 2: Spending Cut ───────────────────────────────────────────────
  const [cutPct, setCutPct] = useState(20)
  const TODAY = new Date('2026-05-25T10:30:00+05:30')
  const last30Start = new Date(TODAY)
  last30Start.setDate(last30Start.getDate() - 30)
  const discretionaryCategories = ['food', 'entertainment', 'shopping']
  const discretionarySpend = transactions
    .filter((t) => {
      const td = new Date(t.date)
      return t.type === 'debit' && td >= last30Start && discretionaryCategories.includes(t.category)
    })
    .reduce((s, t) => s + t.amount, 0)
  const monthlySaving = Math.round(discretionarySpend * (cutPct / 100))
  const annualSaving = monthlySaving * 12
  const extraCorpusIn10 = Math.round(
    monthlySaving * ((Math.pow(1 + annualReturn / 12, 120) - 1) / (annualReturn / 12)),
  )

  // ── Scenario 3: Loan Prepayment ────────────────────────────────────────────
  const homeLoan = loans.find((l) => l.loanType === 'home' && l.status === 'active')
  const [prepayment, setPrepayment] = useState(100000)
  let monthsSaved = 0
  let interestSaved = 0

  if (homeLoan) {
    const r = homeLoan.interestRate / 100 / 12
    const P = homeLoan.outstandingBalance
    const emi = homeLoan.emiAmount
    const originalTenure = homeLoan.remainingTenure

    // Remaining months without prepayment
    const originalMonths = originalTenure

    // After prepayment: new outstanding
    const newOutstanding = Math.max(0, P - prepayment)
    const newMonths =
      newOutstanding > 0 && r > 0
        ? Math.ceil(Math.log(emi / (emi - r * newOutstanding)) / Math.log(1 + r))
        : 0

    monthsSaved = originalMonths - newMonths
    interestSaved = Math.max(0, Math.round(monthsSaved * emi - prepayment))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Scenario Modeller</h1>
        <p className="text-sm text-slate-400 mt-1">What-if analysis to supercharge your financial decisions</p>
      </div>

      {/* ── Scenario 1 ──────────────────────────────────────────────────────── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-lg">📈</span>
          <h2 className="text-base font-semibold text-white">SIP Booster</h2>
          <span className="ml-auto text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">
            Scenario 1
          </span>
        </div>
        <p className="text-xs text-slate-400">If I invest more monthly, when will I reach my goal?</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400">Extra monthly SIP</label>
              <div className="flex items-center gap-3 mt-1.5">
                <input
                  type="range"
                  min={1000}
                  max={25000}
                  step={1000}
                  value={extraSIP}
                  onChange={(e) => setExtraSIP(Number(e.target.value))}
                  className="flex-1 accent-emerald-500"
                />
                <span className="font-mono font-bold text-emerald-400 w-24 text-right text-sm">{formatINR(extraSIP)}/mo</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400">Target goal</label>
              <select
                value={targetGoalId}
                onChange={(e) => setTargetGoalId(e.target.value)}
                className="mt-1.5 w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/60"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id} style={{ background: '#0f172a' }}>
                    {g.name} — {formatINR(g.targetAmount)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-slate-400">Current SIP</p>
                <p className="font-mono font-bold text-white text-lg mt-1">{formatINR(currentSIPTotal)}</p>
                <p className="text-xs text-slate-500 mt-0.5">{currentHitYear ? `Hits goal: ${currentHitYear}` : 'Goal unreachable in 30y'}</p>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-3">
                <p className="text-xs text-emerald-300">New SIP</p>
                <p className="font-mono font-bold text-emerald-400 text-lg mt-1">{formatINR(newSIPTotal)}</p>
                <p className="text-xs text-emerald-600 mt-0.5">{targetHitYear ? `Hits goal: ${targetHitYear}` : 'Goal unreachable in 30y'}</p>
              </div>
            </div>
            {yearsSaved !== null && yearsSaved > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 text-sm text-emerald-300 font-semibold">
                🎯 Reach goal {yearsSaved} year{yearsSaved > 1 ? 's' : ''} earlier!
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-2">30-year corpus projection (at 12% p.a.)</p>
            <ProjectionChart points={projectionPoints} color="#10b981" />
          </div>
        </div>
      </div>

      {/* ── Scenario 2 ──────────────────────────────────────────────────────── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 text-lg">✂️</span>
          <h2 className="text-base font-semibold text-white">Spending Cut</h2>
          <span className="ml-auto text-xs bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full">
            Scenario 2
          </span>
        </div>
        <p className="text-xs text-slate-400">If I cut discretionary spending, how much more do I save?</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400">
              Cut food + entertainment + shopping by
            </label>
            <div className="flex items-center gap-3 mt-1.5">
              <input
                type="range"
                min={5}
                max={60}
                step={5}
                value={cutPct}
                onChange={(e) => setCutPct(Number(e.target.value))}
                className="flex-1 accent-amber-500"
              />
              <span className="font-mono font-bold text-amber-400 w-12 text-right text-sm">{cutPct}%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-xs text-slate-400">Discretionary (30d)</p>
              <p className="font-mono font-bold text-white text-base mt-1">{formatINR(discretionarySpend)}</p>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-3">
              <p className="text-xs text-amber-300">Extra savings/mo</p>
              <p className="font-mono font-bold text-amber-400 text-base mt-1">{formatINR(monthlySaving)}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatINR(annualSaving)}/yr</p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-3">
              <p className="text-xs text-blue-300">If re-invested (10y)</p>
              <p className="font-mono font-bold text-blue-400 text-base mt-1">{formatINR(extraCorpusIn10)}</p>
              <p className="text-xs text-slate-500 mt-0.5">@ 12% p.a.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scenario 3 ──────────────────────────────────────────────────────── */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-lg">🏠</span>
          <h2 className="text-base font-semibold text-white">Loan Prepayment</h2>
          <span className="ml-auto text-xs bg-blue-500/15 text-blue-400 px-2 py-0.5 rounded-full">
            Scenario 3
          </span>
        </div>
        <p className="text-xs text-slate-400">
          If I make a lump-sum prepayment on my home loan, how many EMIs do I save?
        </p>

        {homeLoan ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-slate-400">Outstanding</p>
                <p className="font-mono font-semibold text-white text-sm mt-1">{formatINR(homeLoan.outstandingBalance)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-slate-400">Monthly EMI</p>
                <p className="font-mono font-semibold text-white text-sm mt-1">{formatINR(homeLoan.emiAmount)}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-slate-400">Remaining</p>
                <p className="font-mono font-semibold text-white text-sm mt-1">{homeLoan.remainingTenure} mo</p>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400">Lump-sum prepayment amount</label>
              <div className="flex items-center gap-3 mt-1.5">
                <input
                  type="range"
                  min={50000}
                  max={1000000}
                  step={50000}
                  value={prepayment}
                  onChange={(e) => setPrepayment(Number(e.target.value))}
                  className="flex-1 accent-blue-500"
                />
                <span className="font-mono font-bold text-blue-400 w-24 text-right text-sm">{formatINR(prepayment)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 rounded-lg p-4">
                <p className="text-xs text-blue-300">EMIs saved</p>
                <p className="font-mono font-bold text-blue-400 text-2xl mt-1">{monthsSaved}</p>
                <p className="text-xs text-slate-500 mt-0.5">months off your tenure</p>
              </div>
              <div className="bg-emerald-500/10 rounded-lg p-4">
                <p className="text-xs text-emerald-300">Interest saved</p>
                <p className="font-mono font-bold text-emerald-400 text-2xl mt-1">{formatINR(interestSaved)}</p>
                <p className="text-xs text-slate-500 mt-0.5">net of prepayment</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500 py-4 text-center">No active home loan found.</p>
        )}
      </div>
    </div>
  )
}
