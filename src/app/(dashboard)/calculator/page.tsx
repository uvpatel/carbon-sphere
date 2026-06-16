'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Leaf, 
  Info,
  Car,
  Lightbulb,
  Utensils,
  ShoppingBag,
  Trash2
} from 'lucide-react'
import { calculateFootprint, FootprintInput, FootprintCalculationResult } from '@/lib/calculations/engine'
import { saveFootprint } from '@/server/actions/calculator'

const STEPS = [
  { id: 'transportation', name: 'Transportation', icon: Car },
  { id: 'energy', name: 'Household Energy', icon: Lightbulb },
  { id: 'diet', name: 'Dietary Habits', icon: Utensils },
  { id: 'shopping', name: 'Shopping & Consumption', icon: ShoppingBag },
  { id: 'waste', name: 'Waste & Recycling', icon: Trash2 },
]

const DEFAULT_VALUES: FootprintInput = {
  transportation: { carType: 'none', kmPerWeek: 0, flightsPerYear: 0 },
  energy: { electricityKwh: 0, heatingSource: 'solar' },
  diet: { type: 'vegetarian' },
  shopping: { monthlySpend: 0 },
  waste: { recycleEnabled: false, compostEnabled: false }
}

const DEMO_VALUES: FootprintInput = {
  transportation: { carType: 'petrol', kmPerWeek: 250, flightsPerYear: 2 },
  energy: { electricityKwh: 380, heatingSource: 'gas' },
  diet: { type: 'meat-medium' },
  shopping: { monthlySpend: 500 },
  waste: { recycleEnabled: true, compostEnabled: true }
}

