import React from 'react'
import Link from 'next/link'
import { ClipboardList, Sparkles } from 'lucide-react'
import { getActivePlan } from '@/server/actions/plan'
import { PlanList } from '@/components/PlanList'

export default async function PlanPage() {
  const plan = await getActivePlan()

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400">
          <ClipboardList size={32} />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">No Active Plan Found</h1>
          <p className="text-muted-foreground text-sm font-light">
            You haven&apos;t generated a carbon reduction plan yet. Run a projection in the Impact Simulator to commit actions and generate a custom AI plan.
          </p>
        </div>
        <Link
          href="/simulator"
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-200"
        >
          Create AI Plan in Simulator
          <Sparkles size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Reduction Blueprint</h1>
        <p className="text-muted-foreground text-sm font-light">
          Your active scheduled timeline of carbon-minimizing tasks.
        </p>
      </div>

      <PlanList initialPlan={plan} />
    </div>
  )
}
