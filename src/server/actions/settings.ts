'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import mongoose from 'mongoose'
import { 
  User, 
  Footprint, 
  CarbonGoal, 
  ReductionPlan, 
  UserAchievement, 
  ActivityLog, 
  AiConversation, 
  AiUsageTracking, 
  AuditEvent 
} from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'
import { jsonDb } from '@/lib/db/jsonDb'

export async function getSettingsData() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return null
    const userId = sessionCookie.value

    const user = await User.findById(userId)
    if (!user) return null

    return JSON.parse(JSON.stringify(user))
  } catch (e) {
    console.error('Error fetching settings:', e)
    return null
  }
}

export async function updateUserSettings(theme: string, unitSystem: string) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const user = await User.findById(userId)
    if (!user) return { success: false, error: 'User invalid' }

    user.settings = {
      theme,
      unitSystem,
      updatedAt: new Date()
    }
    
    // Support local JSON DB update
    if (typeof user.save !== 'function' || !mongoose?.connection || mongoose.connection.readyState !== 1) {
      jsonDb.updateOne('User', { _id: userId }, user)
    } else {
      await user.save()
    }

    revalidatePath('/dashboard')
    revalidatePath('/settings')
    return { success: true }
  } catch (error: unknown) {
    console.error('Error updating settings:', error)
    const err = error as Error
    return { success: false, error: err.message }
  }
}

export async function updateNotificationPrefs(
  emailMarketing: boolean, 
  emailMilestones: boolean, 
  emailWeeklyDigest: boolean, 
  pushEnabled: boolean
) {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const user = await User.findById(userId)
    if (!user) return { success: false, error: 'User invalid' }

    user.notificationPreference = {
      emailMarketing,
      emailMilestones,
      emailWeeklyDigest,
      pushEnabled,
      updatedAt: new Date()
    }

    // Support local JSON DB update
    if (typeof user.save !== 'function' || !mongoose?.connection || mongoose.connection.readyState !== 1) {
      jsonDb.updateOne('User', { _id: userId }, user)
    } else {
      await user.save()
    }

    revalidatePath('/settings')
    return { success: true }
  } catch (error: unknown) {
    console.error('Error updating notification prefs:', error)
    const err = error as Error
    return { success: false, error: err.message }
  }
}

export async function exportUserData() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    // Fetch all user records
    const user = await User.findById(userId)
    const footprints = await Footprint.find({ userId })
    const goals = await CarbonGoal.find({ userId })
    const plans = await ReductionPlan.find({ userId })
    const achievements = await UserAchievement.find({ userId }).populate('achievementId')
    const activityLogs = await ActivityLog.find({ userId })
    const conversations = await AiConversation.find({ userId })
    const usage = await AiUsageTracking.find({ userId })

    // Build data package
    const dataPackage = {
      exportedAt: new Date().toISOString(),
      user: {
        email: user?.email,
        name: user?.name,
        status: user?.status,
        settings: user?.settings,
        notificationPreference: user?.notificationPreference
      },
      footprints,
      goals,
      plans,
      achievements,
      activityLogs,
      conversations,
      usage
    }

    // Log security audit event
    const audit = new AuditEvent({
      userId,
      action: 'DATA_EXPORTED',
      createdAt: new Date()
    })
    await audit.save()

    return { success: true, payload: JSON.stringify(dataPackage, null, 2) }
  } catch (error: unknown) {
    console.error('Error exporting user data:', error)
    const err = error as Error
    return { success: false, error: err.message }
  }
}

export async function requestAccountDeletion() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return { success: false, error: 'Unauthorized' }
    const userId = sessionCookie.value

    const user = await User.findById(userId)
    if (!user) return { success: false, error: 'User not found' }

    // Hard/Soft delete user details
    user.status = 'DELETED'
    user.deletedAt = new Date()
    
    if (typeof user.save !== 'function' || !mongoose?.connection || mongoose.connection.readyState !== 1) {
      jsonDb.updateOne('User', { _id: userId }, user)
    } else {
      await user.save()
    }

    // Log security audit event
    const audit = new AuditEvent({
      userId,
      action: 'ACCOUNT_DELETION_REQUESTED',
      createdAt: new Date()
    })
    await audit.save()

    // Delete session
    cookieStore.delete('carbonsphere-session')

    return { success: true }
  } catch (error: unknown) {
    console.error('Error deleting account:', error)
    const err = error as Error
    return { success: false, error: err.message }
  }
}
