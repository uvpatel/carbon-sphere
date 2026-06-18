import React from 'react'
import Link from 'next/link'
import { 
  Flame, 
  Trophy, 
  Leaf, 
  TrendingDown, 
  Trees, 
  Car, 
  Plus, 
  Award,
  ArrowRight,
  TrendingUp
} from 'lucide-react'
import { connectDB } from '@/lib/db/mongoose'
import { Footprint, CarbonGoal, UserAchievement, ActivityLog } from '@/lib/db/models'
import { getCurrentUser } from '@/server/actions/auth'
import { DashboardCharts } from '@/components/DashboardCharts'
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card'

async function calculateStreak(userId: string): Promise<number> {
  const logs = await ActivityLog.find({ userId, eventType: 'LOGIN' }).sort({ createdAt: -1 })
  if (!logs || logs.length === 0) return 0
  const uniqueDays = new Set(
    logs.map((log: { createdAt: Date | string }) => new Date(log.createdAt).toDateString())
  )
  
  let streak = 0
  const checkDate = new Date()
  checkDate.setHours(0, 0, 0, 0)
  
  while (true) {
    const checkStr = checkDate.toDateString()
    if (uniqueDays.has(checkStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // If today is missed, check if yesterday had a login to preserve streak
      if (streak === 0) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        yesterday.setHours(0, 0, 0, 0)
        if (uniqueDays.has(yesterday.toDateString())) {
          checkDate.setDate(checkDate.getDate() - 1) // Set checkDate to yesterday
          continue
        }
      }
      break
    }
  }
  return streak
}



