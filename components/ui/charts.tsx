'use client'

import * as React from 'react'

interface ChartProps {
  data: [string, number][]
  xAxis: string
  yAxis: string
  height?: number
}

export function LineChart({ data, xAxis, yAxis, height = 300 }: ChartProps) {
  const maxValue = Math.max(...data.map(([, value]) => value))
  const minValue = Math.min(...data.map(([, value]) => value))
  const padding = 40

  const getY = (value: number) => {
    return height - padding - ((value - minValue) / (maxValue - minValue)) * (height - 2 * padding)
  }

  const points = data.map(([, value], index) => ({
    x: padding + (index * (800 - 2 * padding)) / (data.length - 1),
    y: getY(value)
  }))

  return (
    <div className="w-full overflow-x-auto">
      <svg width="800" height={height} className="text-sm">
        {/* Y-axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" />
        {/* X-axis */}
        <line x1={padding} y1={height - padding} x2={800 - padding} y2={height - padding} stroke="currentColor" />
        
        {/* Data points and lines */}
        <path
          d={`M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`}
          fill="none"
          stroke="rgb(75, 192, 192)"
          strokeWidth="2"
        />
        {points.map((point, i) => (
          <circle key={i} cx={point.x} cy={point.y} r="4" fill="rgb(75, 192, 192)" />
        ))}

        {/* Labels */}
        {data.map(([label], i) => (
          <text
            key={i}
            x={padding + (i * (800 - 2 * padding)) / (data.length - 1)}
            y={height - padding + 20}
            textAnchor="middle"
          >
            {label}
          </text>
        ))}
        <text x={400} y={height - 5} textAnchor="middle">{xAxis}</text>
        <text x={15} y={height / 2} transform={`rotate(-90, 15, ${height / 2})`} textAnchor="middle">
          {yAxis}
        </text>
      </svg>
    </div>
  )
}

export function BarChart({ data, xAxis, yAxis, height = 300 }: ChartProps) {
  const maxValue = Math.max(...data.map(([, value]) => value))
  const padding = 40
  const barWidth = (800 - 2 * padding) / data.length - 10

  return (
    <div className="w-full overflow-x-auto">
      <svg width="800" height={height} className="text-sm">
        {/* Y-axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" />
        {/* X-axis */}
        <line x1={padding} y1={height - padding} x2={800 - padding} y2={height - padding} stroke="currentColor" />
        
        {/* Bars */}
        {data.map(([label, value], i) => {
          const barHeight = ((height - 2 * padding) * value) / maxValue
          const x = padding + i * ((800 - 2 * padding) / data.length)
          return (
            <g key={i}>
              <rect
                x={x}
                y={height - padding - barHeight}
                width={barWidth}
                height={barHeight}
                fill="rgba(75, 192, 192, 0.6)"
              />
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          )
        })}

        {/* Labels */}
        <text x={400} y={height - 5} textAnchor="middle">{xAxis}</text>
        <text x={15} y={height / 2} transform={`rotate(-90, 15, ${height / 2})`} textAnchor="middle">
          {yAxis}
        </text>
      </svg>
    </div>
  )
}

interface PieChartProps {
  data: [string, number][]
  labelKey: string
  valueKey: string
  height?: number
}

export function PieChart({ data, height = 300 }: PieChartProps) {
  const total = data.reduce((sum, [, value]) => sum + value, 0)
  const colors = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)'
  ]

  let currentAngle = 0
  const center = { x: 400, y: height / 2 }
  const radius = Math.min(center.x, center.y) - 60

  return (
    <div className="w-full overflow-x-auto">
      <svg width="800" height={height}>
        {data.map(([label, value], i) => {
          const percentage = value / total
          const angle = percentage * 2 * Math.PI
          const startX = center.x + radius * Math.cos(currentAngle)
          const startY = center.y + radius * Math.sin(currentAngle)
          const endX = center.x + radius * Math.cos(currentAngle + angle)
          const endY = center.y + radius * Math.sin(currentAngle + angle)
          const largeArcFlag = percentage > 0.5 ? 1 : 0

          const labelAngle = currentAngle + angle / 2
          const labelRadius = radius + 30
          const labelX = center.x + labelRadius * Math.cos(labelAngle)
          const labelY = center.y + labelRadius * Math.sin(labelAngle)

          const path = [
            `M ${center.x} ${center.y}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            'Z'
          ].join(' ')

          currentAngle += angle

          return (
            <g key={i}>
              <path d={path} fill={colors[i % colors.length]} />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm"
              >
                {`${label} (${Math.round(percentage * 100)}%)`}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

