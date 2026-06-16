'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { cookies } from 'next/headers'
import { Footprint, User, ActivityLog, AchievementDefinition, UserAchievement } from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'
import { calculateFootprint, FootprintInput } from '@/lib/calculations/engine'

export async function saveFootprint(input: FootprintInput) {
  try {
    await connectDB()
    
    // Get user session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) {
      return { success: false, error: 'Unauthorized. Please log in.' }
    }
    const userId = sessionCookie.value

    const user = await User.findById(userId)
    if (!user) {
      return { success: false, error: 'User session invalid.' }
    }

    // Calculate emissions
    const { totalCo2e, breakdown } = calculateFootprint(input)

    // Save footprint document
    const footprint = new Footprint({
      userId,
      totalCo2e,
      transportation: input.transportation,
      energy: input.energy,
      diet: input.diet,
      shopping: input.shopping,
      waste: input.waste,
      source: 'MANUAL'
    })
    await footprint.save()

    // Log calculation activity
    const activity = new ActivityLog({
      userId,
      eventType: 'CALCULATE',
      metadata: { footprintId: footprint._id, totalCo2e }
    })
    await activity.save()

    // Evaluate Gamification: "FIRST_FOOTPRINT" badge
    const badgeCode = 'FIRST_FOOTPRINT'
    const achievementDef = await AchievementDefinition.findOne({ badgeCode })
    if (achievementDef) {
      const existingBadge = await UserAchievement.findOne({ userId, achievementId: achievementDef._id })
      if (!existingBadge) {
        const newBadge = new UserAchievement({
          userId,
          achievementId: achievementDef._id
        })
        await newBadge.save()

        // Log badge unlock activity
        const badgeActivity = new ActivityLog({
          userId,
          eventType: 'MILESTONE_UNLOCKED',
          metadata: { badgeCode, name: achievementDef.name }
        })
        await badgeActivity.save()
      }
    }

    // Revalidate dashboard query caches
    revalidatePath('/dashboard')
    try {
      // Next.js 16 requires a second argument indicating cache profile lifecycle
      revalidateTag(`footprints-${userId}`, 'seconds')
    } catch (e) {
      // Fallback in case of environments where tags behave differently
    }

    return { success: true, totalCo2e, footprintId: footprint._id.toString() }
  } catch (error: any) {
    console.error('Error saving footprint:', error)
    return { success: false, error: error.message || 'Failed to save footprint calculation' }
  }
}
