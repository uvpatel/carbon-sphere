'use server'

import { headers } from 'next/headers'
import { User, CarbonGoal } from '@/lib/db/models'
import { connectDB } from '@/lib/db/mongoose'

// Dynamically load server auth to prevent client bundle graphing of mongodb/node dependencies
async function getServerAuth() {
  const { auth } = await import('@/lib/auth')
  return auth
}

export async function loginDemoUser() {
  try {
    await connectDB()
    const auth = await getServerAuth()

    // Sign in using Better Auth API
    await auth.api.signInEmail({
      body: {
        email: 'demo@carbonsphere.ai',
        password: 'demo-password-123',
      },
      headers: await headers(),
    })
    return { success: true }
  } catch (error: unknown) {
    // If the demo user does not exist in Better Auth database yet (e.g. memory database was reset),
    // let's auto-register them!
    try {
      const auth = await getServerAuth()
      await auth.api.signUpEmail({
        body: {
          email: 'demo@carbonsphere.ai',
          password: 'demo-password-123',
          name: 'Eco Champion',
        },
        headers: await headers(),
      })

      // Also ensure Mongoose User profile and baseline goal are seeded
      let user = await User.findOne({ email: 'demo@carbonsphere.ai' })
      if (!user) {
        user = new User({
          email: 'demo@carbonsphere.ai',
          name: 'Eco Champion',
          status: 'ACTIVE'
        })
        await user.save()
      }

      const existingGoal = await CarbonGoal.findOne({ userId: user._id })
      if (!existingGoal) {
        const goal = new CarbonGoal({
          userId: user._id,
          baselineCo2e: 8000,
          targetCo2e: 4500,
          deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE'
        })
        await goal.save()
      }

      return { success: true }
    } catch (signupError: unknown) {
      console.error('Error logging in / registering demo user:', error, signupError)
      const err = signupError as Error
      return { success: false, error: err.message || 'Authentication failed' }
    }
  }
}

export async function loginUser(email: string, password?: string) {
  try {
    await connectDB()
    const auth = await getServerAuth()
    await auth.api.signInEmail({
      body: {
        email: email.toLowerCase(),
        password: password || 'demo-password-123',
      },
      headers: await headers(),
    })
    return { success: true }
  } catch (error: unknown) {
    console.error('Error logging in user:', error)
    const err = error as Error
    return { success: false, error: err.message || 'Authentication failed' }
  }
}

export async function registerUser(name: string, email: string, password?: string) {
  try {
    await connectDB()
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return { success: false, error: 'User already exists with this email' }
    }

    const auth = await getServerAuth()
    // Sign up using Better Auth
    await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password: password || 'demo-password-123',
        name,
      },
      headers: await headers(),
    })

    // Sync profile to Mongoose User collection
    let user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        name,
        status: 'ACTIVE'
      })
      await user.save()
    }

    // Set default baseline goal
    const goal = new CarbonGoal({
      userId: user._id,
      baselineCo2e: 8000,
      targetCo2e: 4500,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE'
    })
    await goal.save()

    return { success: true }
  } catch (error: unknown) {
    console.error('Error registering user:', error)
    const err = error as Error
    return { success: false, error: err.message || 'Registration failed' }
  }
}

export async function logoutUser() {
  try {
    const auth = await getServerAuth()
    await auth.api.signOut({
      headers: await headers(),
    })
    return { success: true }
  } catch (error: unknown) {
    console.error('Error logging out:', error)
    return { success: false, error: 'Logout failed' }
  }
}

export async function getCurrentUser() {
  try {
    await connectDB()
    const auth = await getServerAuth()
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session) return null

    // Look up the Mongoose User profile based on the authenticated email
    const user = await User.findOne({ email: session.user.email })
    if (!user) return null

    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}
