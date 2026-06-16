'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { ReductionPlan, ActivityLog, User } from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'

export async function getActivePlan() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return null
    const userId = sessionCookie.value

    const plan = await ReductionPlan.findOne({ userId, status: 'ACTIVE' })
    if (!plan) return null

    return JSON.parse(JSON.stringify(plan))
  } catch (e) {
    console.error('Error fetching active plan:', e)
    return null
  }
}

export async function toggleActionStatus(planId: string, actionId: string, currentStatus: string) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const plan = await ReductionPlan.findOne({ _id: planId, userId })
    if (!plan) {
      return { success: false, error: 'Plan not found' }
    }

    // Locate the action subdocument
    const action = plan.actions.id(actionId)
    if (!action) {
      return { success: false, error: 'Action not found in plan' }
    }

    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    action.status = nextStatus
    action.completedAt = nextStatus === 'COMPLETED' ? new Date() : null

    await plan.save()

    // Log calculation activity
    const activity = new ActivityLog({
      userId,
      eventType: nextStatus === 'COMPLETED' ? 'ACTION_COMPLETED' : 'ACTION_RESET',
      metadata: { actionTitle: action.title, planId }
    })
    await activity.save()

    revalidatePath('/dashboard')
    revalidatePath('/plan')
    return { success: true, nextStatus }
  } catch (error: any) {
    console.error('Error toggling action status:', error)
    return { success: false, error: error.message }
  }
}
