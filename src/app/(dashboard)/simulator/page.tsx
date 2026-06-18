'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Sparkles, 
  Trees, 
  AlertCircle,
  Loader
} from 'lucide-react'
import { getSimulatorBaseline, saveSimulationRun } from '@/server/actions/simulator'

interface Breakdown {
  transportation: number
  energy: number
  diet: number
  shopping: number
  waste: number
}

interface Scenario {
  id: string
  name: string
  desc: string
  category: 'diet' | 'energy' | 'transportation' | 'waste'
  calculateSavings: (breakdown: Breakdown) => number
}

const SCENARIOS: Scenario[] = [
  {
    id: 'vegan_diet',
    name: 'Shift to Plant-Based Diet',
    desc: 'Replace dairy and meats with vegetable proteins, dropping diet emissions to the lowest category tier.',
    category: 'diet',
    calculateSavings: (b) => Math.max(0, b.diet - 600)
  },
  {
    id: 'led_transition',
    name: 'Transition Home to LED Bulbs',
    desc: 'Swap traditional incandescent lighting for energy-efficient LEDs to decrease electrical waste.',
    category: 'energy',
    calculateSavings: () => 150
  },
  {
    id: 'electric_car',
    name: 'Commute by Electric Vehicle (EV)',
    desc: 'Swap standard gas commutes for zero-emission EV transit, cutting car travel emissions by 75%.',
    category: 'transportation',
    calculateSavings: (b) => Math.round(b.transportation * 0.75)
  },
  {
    id: 'smart_thermostat',
    name: 'Program Smart Thermostat',
    desc: 'Optimize heating/cooling cycles for away and sleeping hours, cutting baseline gas emissions.',
    category: 'energy',
    calculateSavings: (b) => Math.round(b.energy * 0.20)
  },
  {
    id: 'solar_panels',
    name: 'Install Rooftop Solar Panels',
    desc: 'Offset primary grid consumption with clean local solar electricity generation.',
    category: 'energy',
    calculateSavings: (b) => Math.round(b.energy * 0.60)
  },
  {
    id: 'waste_sorting',
    name: 'Adopt Composting & Sorting',
    desc: 'Compost organic scraps and sort metals/plastics to divert waste from greenhouse gas emitting landfills.',
    category: 'waste',
    calculateSavings: () => 200
  }
]

interface BaselineData {
  baselineCo2e: number
  goalId: string | null
  targetCo2e: number | null
  breakdown: Breakdown
}

