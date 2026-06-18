'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import mongoose from 'mongoose'
import { ReductionPlan, ActivityLog, CarbonGoal, Footprint, AchievementDefinition, UserAchievement } from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'
import { jsonDb } from '@/lib/db/jsonDb'

interface PlanAction {
  _id?: string | mongoose.Types.ObjectId
  title: string
  description?: string
  category: string
  difficulty: string
  estimatedSavings: number
  weekToStart: number
  status: string
  completedAt?: Date | null
}

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

export async function updateActionStatus(
  planId: string,
  actionId: string,
  nextStatus: 'PENDING' | 'COMPLETED' | 'SKIPPED'
) {
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

    // Locate the action subdocument supporting both Mongoose and local fallback
    const action = typeof plan.actions.id === 'function'
      ? plan.actions.id(actionId)
      : plan.actions.find((a: PlanAction) => a._id === actionId || a._id?.toString() === actionId.toString())

    if (!action) {
      return { success: false, error: 'Action not found in plan' }
    }

    action.status = nextStatus
    action.completedAt = nextStatus === 'COMPLETED' ? new Date() : null

    // If local mock proxy, we must manually update in JSON DB
    if (typeof plan.save !== 'function' || !mongoose?.connection || mongoose.connection.readyState !== 1) {
      jsonDb.updateOne('ReductionPlan', { _id: planId }, plan)
    } else {
      await plan.save()
    }

    // Log activity
    let eventType = 'ACTION_RESET'
    if (nextStatus === 'COMPLETED') {
      eventType = 'ACTION_COMPLETED'
    } else if (nextStatus === 'SKIPPED') {
      eventType = 'ACTION_SKIPPED'
    }

    const activity = new ActivityLog({
      userId,
      eventType,
      metadata: { actionTitle: action.title, planId }
    })
    await activity.save()

    revalidatePath('/dashboard')
    revalidatePath('/plan')
    return { success: true, nextStatus }
  } catch (error: unknown) {
    console.error('Error updating action status:', error)
    const err = error as Error
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function toggleActionStatus(planId: string, actionId: string, currentStatus: string) {
  const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
  return updateActionStatus(planId, actionId, nextStatus)
}

export async function addActionToPlan(
  planId: string,
  actionData: {
    title: string
    description?: string
    category: string
    difficulty: string
    estimatedSavings: number
    weekToStart: number
  }
) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const plan = await ReductionPlan.findOne({ _id: planId, userId })
    if (!plan) return { success: false, error: 'Plan not found' }

    const newAction = {
      title: actionData.title,
      description: actionData.description,
      category: actionData.category,
      difficulty: actionData.difficulty,
      estimatedSavings: Number(actionData.estimatedSavings),
      weekToStart: Number(actionData.weekToStart),
      status: 'PENDING'
    }

    plan.actions.push(newAction)

    if (typeof plan.save !== 'function' || !mongoose?.connection || mongoose.connection.readyState !== 1) {
      jsonDb.updateOne('ReductionPlan', { _id: planId }, plan)
    } else {
      await plan.save()
    }

    // Log activity
    const activity = new ActivityLog({
      userId,
      eventType: 'ACTION_ADDED',
      metadata: { actionTitle: actionData.title, planId }
    })
    await activity.save()

    revalidatePath('/dashboard')
    revalidatePath('/plan')
    return { success: true, plan: JSON.parse(JSON.stringify(plan)) }
  } catch (error: unknown) {
    console.error('Error adding action to plan:', error)
    const err = error as Error
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function removeActionFromPlan(planId: string, actionId: string) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const plan = await ReductionPlan.findOne({ _id: planId, userId })
    if (!plan) return { success: false, error: 'Plan not found' }

    const actionIndex = plan.actions.findIndex(
      (a: PlanAction) => a._id === actionId || a._id?.toString() === actionId.toString()
    )
    if (actionIndex === -1) return { success: false, error: 'Action not found' }

    const removedActionTitle = plan.actions[actionIndex].title
    plan.actions.splice(actionIndex, 1)

    if (typeof plan.save !== 'function' || !mongoose?.connection || mongoose.connection.readyState !== 1) {
      jsonDb.updateOne('ReductionPlan', { _id: planId }, plan)
    } else {
      await plan.save()
    }

    const activity = new ActivityLog({
      userId,
      eventType: 'ACTION_REMOVED',
      metadata: { actionTitle: removedActionTitle, planId }
    })
    await activity.save()

    revalidatePath('/dashboard')
    revalidatePath('/plan')
    return { success: true, plan: JSON.parse(JSON.stringify(plan)) }
  } catch (error: unknown) {
    console.error('Error removing action from plan:', error)
    const err = error as Error
    return { success: false, error: err.message || 'Unknown error' }
  }
}

