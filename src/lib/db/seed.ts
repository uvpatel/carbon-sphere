import mongoose from 'mongoose'
import { connectDB } from './mongoose'
import {
  User,
  Footprint,
  SimulationRun,
  CarbonGoal,
  ReductionPlan,
  AchievementDefinition,
  UserAchievement,
  ActivityLog,
  AiConversation
} from './models'

const achievementsData = [
  {
    badgeCode: 'FIRST_FOOTPRINT',
    name: 'Carbon Pioneer',
    description: 'Calculated your first carbon footprint.',
    iconUrl: 'Compass',
    criteria: { type: 'COUNT', target: 1, metric: 'footprint' }
  },
  {
    badgeCode: 'STREAK_7',
    name: 'Green Guardian',
    description: 'Maintained a 7-day green activity streak.',
    iconUrl: 'Flame',
    criteria: { type: 'STREAK', target: 7, metric: 'activity' }
  },
  {
    badgeCode: 'PLAN_ADOPTED',
    name: 'Green Strategist',
    description: 'Created your first personalized reduction plan.',
    iconUrl: 'BookOpen',
    criteria: { type: 'PLAN', target: 1, metric: 'plans' }
  },
  {
    badgeCode: 'DIET_SHIFT',
    name: 'Plant-Based Hero',
    description: 'Reduced diet emissions by switching to low-impact meals.',
    iconUrl: 'Leaf',
    criteria: { type: 'DIET', target: 30, metric: 'percentage' }
  },
  {
    badgeCode: 'GOAL_ACHIEVED',
    name: 'Carbon Crusher',
    description: 'Successfully reached your target footprint reduction.',
    iconUrl: 'Trophy',
    criteria: { type: 'REDUCTION', target: 1, metric: 'goals' }
  }
]

