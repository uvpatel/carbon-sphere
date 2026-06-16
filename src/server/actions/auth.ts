'use server'

import { cookies } from 'next/headers'
import { User, CarbonGoal } from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'

export async function loginDemoUser() {
  try {
    await connectDB()
    const demoUser = await User.findOne({ email: 'demo@carbonsphere.ai' })
    if (!demoUser) {
      return { success: false, error: 'Demo user not seeded. Please run the seeding script first.' }
    }
    
    const cookieStore = await cookies()
    cookieStore.set('carbonsphere-session', demoUser._id.toString(), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    })
    return { success: true }
  } catch (error: any) {
    console.error('Error logging in demo user:', error)
    return { success: false, error: error.message || 'Authentication failed' }
  }
}

export async function loginUser(email: string) {
  try {
    await connectDB()
    let user = await User.findOne({ email: email.toLowerCase() })
    
    // Auto-register if not exists for user convenience in prototype
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        name: email.split('@')[0],
        status: 'ACTIVE'
      })
      await user.save()

      // Set default goal
      const goal = new CarbonGoal({
        userId: user._id,
        baselineCo2e: 8000,
        targetCo2e: 4500,
        deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE'
      })
      await goal.save()
    }

    const cookieStore = await cookies()
    cookieStore.set('carbonsphere-session', user._id.toString(), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })
    return { success: true }
  } catch (error: any) {
    console.error('Error logging in user:', error)
    return { success: false, error: error.message || 'Authentication failed' }
  }
}

export async function registerUser(name: string, email: string) {
  try {
    await connectDB()
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return { success: false, error: 'User already exists with this email' }
    }

    const user = new User({
      email: email.toLowerCase(),
      name,
      status: 'ACTIVE'
    })
    await user.save()

    // Set default goal
    const goal = new CarbonGoal({
      userId: user._id,
      baselineCo2e: 8000,
      targetCo2e: 4500,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE'
    })
    await goal.save()

    const cookieStore = await cookies()
    cookieStore.set('carbonsphere-session', user._id.toString(), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    })
    return { success: true }
  } catch (error: any) {
    console.error('Error registering user:', error)
    return { success: false, error: error.message || 'Registration failed' }
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('carbonsphere-session')
    return { success: true }
  } catch (error: any) {
    console.error('Error logging out:', error)
    return { success: false, error: 'Logout failed' }
  }
}

export async function getCurrentUser() {
  try {
    await connectDB()
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('carbonsphere-session')
    if (!sessionCookie) return null

    const user = await User.findById(sessionCookie.value)
    if (!user) return null

    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}
