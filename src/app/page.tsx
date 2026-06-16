'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, ArrowRight, Sparkles, Compass, Shield, Flame } from 'lucide-react'
import { loginDemoUser } from '@/server/actions/auth'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDemoLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await loginDemoUser()
      if (res.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(res.error || 'Failed to authenticate as demo user.')
      }
    } catch (e) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden px-4 md:px-8 py-16">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="relative max-w-4xl w-full text-center space-y-12 z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 text-xs font-medium tracking-wide">
          <Sparkles size={12} className="animate-pulse-slow" />
          <span>Track Smarter. Live Greener.</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
            Observe, Project & Minimize Your{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent text-glow-emerald">
              Carbon Footprint
            </span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            CarbonSphere AI connects real-time data logs, stateful impact simulations, and personalized AI sustainability coaching to guide you toward a zero-emission life.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50 disabled:scale-100 transition-all duration-200"
          >
            {loading ? 'Entering Sphere...' : 'Login as Demo User'}
            <ArrowRight size={18} />
          </button>
          
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium border border-border transition-colors duration-200"
          >
            Email Login
          </Link>
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium border border-destructive/20 bg-destructive/10 px-4 py-2.5 rounded-lg max-w-xs mx-auto animate-shake">
            {error}
          </p>
        )}

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Compass size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Interactive Carbon Engine</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Log utilities, food habits, and travel profiles. Generate automatic greenhouse gas equivalency cards in seconds.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">AI Sustainability Coach</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Conversational streaming suggestions backed by Google Gemini. Instantly compiles custom carbon reduction steps.
            </p>
          </div>

          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white">Stateful Impact Simulator</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Run custom "what-if" models. Visualize projected savings and commit actions directly to your dashboard timeline.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
