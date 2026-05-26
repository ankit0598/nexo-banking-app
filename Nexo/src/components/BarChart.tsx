import { formatINR } from '../store'

interface BarChartProps {
  data: { label: string; value: number }[]
  height?: number
  color?: string
}

export default function BarChart({ data, height = 220, color = '#3b82f6' }: BarChartProps) {
  if (data.length === 0) return null
  const max = Math.max(...data.map((d) => d.value)) || 1
  const width = 600
  const padding = { top: 20, right: 16, bottom: 28, left: 16 }
  const innerW = width - padding.left - padding.right
  const innerH = height - padding.top - padding.bottom
  const barW = innerW / data.length
  const gap = barW * 0.25

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* gridlines */}
      {[0.25, 0.5, 0.75, 1].map((t) => (
        <line
          key={t}
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + innerH * (1 - t)}
          y2={padding.top + innerH * (1 - t)}
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 4"
        />
      ))}
      {data.map((d, i) => {
        const h = (d.value / max) * innerH
        const x = padding.left + i * barW + gap / 2
        const y = padding.top + innerH - h
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW - gap}
              height={h}
              rx="4"
              fill="url(#bar-grad)"
            />
            <text
              x={x + (barW - gap) / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#cbd5e1"
              fontFamily="JetBrains Mono, monospace"
            >
              {formatINR(d.value)}
            </text>
            <text
              x={x + (barW - gap) / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#94a3b8"
            >
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