export default function SimulatorPage() {
  const router = useRouter()
  const [baseline, setBaseline] = useState<BaselineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [toggledIds, setToggledIds] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isAdopting, setIsAdopting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [adoptSuccess, setAdoptSuccess] = useState(false)
  const [error, setError] = useState('')

  // 1. Fetch user's baseline carbon stats on mount
  useEffect(() => {
    getSimulatorBaseline().then((res) => {
      if (res) {
        setBaseline(res)
      }
      setLoading(false)
    })
  }, [])

  // 2. Re-calculate projections on scenario toggles (direct computation during render)
  let projected = baseline ? baseline.baselineCo2e : 0
  if (baseline) {
    let savings = 0
    toggledIds.forEach(id => {
      const scenario = SCENARIOS.find(s => s.id === id)
      if (scenario) {
        savings += scenario.calculateSavings(baseline.breakdown)
      }
    })
    projected = Math.max(400, baseline.baselineCo2e - savings)
  }

  const handleToggle = (id: string) => {
    setToggledIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Action: Save Scenario Projections
  const handleSaveRun = async () => {
    if (!baseline) return
    setIsSaving(true)
    setError('')
    try {
      const res = await saveSimulationRun(baseline.baselineCo2e, projected, toggledIds)
      if (res.success) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 2000)
      } else {
        setError(res.error || 'Failed to save scenario run.')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setIsSaving(false)
    }
  }

  // Action: Adopt Actions as active Carbon Reduction Plan
  const handleAdoptPlan = async () => {
    if (!baseline || !baseline.goalId) {
      setError('An active carbon goal is required to generate a reduction plan. Log a footprint baseline to set a goal!')
      return
    }
    setIsAdopting(true)
    setError('')
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goalId: baseline.goalId })
      })
      const data = await res.json()
      if (data.success) {
        setAdoptSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1500)
      } else {
        setError(data.error || 'Failed to adopt plan')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setIsAdopting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size={32} className="animate-spin text-emerald-400" />
        <span className="text-xs text-muted-foreground mt-4">Analyzing carbon profiles...</span>
      </div>
    )
  }

  // If no baseline footprints are found in DB, show empty state helper
  if (!baseline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Simulator Locked</h1>
          <p className="text-muted-foreground text-sm font-light">
            You must calculate your baseline footprint in the Calculator first before running &ldquo;what-if&rdquo; impact scenarios.
          </p>
        </div>
        <button
          onClick={() => router.push('/calculator')}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm cursor-pointer shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Go to Calculator
        </button>
      </div>
    )
  }

  const savingsKg = baseline.baselineCo2e - projected
  const treesOffset = Math.round(savingsKg / 22)
  const goalProgressPct = baseline.targetCo2e
    ? Math.max(0, Math.min(100, Math.round(((baseline.baselineCo2e - projected) / (baseline.baselineCo2e - baseline.targetCo2e)) * 100)))
    : 0

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Impact Simulator</h1>
          <p className="text-muted-foreground text-sm font-light">Toggle reduction scenarios to project your prospective carbon savings.</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleSaveRun}
            disabled={isSaving || saveSuccess}
            className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 text-xs font-semibold text-white cursor-pointer active:scale-95 transition-all"
          >
            {saveSuccess ? 'Scenario Saved!' : isSaving ? 'Saving...' : 'Save Run'}
          </button>

          <button
            onClick={handleAdoptPlan}
            disabled={isAdopting || adoptSuccess}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer active:scale-95 transition-all"
          >
            {adoptSuccess ? 'Plan Adopted!' : isAdopting ? 'Compiling Plan...' : 'Adopt as Action Plan'}
            <Sparkles size={12} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-medium max-w-lg">
          {error}
        </div>
      )}

      {/* Grid panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Scenario Selectors */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-border lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">&ldquo;What-If&rdquo; Scenarios</h3>
            <p className="text-muted-foreground text-xs font-light">Toggle options to build your reduction strategy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCENARIOS.map((item) => {
              const isToggled = toggledIds.includes(item.id)
              const savings = item.calculateSavings(baseline.breakdown)
              return (
                <button
                  key={item.id}
                  onClick={() => handleToggle(item.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between h-[150px] ${
                    isToggled
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="block font-bold text-sm text-white">{item.name}</span>
                    <span className="block text-[11px] font-light leading-relaxed">{item.desc}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">{item.category}</span>
                    <span className="text-xs font-extrabold text-emerald-400">-{savings} kg CO2e</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Projection Indicators */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Projected Impact</h3>
            <p className="text-muted-foreground text-xs font-light">Calculated impact metrics based on toggled inputs</p>
          </div>

          {/* Visual scores */}
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Baseline:</span>
                <span className="text-white font-bold">{(baseline.baselineCo2e / 1000).toFixed(2)} tons</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Projected:</span>
                <span className="text-emerald-400 font-extrabold">{(projected / 1000).toFixed(2)} tons</span>
              </div>
              {baseline.targetCo2e && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Target Goal:</span>
                  <span className="text-white font-bold">{(baseline.targetCo2e / 1000).toFixed(2)} tons</span>
                </div>
              )}
            </div>

            {/* Savings equivalence info */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Trees size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Equivalency Offset</h4>
                <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                  These changes offset the same CO2e as planting <span className="text-emerald-400 font-semibold">{treesOffset} mature trees</span>.
                </p>
              </div>
            </div>

            {/* Goal Progress Projection Meter */}
            {baseline.targetCo2e && (
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-white font-bold">Projected Goal Completion</span>
                  <span className="text-emerald-400 font-extrabold">{goalProgressPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
                    style={{ width: `${goalProgressPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-light">
                  This projected path meets {goalProgressPct}% of your carbon reduction goal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