export async function seedDatabase() {
  console.log('Starting database seeding...')
  try {
    await connectDB()
  } catch (err) {
    console.warn('MongoDB connection failed, seeding into local JSON DB fallback...')
  }

  // Clear existing data in correct order
  await User.deleteMany({ email: 'demo@carbonsphere.ai' })
  await AchievementDefinition.deleteMany({})

  // 1. Seed Achievement Definitions
  const createdAchievements = await AchievementDefinition.insertMany(achievementsData)
  console.log(`Seeded ${createdAchievements.length} achievements definitions.`)

  // 2. Seed Demo User
  const demoUser = new User({
    email: 'demo@carbonsphere.ai',
    name: 'Eco Champion',
    status: 'ACTIVE',
    settings: {
      theme: 'dark',
      unitSystem: 'metric'
    },
    notificationPreference: {
      emailMarketing: false,
      emailMilestones: true,
      emailWeeklyDigest: true,
      pushEnabled: true
    }
  })
  await demoUser.save()
  const userId = demoUser._id
  console.log(`Demo User created with ID: ${userId}`)

  // Clean remaining user specific collections to avoid orphan data
  await Footprint.deleteMany({ userId })
  await SimulationRun.deleteMany({ userId })
  await CarbonGoal.deleteMany({ userId })
  await ReductionPlan.deleteMany({ userId })
  await UserAchievement.deleteMany({ userId })
  await ActivityLog.deleteMany({ userId })
  await AiConversation.deleteMany({ userId })

  // 3. Seed historical footprints (simulating progress over time)
  const now = new Date()
  const footprints = [
    {
      userId,
      totalCo2e: 8650, // in kg
      transportation: { carType: 'petrol', kmPerWeek: 300, flightsPerYear: 3, emissions: 4200 },
      energy: { electricityKwh: 450, heatingSource: 'gas', emissions: 2500 },
      diet: { type: 'meat-heavy', mealFrequency: 'high', emissions: 1200 },
      shopping: { monthlySpend: 500, emissions: 500 },
      waste: { recycleEnabled: false, compostEnabled: false, emissions: 250 },
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    },
    {
      userId,
      totalCo2e: 7400,
      transportation: { carType: 'petrol', kmPerWeek: 200, flightsPerYear: 2, emissions: 3200 },
      energy: { electricityKwh: 400, heatingSource: 'gas', emissions: 2200 },
      diet: { type: 'meat-medium', mealFrequency: 'medium', emissions: 1000 },
      shopping: { monthlySpend: 550, emissions: 750 },
      waste: { recycleEnabled: true, compostEnabled: false, emissions: 250 },
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000) // 20 days ago
    },
    {
      userId,
      totalCo2e: 6100,
      transportation: { carType: 'hybrid', kmPerWeek: 150, flightsPerYear: 1, emissions: 2100 },
      energy: { electricityKwh: 350, heatingSource: 'gas', emissions: 1950 },
      diet: { type: 'vegetarian', mealFrequency: 'medium', emissions: 800 },
      shopping: { monthlySpend: 400, emissions: 1000 },
      waste: { recycleEnabled: true, compostEnabled: true, emissions: 250 },
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
    },
    {
      userId,
      totalCo2e: 4850,
      transportation: { carType: 'electric', kmPerWeek: 100, flightsPerYear: 0, emissions: 1100 },
      energy: { electricityKwh: 300, heatingSource: 'electric', emissions: 1500 },
      diet: { type: 'vegan', mealFrequency: 'high', emissions: 750 },
      shopping: { monthlySpend: 300, emissions: 1200 },
      waste: { recycleEnabled: true, compostEnabled: true, emissions: 300 },
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }
  ]
  const createdFootprints = await Footprint.insertMany(footprints)
  console.log('Seeded historical footprints.')

  // 4. Seed Carbon Goal
  const goal = new CarbonGoal({
    userId,
    baselineCo2e: 8650,
    targetCo2e: 4000,
    deadline: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
    status: 'ACTIVE'
  })
  await goal.save()
  console.log('Seeded active carbon goal.')

  // 5. Seed Reduction Plan with actions
  const plan = new ReductionPlan({
    goalId: goal._id,
    userId,
    title: 'Home & Travel Transition Plan',
    status: 'ACTIVE',
    actions: [
      {
        title: 'Switch to LED Light Bulbs',
        description: 'Replace traditional incandescent light bulbs with energy-efficient LED models.',
        category: 'Energy',
        difficulty: 'Easy',
        estimatedSavings: 150,
        weekToStart: 1,
        status: 'COMPLETED',
        completedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Implement Meatless Mondays',
        description: 'Substitute animal protein with plant-based alternatives at least one day per week.',
        category: 'Diet',
        difficulty: 'Easy',
        estimatedSavings: 200,
        weekToStart: 2,
        status: 'COMPLETED',
        completedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Commute by E-Bike or Transit',
        description: 'Shift short drives (under 10km) to electric cycling or public transportation.',
        category: 'Transportation',
        difficulty: 'Medium',
        estimatedSavings: 800,
        weekToStart: 3,
        status: 'PENDING'
      },
      {
        title: 'Install Smart Thermostat',
        description: 'Automate heating and cooling schedules to reduce gas consumption during away hours.',
        category: 'Energy',
        difficulty: 'Medium',
        estimatedSavings: 450,
        weekToStart: 4,
        status: 'PENDING'
      },
      {
        title: 'Install Rooftop Solar Panels',
        description: 'Transition primary power supply to zero-emission grid offset solar generation.',
        category: 'Energy',
        difficulty: 'Hard',
        estimatedSavings: 2500,
        weekToStart: 8,
        status: 'PENDING'
      }
    ]
  })
  await plan.save()
  console.log('Seeded active reduction plan.')

  // 6. Seed Simulation Runs
  const simulations = [
    {
      userId,
      baselineCo2e: 4850,
      projectedCo2e: 3600,
      scenariosToggled: ['vegan_diet', 'led_transition'],
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      userId,
      baselineCo2e: 4850,
      projectedCo2e: 2800,
      scenariosToggled: ['vegan_diet', 'solar_panels', 'electric_car'],
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    }
  ]
  await SimulationRun.insertMany(simulations)
  console.log('Seeded simulation runs.')

  // 7. Seed achievements unlocked for user
  const pioneerDef = createdAchievements.find((a: any) => a.badgeCode === 'FIRST_FOOTPRINT')
  const strategistDef = createdAchievements.find((a: any) => a.badgeCode === 'PLAN_ADOPTED')
  
  if (pioneerDef && strategistDef) {
    await UserAchievement.insertMany([
      { userId, achievementId: pioneerDef._id, unlockedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
      { userId, achievementId: strategistDef._id, unlockedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000) }
    ])
  }
  console.log('Seeded unlocked achievements.')

  // 8. Seed Activity Logs to establish active streak
  // Create logins for each of the last 7 consecutive days to guarantee a 7-day streak is calculated!
  const activityLogs = []
  for (let i = 0; i < 7; i++) {
    activityLogs.push({
      userId,
      eventType: 'LOGIN',
      metadata: { source: 'web', autoLogin: true },
      createdAt: new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    })
  }
  // Add some actions completed logs
  activityLogs.push({
    userId,
    eventType: 'CALCULATE',
    metadata: { footprintId: createdFootprints[3]._id },
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
  })
  activityLogs.push({
    userId,
    eventType: 'ACTION_COMPLETED',
    metadata: { actionTitle: 'Switch to LED Light Bulbs' },
    createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000)
  })

  await ActivityLog.insertMany(activityLogs)
  console.log('Seeded activity logs.')

  // 9. Seed AI Conversations
  const conversation = new AiConversation({
    userId,
    title: 'Reducing Diet Footprint',
    messages: [
      { role: 'user', content: 'Hi, I want to reduce my carbon footprint. What is the single biggest change I can make in my diet?' },
      { role: 'model', content: 'Hello! The single most impactful change you can make to your dietary carbon footprint is reducing your consumption of red meats (beef and lamb). Beef production emits roughly 60kg of greenhouse gases per kg of meat, which is nearly 10 times higher than poultry and over 30 times higher than peas or lentils. Transitioning to a plant-forward or vegetarian diet can drop your dietary emissions by up to 50%!' },
      { role: 'user', content: 'That makes sense. What about dairy products?' },
      { role: 'model', content: 'Cheese and butter also have high footprint profiles because they are highly concentrated dairy products requiring significant milk inputs. Swapping dairy milk for oat or almond milk, and scaling back on cheese, is another fast way to reduce emissions without completely going vegan.' }
    ]
  })
  await conversation.save()
  console.log('Seeded AI Conversations.')

  console.log('Seeding process finished successfully!')
}

// Support running directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Database Seeding Script Complete.')
      process.exit(0)
    })
    .catch((err) => {
      console.error('Database Seeding Failed:', err)
      process.exit(1)
    })
}
