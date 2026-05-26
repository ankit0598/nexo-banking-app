interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  fillFrom?: string
}

export default function Sparkline({
  data,
  width = 280,
  height = 80,
  stroke = '#60a5fa',
  fillFrom = '#3b82f6',
}: SparklineProps) {
  if (data.length === 0) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1 || 1)
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - 8) - 4
    return [x, y] as const
  })
  const path = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  const areaPath = `${path} L${width},${height} L0,${height} Z`
  const gradId = `spark-grad-${Math.random().toString(36).slice(2, 8)}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillFrom} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fillFrom} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.length > 0 && (
        <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="3" fill={stroke} />
      )}
    </svg>
  )
}