export async function createReductionPlan(goalId: string) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const goal = await CarbonGoal.findById(goalId)
    if (!goal) return { success: false, error: 'Carbon goal not found' }

    // Fetch user's latest footprint to tailor plan categories
    const latestFootprint = await Footprint.findOne({ userId }).sort({ createdAt: -1 })
    const transEmissions = latestFootprint?.transportation?.emissions || 2000

    const proposedActions = [
      {
        title: 'Switch to energy-efficient LED bulbs',
        description: 'Replace standard light bulbs with LEDs throughout your home, reducing electrical waste.',
        category: 'Energy',
        difficulty: 'Easy',
        estimatedSavings: 150,
        weekToStart: 1,
        status: 'PENDING'
      },
      {
        title: 'Implement Meatless Mondays',
        description: 'Swap beef/lamb meals for plant-based proteins at least one day per week.',
        category: 'Diet',
        difficulty: 'Easy',
        estimatedSavings: 220,
        weekToStart: 2,
        status: 'PENDING'
      },
      {
        title: 'Commute by E-Bike or Public Transit',
        description: 'Shift short drives under 10km to cycling, transit, or walking twice a week.',
        category: 'Transportation',
        difficulty: 'Medium',
        estimatedSavings: 750,
        weekToStart: 3,
        status: 'PENDING'
      },
      {
        title: 'Program smart thermostat schedules',
        description: 'Optimize heating/cooling cycles to run less when you are away or asleep.',
        category: 'Energy',
        difficulty: 'Medium',
        estimatedSavings: 480,
        weekToStart: 4,
        status: 'PENDING'
      }
    ]

    if (transEmissions > 3000) {
      proposedActions.push({
        title: 'Transition commute to electric vehicle (EV)',
        description: 'Swap a fossil-fuel vehicle for battery electric commuting, saving up to 70% in transit emissions.',
        category: 'Transportation',
        difficulty: 'Hard',
        estimatedSavings: 2800,
        weekToStart: 8,
        status: 'PENDING'
      })
    } else {
      proposedActions.push({
        title: 'Install solar panels or purchase offsets',
        description: 'Install rooftop solar or purchase certified local green grid energy offsets.',
        category: 'Energy',
        difficulty: 'Hard',
        estimatedSavings: 2100,
        weekToStart: 8,
        status: 'PENDING'
      })
    }

    const plan = new ReductionPlan({
      goalId: goal._id,
      userId,
      title: 'AI Carbon Reduction Plan',
      status: 'ACTIVE',
      actions: proposedActions
    })
    await plan.save()

    goal.status = 'ACTIVE'
    await goal.save()

    const log = new ActivityLog({
      userId,
      eventType: 'PLAN_CREATED',
      metadata: { planId: plan._id, title: plan.title }
    })
    await log.save()

    // Check/Unlock "PLAN_ADOPTED" badge
    const badgeCode = 'PLAN_ADOPTED'
    const achievementDef = await AchievementDefinition.findOne({ badgeCode })
    if (achievementDef) {
      const existingBadge = await UserAchievement.findOne({ userId, achievementId: achievementDef._id })
      if (!existingBadge) {
        const newBadge = new UserAchievement({
          userId,
          achievementId: achievementDef._id
        })
        await newBadge.save()

        const badgeActivity = new ActivityLog({
          userId,
          eventType: 'MILESTONE_UNLOCKED',
          metadata: { badgeCode, name: achievementDef.name }
        })
        await badgeActivity.save()
      }
    }

    revalidatePath('/dashboard')
    revalidatePath('/plan')
    return { success: true, planId: plan._id.toString() }
  } catch (error: unknown) {
    console.error('Error generating plan:', error)
    const err = error as Error
    return { success: false, error: err.message || 'Unknown error' }
  }
}
