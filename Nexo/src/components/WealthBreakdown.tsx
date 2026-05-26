import { useStore, formatINR } from '../store'

const assetClassLabel: Record<string, string> = {
  banking: 'Cash & Banking',
  equity: 'Equity',
  mutual_fund: 'Mutual Funds',
  gold: 'Gold',
  fd: 'Fixed Deposits',
  ppf: 'EPF / PPF',
  property: 'Real Estate',
}

const assetClassColor: Record<string, string> = {
  banking: '#3b82f6',
  equity: '#8b5cf6',
  mutual_fund: '#a78bfa',
  gold: '#f59e0b',
  fd: '#14b8a6',
  ppf: '#10b981',
  property: '#6366f1',
}

interface Slice {
  key: string
  value: number
  color: string
}

export default function WealthBreakdown() {
  const accounts = useStore((s) => s.accounts)
  const holdings = useStore((s) => s.holdings)
  const propertyAssets = useStore((s) => s.propertyAssets)

  const bankingTotal = accounts
    .filter((a) => a.type !== 'credit_card')
    .reduce((sum, a) => sum + a.balance, 0)

  const grouped: Record<string, number> = { banking: bankingTotal }
  for (const h of holdings) {
    grouped[h.assetClass] = (grouped[h.assetClass] || 0) + h.currentValue
  }
  grouped.property = propertyAssets.reduce((sum, p) => sum + p.estimatedValue, 0)

  const slices: Slice[] = Object.entries(grouped)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ key, value, color: assetClassColor[key] || '#64748b' }))
    .sort((a, b) => b.value - a.value)

  const total = slices.reduce((sum, s) => sum + s.value, 0)

  // SVG donut
  const size = 148
  const cx = size / 2
  const cy = size / 2
  const R = 54
  const r = 36

  let angle = -90
  const segments = slices.map((slice) => {
    const pct = slice.value / total
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

    return { ...slice, d, pct }
  })

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="text-sm font-semibold text-white mb-4">Wealth Breakdown</div>
      <div className="flex items-center gap-5">
        <div className="shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg) => (
              <path key={seg.key} d={seg.d} fill={seg.color} opacity={0.9} />
            ))}
            <circle cx={cx} cy={cy} r={r - 2} fill="rgb(2 6 23)" />
            <text
              x={cx}
              y={cy - 3}
              textAnchor="middle"
              fill="white"
              fontSize="10"
              fontWeight="bold"
              fontFamily="'JetBrains Mono', monospace"
            >
              {formatINR(total)}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#64748b" fontSize="8">
              Total Assets
            </text>
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {slices.map((slice) => (
            <div key={slice.key} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <div className="flex-1 text-xs text-slate-400 truncate">
                {assetClassLabel[slice.key] || slice.key}
              </div>
              <div className="text-xs font-mono text-white">{formatINR(slice.value)}</div>
              <div className="text-[10px] font-mono text-slate-500 w-9 text-right">
                {((slice.value / total) * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
