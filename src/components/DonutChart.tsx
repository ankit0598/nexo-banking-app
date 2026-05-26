import { formatINR } from '../store'

interface DonutChartProps {
  data: { label: string; value: number; color: string }[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string
}

export default function DonutChart({
  data,
  size = 200,
  thickness = 26,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1
  const radius = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  let offset = 0
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={thickness} />
        {data.map((d) => {
          const frac = d.value / total
          const dash = frac * circumference
          const el = (
            <circle
              key={d.label}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          )
          offset += dash
          return el
        })}
        {centerValue && (
          <text x={cx} y={cy - 4} textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="JetBrains Mono, monospace">
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="10">
            {centerLabel}
          </text>
        )}
      </svg>
      <div className="flex flex-col gap-2 min-w-[180px]">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-slate-300 capitalize">{d.label}</span>
            </div>
            <span className="font-mono text-white">{formatINR(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
