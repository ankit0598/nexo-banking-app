import { useStore, formatINR } from '../store'
import PortfolioHero from '../components/PortfolioHero'
import HoldingRow from '../components/HoldingRow'

const assetClassColor: Record<string, string> = {
  equity: '#8b5cf6',
  mutual_fund: '#a78bfa',
  gold: '#f59e0b',
  fd: '#14b8a6',
  ppf: '#10b981',
}

const assetClassLabel: Record<string, string> = {
  equity: 'Equity',
  mutual_fund: 'Mutual Fund',
  gold: 'Gold',
  fd: 'Fixed Deposit',
  ppf: 'EPF / PPF',
}

function AssetDonut({ size = 160 }: { size?: number }) {
  const holdings = useStore((s) => s.holdings)
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.39
  const r = size * 0.26

  const grouped: Record<string, number> = {}
  for (const h of holdings) {
    grouped[h.assetClass] = (grouped[h.assetClass] || 0) + h.currentValue
  }
  const total = Object.values(grouped).reduce((s, v) => s + v, 0)
  const slices = Object.entries(grouped).filter(([, v]) => v > 0)

  let angle = -90
  const segments = slices.map(([cls, val]) => {
    const pct = val / total
    const startAngle = angle
    angle += pct * 360
    const endAngle = angle
    const toRad = (deg: number) => (deg * Math.PI) / 180
    const x1 = cx + R * Math.cos(toRad(startAngle))
    const y1 = cy + R * Math.sin(toRad(startAngle))
    const x2 = cx + R * Math.cos(toRad(endAngle))
    const y2 = cy + R * Math.sin(toRad(endAngle))
    const ix1 = cx + r * Math.cos(toRad(startAngle))
    const iy1 = cy + r * Math.sin(toRad(startAngle))
    const ix2 = cx + r * Math.cos(toRad(endAngle))
    const iy2 = cy + r * Math.sin(toRad(endAngle))
    const large = pct > 0.5 ? 1 : 0
    const d = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ')
    return { cls, val, pct, d, color: assetClassColor[cls] || '#64748b' }
  })

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg) => (
          <path key={seg.cls} d={seg.d} fill={seg.color} opacity={0.9} />
        ))}
        <circle cx={cx} cy={cy} r={r - 2} fill="rgb(2 6 23)" />
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#94a3b8" fontSize="9">
          Portfolio Mix
        </text>
      </svg>
      <div className="flex-1 space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.cls} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <div className="flex-1 text-xs text-slate-400">{assetClassLabel[seg.cls] || seg.cls}</div>
            <div className="text-xs font-mono text-white">{formatINR(seg.val)}</div>
            <div className="text-[10px] font-mono text-slate-500 w-9 text-right">
              {(seg.pct * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Investments() {
  const holdings = useStore((s) => s.holdings)
  const sips = useStore((s) => s.sips)
  const sortedHoldings = [...holdings].sort((a, b) => b.currentValue - a.currentValue)
  const activeSIPs = sips.filter((s) => s.status === 'active')
  const totalMonthlySIP = activeSIPs
    .filter((s) => s.frequency === 'monthly')
    .reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Investments</h1>
        <div className="text-sm text-slate-400 mt-0.5">Portfolio overview & holdings</div>
      </div>

      <PortfolioHero />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-4">Asset Allocation</div>
          <AssetDonut size={160} />
        </div>

        {/* Active SIPs */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">Active SIPs</div>
            <div className="text-xs text-slate-500">{activeSIPs.length} running</div>
          </div>
          <div className="space-y-3">
            {activeSIPs.map((sip) => {
              const nextDate = new Date(sip.nextDate)
              return (
                <div
                  key={sip.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <div>
                    <div className="text-sm font-medium text-white truncate max-w-[180px]">
                      {sip.name}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {sip.frequency === 'monthly' ? 'Monthly' : 'Quarterly'} · Next:{' '}
                      {nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      {formatINR(sip.amount)}
                    </div>
                    <div className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 mt-1">
                      Active
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-white/5 flex justify-between">
            <span className="text-xs text-slate-500">Total monthly SIP</span>
            <span className="text-sm font-mono font-bold text-white">
              {formatINR(totalMonthlySIP)}/mo
            </span>
          </div>
        </div>
      </div>

      {/* Holdings list */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-semibold text-white">All Holdings</div>
          <div className="text-xs text-slate-500">{holdings.length} positions</div>
        </div>
        <div className="space-y-2">
          {sortedHoldings.map((holding) => (
            <HoldingRow key={holding.id} holding={holding} />
          ))}
        </div>
      </div>
    </div>
  )
}
