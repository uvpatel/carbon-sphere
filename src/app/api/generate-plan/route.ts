import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import { Footprint, CarbonGoal, ReductionPlan, ActivityLog, AchievementDefinition, UserAchievement } from '@/lib/db/models'

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    // 1. Authenticate user
    const sessionCookie = req.cookies.get('carbonsphere-session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = sessionCookie.value

    const { goalId } = await req.json()
    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 })
    }

    const goal = await CarbonGoal.findById(goalId)
    if (!goal) {
      return NextResponse.json({ error: 'Carbon goal not found' }, { status: 404 })
    }

    // 2. Fetch user's latest footprint to tailor plan categories
    const latestFootprint = await Footprint.findOne({ userId }).sort({ createdAt: -1 })
    const transEmissions = latestFootprint?.transportation?.emissions || 2000
    const energyEmissions = latestFootprint?.energy?.emissions || 1500

    // 3. Define the actions dataset (tailored mock values)
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

    // If their transportation emissions are high, suggest EV or flight offset
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

    // 4. Create and save Reduction Plan
    const plan = new ReductionPlan({
      goalId: goal._id,
      userId,
      title: 'AI Carbon Reduction Plan',
      status: 'ACTIVE',
      actions: proposedActions
    })
    await plan.save()

    // 5. Update goal status to bind them
    goal.status = 'ACTIVE'
    await goal.save()

    // 6. Log activity
    const log = new ActivityLog({
      userId,
      eventType: 'PLAN_CREATED',
      metadata: { planId: plan._id, title: plan.title }
    })
    await log.save()

    // 7. Check/Unlock "PLAN_ADOPTED" badge
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

    return NextResponse.json({ success: true, planId: plan._id.toString(), title: plan.title })
  } catch (err: any) {
    console.error('Error in generate-plan:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