export default async function DashboardPage() {
  await connectDB()
  const user = await getCurrentUser()
  if (!user) return null

  // 1. Fetch Footprints
  const footprints = await Footprint.find({ userId: user._id }).sort({ createdAt: -1 })
  const latestFootprint = footprints[0] || null
  
  // 2. Fetch Active Goals
  const activeGoal = await CarbonGoal.findOne({ userId: user._id, status: 'ACTIVE' })

  // 3. Fetch Achievements Earned
  const userAchievements = await UserAchievement.find({ userId: user._id }).populate('achievementId')

  // 4. Calculate Streak
  const streakDays = await calculateStreak(user._id)

  // Empty State: if user has never logged a footprint, guide them to the calculator
  if (!latestFootprint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400">
          <Leaf size={32} className="animate-bounce" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Your Green Journey Starts Here</h1>
          <p className="text-muted-foreground text-sm font-light">
            You haven&apos;t calculated your carbon footprint yet. Complete your first calculation to unlock your dashboard metrics, trends, and AI recommendations.
          </p>
        </div>
        <Link
          href="/calculator"
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-95 transition-all duration-200"
        >
          Calculate Baseline Footprint
          <Plus size={16} />
        </Link>
      </div>
    )
  }

  // Calculate Delta
  let deltaPercent = 0
  let isReduction = true
  if (footprints.length >= 2) {
    const latestValue = latestFootprint.totalCo2e
    const previousValue = footprints[1].totalCo2e
    deltaPercent = Math.round(((latestValue - previousValue) / previousValue) * 100)
    isReduction = deltaPercent <= 0
  } else if (activeGoal) {
    deltaPercent = Math.round(((latestFootprint.totalCo2e - activeGoal.baselineCo2e) / activeGoal.baselineCo2e) * 100)
    isReduction = deltaPercent <= 0
  }

  // Calculate Goal Progress Meter
  let goalProgress = 0
  if (activeGoal) {
    const range = activeGoal.baselineCo2e - activeGoal.targetCo2e
    if (range > 0) {
      const reduced = activeGoal.baselineCo2e - latestFootprint.totalCo2e
      goalProgress = Math.max(0, Math.min(100, Math.round((reduced / range) * 100)))
    }
  }

  // Calculate Equivalencies
  const annualSavings = activeGoal ? Math.max(0, activeGoal.baselineCo2e - latestFootprint.totalCo2e) : 0
  const treesPlanted = Math.max(0, Math.round(annualSavings / 22))
  const carKmSaved = Math.max(0, Math.round(annualSavings / 0.18))
  // Prepare Chart Data
  const chartsHistory = footprints.map((f: { createdAt: Date | string; totalCo2e: number }) => ({
    date: f.createdAt.toString(),
    total: f.totalCo2e
  }))

  const breakdown = {
    transportation: latestFootprint.transportation?.emissions || 0,
    energy: latestFootprint.energy?.emissions || 0,
    diet: latestFootprint.diet?.emissions || 0,
    shopping: latestFootprint.shopping?.emissions || 0,
    waste: latestFootprint.waste?.emissions || 0,
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Eco Dashboard</h1>
          <p className="text-muted-foreground text-sm font-light">Welcome back, {user.name || 'Champion'}. Live greener, day by day.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link
            href="/calculator"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs cursor-pointer shadow-md active:scale-95 transition-all duration-200"
          >
            <Plus size={14} />
            Log Footprint
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Footprint Card */}
        <Card className="glass-card border border-border flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Current Footprint</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Leaf size={16} />
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{(latestFootprint.totalCo2e / 1000).toFixed(2)}</span>
              <span className="text-sm font-medium text-muted-foreground">tons CO2e / yr</span>
            </div>
            {deltaPercent !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${isReduction ? 'text-emerald-400' : 'text-destructive'}`}>
                {isReduction ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                <span>{Math.abs(deltaPercent)}% {isReduction ? 'reduction' : 'increase'}</span>
                <span className="text-muted-foreground font-light">vs baseline</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goal Progress Card */}
        <Card className="glass-card border border-border flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Reduction Goal</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Trophy size={16} />
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            {activeGoal ? (
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-sm">
                  <span className="text-white font-bold">{goalProgress}% Target Hit</span>
                  <span className="text-muted-foreground text-xs font-light">Target: {(activeGoal.targetCo2e / 1000).toFixed(2)}t</span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-light">
                  Deadline: {new Date(activeGoal.deadline).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground font-light mb-2">No active carbon goal set.</p>
                <Link href="/simulator" className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  Configure Goal in Simulator <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="glass-card border border-border flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Activity Streak</CardTitle>
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Flame size={16} className={streakDays > 0 ? 'animate-pulse' : ''} />
            </div>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{streakDays}</span>
              <span className="text-sm font-medium text-muted-foreground">days streak</span>
            </div>
            <p className="text-xs text-muted-foreground font-light mt-2">
              {streakDays > 0 ? 'Keep logging activities to grow your streak!' : 'Log in tomorrow to start your streak.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics */}
      <DashboardCharts latestBreakdown={breakdown} history={chartsHistory} />

      {/* Grid of Achievements and Equivalencies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Equivalencies (Span 2) */}
        <Card className="glass-card border border-border lg:col-span-2 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Your Ecological Offsets</CardTitle>
            <CardDescription className="text-muted-foreground text-xs font-light">What your carbon reductions mean in physical equivalents</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Trees size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-white">{treesPlanted}</span>
                  <h4 className="text-sm font-medium text-foreground">Mature Trees Offset</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Equivalent to the annual carbon dioxide absorbing power of {treesPlanted} mature forests.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Car size={24} />
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-white">{carKmSaved.toLocaleString()}</span>
                  <h4 className="text-sm font-medium text-foreground">Car Kilometers Avoided</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Equivalent to avoiding driving {carKmSaved.toLocaleString()} km in a standard gasoline vehicle.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unlocked Badges */}
        <Card className="glass-card border border-border flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white">Unlocked Badges</CardTitle>
            <CardDescription className="text-muted-foreground text-xs font-light">Badges earned through eco activities</CardDescription>
          </CardHeader>
          <CardContent className="pb-6 flex-1 flex flex-col justify-center min-h-[160px]">
            <div className="overflow-y-auto max-h-[160px] space-y-3 pr-1 w-full">
              {userAchievements && userAchievements.length > 0 ? (
                userAchievements.map((item: { achievementId?: { name: string; description: string } }, idx: number) => {
                  const def = item.achievementId
                  if (!def) return null
                  return (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-muted/20 border border-border/30 hover:border-emerald-500/10 transition-colors">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                        <Award size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{def.name}</h4>
                        <p className="text-[10px] text-muted-foreground truncate leading-none">{def.description}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground w-full">
                  <Award size={24} className="opacity-30 mb-2" />
                  <span className="text-xs font-light">Log footprints and plans to earn badges!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
