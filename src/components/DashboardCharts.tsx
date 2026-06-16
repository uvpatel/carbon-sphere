'use client'

import React from 'react'
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts'

interface ChartsProps {
  latestBreakdown: {
    transportation: number
    energy: number
    diet: number
    shopping: number
    waste: number
  }
  history: Array<{
    date: string
    total: number
  }>
}

const COLORS = {
  transportation: '#10b981', // emerald
  energy: '#3b82f6',         // blue
  diet: '#f59e0b',           // amber
  shopping: '#8b5cf6',       // purple
  waste: '#ef4444'           // red
}

export function DashboardCharts({ latestBreakdown, history }: ChartsProps) {
  // 1. Prepare Donut Data
  const donutData = [
    { name: 'Transportation', value: latestBreakdown.transportation, color: COLORS.transportation },
    { name: 'Energy', value: latestBreakdown.energy, color: COLORS.energy },
    { name: 'Diet', value: latestBreakdown.diet, color: COLORS.diet },
    { name: 'Shopping', value: latestBreakdown.shopping, color: COLORS.shopping },
    { name: 'Waste', value: latestBreakdown.waste, color: COLORS.waste },
  ].filter(item => item.value > 0)

  // 2. Prepare Trend Data (reverse history to show oldest first)
  const lineData = history.map(item => ({
    name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Co2e: Math.round(item.total),
  })).reverse()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Category Breakdown Donut */}
      <div className="glass-card p-6 rounded-2xl border border-border flex flex-col space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Emission Categories</h3>
          <p className="text-muted-foreground text-xs font-light">Annual carbon footprint split in kg CO2e</p>
        </div>
        
        <div className="relative h-[250px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#18181b', borderColor: '#22222a', borderRadius: '12px' }}
                itemStyle={{ color: '#fafafa', fontSize: '12px' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-muted-foreground font-medium">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Screen Reader Hidden Table for WCAG 2.1 AA compliance */}
        <table className="sr-only">
          <caption>Carbon footprint emissions by category (Donut Chart Data)</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Emissions (kg CO2e)</th>
            </tr>
          </thead>
          <tbody>
            {donutData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.value} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Historical Trend Line */}
      <div className="glass-card p-6 rounded-2xl border border-border flex flex-col space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">Historical Progress</h3>
          <p className="text-muted-foreground text-xs font-light">Carbon emission reductions over time</p>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c24" />
              <XAxis 
                dataKey="name" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{ background: '#18181b', borderColor: '#22222a', borderRadius: '12px' }}
                labelStyle={{ color: '#a1a1aa', fontSize: '11px' }}
                itemStyle={{ color: '#10b981', fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="Co2e" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, stroke: '#10b981', strokeWidth: 2, fill: '#09090b' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Screen Reader Hidden Table for WCAG 2.1 AA compliance */}
        <table className="sr-only">
          <caption>Emissions history trend (Line Chart Data)</caption>
          <thead>
            <tr>
              <th scope="col">Calculation Date</th>
              <th scope="col">Total Emissions (kg CO2e)</th>
            </tr>
          </thead>
          <tbody>
            {lineData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.Co2e} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
