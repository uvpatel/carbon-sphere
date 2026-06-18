import { NextRequest, NextResponse } from 'next/server'
import { createReductionPlan } from '@/server/actions/plan'

export async function POST(req: NextRequest) {
  try {
    const { goalId } = await req.json()
    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const res = await createReductionPlan(goalId)
    if (res.success) {
      return NextResponse.json({ success: true, planId: res.planId, title: 'AI Carbon Reduction Plan' })
    } else {
      return NextResponse.json({ error: res.error }, { status: 400 })
    }
  } catch (err: unknown) {
    console.error('Error in generate-plan:', err)
    const error = err as Error
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
