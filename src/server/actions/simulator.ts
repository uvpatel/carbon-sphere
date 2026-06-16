'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { SimulationRun, User, Footprint, CarbonGoal } from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'

export async function saveSimulationRun(baselineCo2e: number, projectedCo2e: number, scenariosToggled: string[]) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const user = await User.findById(userId)
    if (!user) return { success: false, error: 'User invalid' }

    const run = new SimulationRun({
      userId,
      baselineCo2e,
      projectedCo2e,
      scenariosToggled
    })
    await run.save()

    revalidatePath('/dashboard')
    return { success: true, runId: run._id.toString() }
  } catch (error: any) {
    console.error('Error saving simulation run:', error)
    return { success: false, error: error.message }
  }
}

export async function getSimulatorBaseline() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return null
    const userId = sessionCookie.value

    const latestFootprint = await Footprint.findOne({ userId }).sort({ createdAt: -1 })
    const activeGoal = await CarbonGoal.findOne({ userId, status: 'ACTIVE' })

    if (!latestFootprint) return null

    return {
      baselineCo2e: latestFootprint.totalCo2e,
      goalId: activeGoal?._id.toString() || null,
      targetCo2e: activeGoal?.targetCo2e || null,
      breakdown: {
        transportation: latestFootprint.transportation?.emissions || 0,
        energy: latestFootprint.energy?.emissions || 0,
        diet: latestFootprint.diet?.emissions || 0,
        shopping: latestFootprint.shopping?.emissions || 0,
        waste: latestFootprint.waste?.emissions || 0
      }
    }
  } catch (e) {
    console.error('Error fetching simulator baseline:', e)
    return null
  }
}
