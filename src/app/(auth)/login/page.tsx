'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, ArrowRight, Mail, Sparkles } from 'lucide-react'
import { loginUser, loginDemoUser } from '@/server/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter a valid email address.')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(email)
      if (res.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(res.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setDemoLoading(true)
    setError('')
    try {
      const res = await loginDemoUser()
      if (res.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(res.error || 'Failed to authenticate as demo user.')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setDemoLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 py-12">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative w-full max-w-md z-10 space-y-8">
        {/* Header Logo */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Leaf size={24} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome to CarbonSphere</h1>
          <p className="text-muted-foreground text-sm">
            Enter your details to track your footprint
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl border border-border space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-white placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm cursor-pointer disabled:opacity-50 active:scale-98 transition-all duration-200"
            >
              {loading ? 'Signing In...' : 'Continue with Email'}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border/50"></div>
            <span className="flex-shrink mx-4 text-muted-foreground text-xs uppercase font-medium">Or</span>
            <div className="flex-grow border-t border-border/50"></div>
          </div>

          {/* Quick Demo Bypass */}
          <button
            onClick={handleDemoLogin}
            disabled={demoLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15 font-semibold text-sm cursor-pointer disabled:opacity-50 transition-colors duration-200"
          >
            <Sparkles size={16} />
            {demoLoading ? 'Logging in...' : 'Sign In as Demo User (One-Click)'}
          </button>
        </div>

        {error && (
          <p className="text-sm text-center text-destructive font-medium border border-destructive/20 bg-destructive/10 px-4 py-2.5 rounded-lg max-w-xs mx-auto animate-shake">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
