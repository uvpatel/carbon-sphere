'use client'

import React, { useState } from 'react'
import { Check, Clock, Trash2, Plus, X } from 'lucide-react'
import { updateActionStatus, addActionToPlan, removeActionFromPlan } from '@/server/actions/plan'

interface Action {
  _id: string
  title: string
  description?: string
  category: string
  difficulty: string
  estimatedSavings: number
  weekToStart: number
  status: string
  completedAt?: string
}

interface Plan {
  _id: string
  title: string
  actions: Action[]
}

interface PlanListProps {
  initialPlan: Plan
}

export function PlanList({ initialPlan }: PlanListProps) {
  const [plan, setPlan] = useState<Plan>(initialPlan)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Add Action form state
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    category: 'Energy',
    difficulty: 'Easy',
    estimatedSavings: '',
    weekToStart: '1'
  })
  const [isAdding, setIsAdding] = useState(false)

  const handleStatusChange = async (actionId: string, nextStatus: 'PENDING' | 'COMPLETED' | 'SKIPPED') => {
    setTogglingId(actionId)
    setError('')
    try {
      const res = await updateActionStatus(plan._id, actionId, nextStatus)
      if (res.success && res.nextStatus) {
        setPlan(prev => {
          const updatedActions = prev.actions.map(act => {
            if (act._id === actionId) {
              return {
                ...act,
                status: res.nextStatus!,
                completedAt: res.nextStatus === 'COMPLETED' ? new Date().toISOString() : undefined
              }
            }
            return act
          })
          return { ...prev, actions: updatedActions }
        })
      } else {
        setError(res.error || 'Failed to update action status')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (actionId: string) => {
    if (!confirm('Are you sure you want to remove this action from your plan?')) return
    setDeletingId(actionId)
    setError('')
    try {
      const res = await removeActionFromPlan(plan._id, actionId)
      if (res.success && res.plan) {
        setPlan(res.plan)
      } else {
        setError(res.error || 'Failed to delete action')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAction.title.trim() || !newAction.estimatedSavings || !newAction.weekToStart) {
      setError('Please fill in all required fields.')
      return
    }
    setIsAdding(true)
    setError('')
    try {
      const res = await addActionToPlan(plan._id, {
        title: newAction.title,
        description: newAction.description,
        category: newAction.category,
        difficulty: newAction.difficulty,
        estimatedSavings: Number(newAction.estimatedSavings),
        weekToStart: Number(newAction.weekToStart)
      })
      if (res.success && res.plan) {
        setPlan(res.plan)
        setNewAction({
          title: '',
          description: '',
          category: 'Energy',
          difficulty: 'Easy',
          estimatedSavings: '',
          weekToStart: '1'
        })
        setShowAddForm(false)
      } else {
        setError(res.error || 'Failed to add action')
      }
    } catch {
      setError('An unexpected error occurred.')
    } finally {
      setIsAdding(false)
    }
  }

  // Sort actions by weekToStart
  const sortedActions = [...plan.actions].sort((a, b) => a.weekToStart - b.weekToStart)

  const completedCount = plan.actions.filter(a => a.status === 'COMPLETED').length
  const totalSavings = plan.actions
    .filter(a => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + a.estimatedSavings, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Timeline Checklist */}
      <div className="lg:col-span-2 space-y-6">
        {error && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="relative border-l border-border/80 pl-6 ml-4 space-y-8">
          {sortedActions.map((action) => {
            const isCompleted = action.status === 'COMPLETED'
            const isSkipped = action.status === 'SKIPPED'
            const isToggling = togglingId === action._id

            // Difficulty styles
            const diffColor = 
              action.difficulty.toLowerCase() === 'easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' :
              action.difficulty.toLowerCase() === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/15' :
              'bg-red-500/10 text-red-400 border-red-500/15'

            return (
              <div key={action._id} className="relative group">
                {/* Timeline Dot Indicator */}
                <div className={`absolute -left-[35px] top-1 flex items-center justify-center w-6 h-6 rounded-full border transition-colors duration-200 z-10 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500 text-black' 
                    : isSkipped
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-500'
                    : 'bg-card border-border text-muted-foreground group-hover:border-zinc-500'
                }`}>
                  {isCompleted ? (
                    <Check size={12} strokeWidth={3} />
                  ) : isSkipped ? (
                    <X size={10} strokeWidth={3} />
                  ) : (
                    <span className="text-[10px]">{action.weekToStart}</span>
                  )}
                </div>

                <div className={`glass-card p-5 rounded-2xl border transition-all duration-300 ${
                  isCompleted 
                    ? 'border-border/30 opacity-70 bg-muted/5' 
                    : isSkipped
                    ? 'border-dashed border-zinc-800 opacity-50 bg-muted/5'
                    : 'border-border hover:border-zinc-800'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground uppercase border border-border/50">
                          Week {action.weekToStart}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${
                          isSkipped 
                            ? 'bg-zinc-800/50 text-zinc-500 border-zinc-700/30' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10'
                        }`}>
                          {action.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border ${diffColor}`}>
                          {action.difficulty}
                        </span>
                        {isSkipped && (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-semibold text-zinc-500 uppercase border border-border/50">
                            Skipped
                          </span>
                        )}
                      </div>

                      <h3 className={`text-sm font-bold text-white transition-all ${
                        isCompleted ? 'line-through text-muted-foreground' : isSkipped ? 'line-through text-zinc-500' : ''
                      }`}>
                        {action.title}
                      </h3>
                      
                      {action.description && (
                        <p className={`text-xs font-light leading-relaxed max-w-xl ${
                          isSkipped ? 'text-zinc-600' : 'text-muted-foreground'
                        }`}>
                          {action.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-3">
                      <span className={`text-xs font-bold shrink-0 ${isSkipped ? 'text-zinc-500' : 'text-emerald-400'}`}>
                        -{action.estimatedSavings} kg CO2e
                      </span>

                      <div className="flex items-center gap-2">
                        {isToggling ? (
                          <div className="w-4 h-4 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin" />
                        ) : isCompleted ? (
                          <button
                            onClick={() => handleStatusChange(action._id, 'PENDING')}
                            className="px-3 py-1.5 rounded-lg border border-border bg-zinc-800 hover:bg-zinc-700 text-muted-foreground text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                          >
                            Reset
                          </button>
                        ) : isSkipped ? (
                          <button
                            onClick={() => handleStatusChange(action._id, 'PENDING')}
                            className="px-3 py-1.5 rounded-lg border border-border bg-zinc-800 hover:bg-zinc-700 text-muted-foreground text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                          >
                            Restore
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStatusChange(action._id, 'COMPLETED')}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(action._id, 'SKIPPED')}
                              className="px-3 py-1.5 rounded-lg border border-border hover:bg-zinc-800 text-muted-foreground text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                            >
                              Skip
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleDelete(action._id)}
                          disabled={deletingId === action._id}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 cursor-pointer transition-all disabled:opacity-50"
                          title="Delete Action"
                        >
                          {deletingId === action._id ? (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Column sticky pane */}
      <div className="space-y-6 sticky top-6">
        {/* Summary Scorecard */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white">Plan Summary</h3>
            <p className="text-muted-foreground text-xs font-light">Your progress tracking overview</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Actions Completed</span>
              <span className="text-sm font-bold text-white">{completedCount} / {plan.actions.length}</span>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Total Plan Savings</span>
              <span className="text-sm font-bold text-emerald-400">-{totalSavings.toLocaleString()} kg CO2e</span>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                <Clock size={18} />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">Timeline Guidance</h4>
                <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                  Aim to initiate actions week-by-week. Checking off completed items immediately re-calibrates your active dashboard goal progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Custom Action Form */}
        <div className="glass-card p-6 rounded-2xl border border-border space-y-4">
          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="w-full flex items-center justify-between py-1 text-xs font-bold text-white cursor-pointer group outline-none"
          >
            <span className="flex items-center gap-2">
              <Plus size={14} className="text-emerald-400 group-hover:rotate-90 transition-transform duration-200" />
              Add Custom Action
            </span>
            <span className="text-[10px] text-muted-foreground font-normal">
              {showAddForm ? 'Hide Form' : 'Show Form'}
            </span>
          </button>

          {showAddForm && (
            <form onSubmit={handleAddSubmit} className="space-y-4 pt-4 border-t border-border/50">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Action Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wash laundry at 30°C"
                  value={newAction.title}
                  onChange={e => setNewAction(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border focus:border-emerald-500/50 outline-none text-xs text-white placeholder-muted-foreground/60 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Description</label>
                <textarea
                  placeholder="Optional implementation notes..."
                  value={newAction.description}
                  onChange={e => setNewAction(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border focus:border-emerald-500/50 outline-none text-xs text-white placeholder-muted-foreground/60 transition-colors h-16 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Category</label>
                  <select
                    value={newAction.category}
                    onChange={e => setNewAction(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border focus:border-emerald-500/50 outline-none text-xs text-white [&>option]:bg-zinc-950 transition-colors cursor-pointer"
                  >
                    <option value="Energy">Energy</option>
                    <option value="Diet">Diet</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Waste">Waste</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Difficulty</label>
                  <select
                    value={newAction.difficulty}
                    onChange={e => setNewAction(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border focus:border-emerald-500/50 outline-none text-xs text-white [&>option]:bg-zinc-950 transition-colors cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Savings (kg CO2e) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 75"
                    value={newAction.estimatedSavings}
                    onChange={e => setNewAction(prev => ({ ...prev, estimatedSavings: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border focus:border-emerald-500/50 outline-none text-xs text-white placeholder-muted-foreground/60 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Start Week *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 2"
                    value={newAction.weekToStart}
                    onChange={e => setNewAction(prev => ({ ...prev, weekToStart: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-muted/30 border border-border focus:border-emerald-500/50 outline-none text-xs text-white placeholder-muted-foreground/60 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAdding}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs cursor-pointer active:scale-[0.98] transition-all"
              >
                {isAdding ? 'Adding Custom Action...' : 'Save Custom Action'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