export default function CalculatorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formValues, setFormValues] = useState<FootprintInput>(DEFAULT_VALUES)
  const [runningCalculation, setRunningCalculation] = useState<FootprintCalculationResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // 1. Calculate running breakdown on changes
  useEffect(() => {
    const res = calculateFootprint(formValues)
    setRunningCalculation(res)
  }, [formValues])

  const handleFillDemo = () => {
    setFormValues(DEMO_VALUES)
    setCurrentStep(4) // Skip directly to last step for review or keep current step
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')
    try {
      const res = await saveFootprint(formValues)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
          router.refresh()
        }, 1500)
      } else {
        setError(res.error || 'Failed to save calculation')
      }
    } catch (e) {
      setError('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const StepIcon = STEPS[currentStep].icon

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Footprint Calculator</h1>
          <p className="text-muted-foreground text-sm font-light">Input your lifestyle data to measure your yearly CO2e footprint.</p>
        </div>

        <button
          onClick={handleFillDemo}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15 font-semibold text-xs transition-all duration-200 cursor-pointer"
        >
          <Sparkles size={14} className="animate-pulse" />
          Fill with Demo Data
        </button>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-2xl overflow-x-auto">
        {STEPS.map((step, idx) => {
          const Icon = step.icon
          const isCurrent = idx === currentStep
          const isCompleted = idx < currentStep
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0 ${
                isCurrent
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                  : isCompleted
                  ? 'text-emerald-500/70 hover:text-emerald-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={14} />
              <span>{step.name}</span>
              {isCompleted && <Check size={12} />}
            </button>
          )
        })}
      </div>

      {/* Grid: Forms vs Real-time Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Wizard Form Area */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-border lg:col-span-2 space-y-6 min-h-[350px] flex flex-col justify-between">
          <div className="space-y-6">
            {/* Step Header */}
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
                <StepIcon size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{STEPS[currentStep].name}</h3>
                <p className="text-xs text-muted-foreground font-light">Step {currentStep + 1} of 5</p>
              </div>
            </div>

            {/* Stepper Inputs */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vehicle Engine Type</label>
                  <select
                    value={formValues.transportation.carType}
                    onChange={(e: any) => setFormValues({
                      ...formValues,
                      transportation: { ...formValues.transportation, carType: e.target.value }
                    })}
                    className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  >
                    <option value="none">No Primary Car (Transit / Bike / Walk)</option>
                    <option value="petrol">Gasoline / Petrol Car</option>
                    <option value="diesel">Diesel Car</option>
                    <option value="hybrid">Hybrid / Mild-Hybrid Car</option>
                    <option value="electric">Battery Electric Vehicle (BEV)</option>
                  </select>
                </div>

                {formValues.transportation.carType !== 'none' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Weekly Distance Driven (in kilometers)</label>
                    <input
                      type="number"
                      min={0}
                      value={formValues.transportation.kmPerWeek || ''}
                      onChange={(e) => setFormValues({
                        ...formValues,
                        transportation: { ...formValues.transportation, kmPerWeek: Math.max(0, parseInt(e.target.value) || 0) }
                      })}
                      className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. 150"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flights Taken Per Year</label>
                  <input
                    type="number"
                    min={0}
                    value={formValues.transportation.flightsPerYear || ''}
                    onChange={(e) => setFormValues({
                      ...formValues,
                      transportation: { ...formValues.transportation, flightsPerYear: Math.max(0, parseInt(e.target.value) || 0) }
                    })}
                    className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="e.g. 4"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Electricity Usage (in kWh)</label>
                  <input
                    type="number"
                    min={0}
                    value={formValues.energy.electricityKwh || ''}
                    onChange={(e) => setFormValues({
                      ...formValues,
                      energy: { ...formValues.energy, electricityKwh: Math.max(0, parseInt(e.target.value) || 0) }
                    })}
                    className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 300"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 font-light">
                    <Info size={12} />
                    <span>Average household consumption is around 300-500 kWh per month.</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Heating Source</label>
                  <select
                    value={formValues.energy.heatingSource}
                    onChange={(e: any) => setFormValues({
                      ...formValues,
                      energy: { ...formValues.energy, heatingSource: e.target.value }
                    })}
                    className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="gas">Natural Gas Furnace</option>
                    <option value="electric">Electrical Heating (Heat Pump / Baseboard)</option>
                    <option value="oil">Heating Oil Boiler</option>
                    <option value="solar">Zero-Emission Solar Offset / Passive Heating</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dietary Habit Profile</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: 'meat-heavy', title: 'Meat Heavy', desc: 'Frequent red meat, poultry, and dairy daily' },
                      { value: 'meat-medium', title: 'Moderate Meat', desc: 'Poultry or fish primarily, occasional red meat' },
                      { value: 'vegetarian', title: 'Vegetarian', desc: 'No meat or fish, regular eggs and dairy' },
                      { value: 'vegan', title: 'Vegan', desc: 'Strictly plant-based meals only' },
                    ].map(item => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setFormValues({
                          ...formValues,
                          diet: { type: item.value as any }
                        })}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                          formValues.diet.type === item.value
                            ? 'bg-emerald-500/10 border-emerald-500 text-white'
                            : 'bg-muted/30 border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="block font-bold text-sm text-white mb-1">{item.title}</span>
                        <span className="block text-xs font-light">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Monthly Consumer Spending (Goods, Clothes, Electronics)</label>
                  <input
                    type="number"
                    min={0}
                    value={formValues.shopping.monthlySpend || ''}
                    onChange={(e) => setFormValues({
                      ...formValues,
                      shopping: { monthlySpend: Math.max(0, parseInt(e.target.value) || 0) }
                    })}
                    className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 200"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1 font-light">
                    <Info size={12} />
                    <span>Includes furniture, apparel, software, and hobbies.</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Household Waste Reductions</label>
                  
                  <button
                    type="button"
                    onClick={() => setFormValues({
                      ...formValues,
                      waste: { ...formValues.waste, recycleEnabled: !formValues.waste.recycleEnabled }
                    })}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all duration-200 ${
                      formValues.waste.recycleEnabled
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-muted/30 border-border text-muted-foreground'
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-sm text-white mb-0.5">Active Recycling</span>
                      <span className="block text-xs font-light">We sort and recycle cardboards, plastics, and metals daily.</span>
                    </div>
                    {formValues.waste.recycleEnabled && <Check size={18} className="text-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormValues({
                      ...formValues,
                      waste: { ...formValues.waste, compostEnabled: !formValues.waste.compostEnabled }
                    })}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all duration-200 ${
                      formValues.waste.compostEnabled
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-muted/30 border-border text-muted-foreground'
                    }`}
                  >
                    <div>
                      <span className="block font-bold text-sm text-white mb-0.5">Organic Composting</span>
                      <span className="block text-xs font-light">Food waste and organic items are composted, diverting from landfills.</span>
                    </div>
                    {formValues.waste.compostEnabled && <Check size={18} className="text-emerald-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-6">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground text-sm font-semibold cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-sm font-semibold cursor-pointer active:scale-95 transition-all"
              >
                Next Step
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || success}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
              >
                {success ? 'Saved!' : isSubmitting ? 'Calculating...' : 'Submit & Save'}
                {success ? <Check size={16} /> : <Leaf size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Real-time Calculator Running Status */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Running Calculations</h3>
            <p className="text-muted-foreground text-xs font-light">Real-time estimations based on inputs</p>
          </div>

          {runningCalculation && (
            <div className="space-y-6">
              {/* Total score meter */}
              <div className="text-center p-6 rounded-xl bg-muted/30 border border-border/50">
                <span className="text-xs uppercase font-semibold tracking-widest text-muted-foreground">Estimated Emissions</span>
                <div className="flex items-baseline justify-center gap-1.5 mt-2">
                  <span className="text-4xl font-extrabold text-white">
                    {(runningCalculation.totalCo2e / 1000).toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">tons / yr</span>
                </div>
              </div>

              {/* Categorized Progress Gauges */}
              <div className="space-y-4">
                {[
                  { name: 'Transportation', value: runningCalculation.breakdown.transportation, color: 'bg-emerald-500' },
                  { name: 'Energy', value: runningCalculation.breakdown.energy, color: 'bg-blue-500' },
                  { name: 'Diet', value: runningCalculation.breakdown.diet, color: 'bg-amber-500' },
                  { name: 'Shopping', value: runningCalculation.breakdown.shopping, color: 'bg-purple-500' },
                  { name: 'Waste', value: runningCalculation.breakdown.waste, color: 'bg-red-500' },
                ].map(item => {
                  const maxVal = Math.max(...Object.values(runningCalculation.breakdown), 1000)
                  const pct = Math.max(0, Math.min(100, Math.round((item.value / maxVal) * 100)))
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="text-white">{item.value.toLocaleString()} kg</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-300`} 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs text-center text-destructive font-medium border border-destructive/20 bg-destructive/10 px-4 py-2.5 rounded-lg animate-shake">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
