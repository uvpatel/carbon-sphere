'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, ArrowRight, User, Mail } from 'lucide-react'
import { registerUser } from '@/server/actions/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await registerUser(name, email)
      if (res.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(res.error || 'Registration failed')
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 py-12">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative w-full max-w-md z-10 space-y-8">
        {/* Header Logo */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <Link href="/" className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Leaf size={24} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create your account</h1>
          <p className="text-muted-foreground text-sm">
            Join CarbonSphere and begin your green journey
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl border border-border space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                  <User size={16} />
                </span>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-white placeholder-muted-foreground focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-all duration-200"
                  required
                />
              </div>
            </div>

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
              {loading ? 'Creating Account...' : 'Register Account'}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {error && (
          <p className="text-sm text-center text-destructive font-medium border border-destructive/20 bg-destructive/10 px-4 py-2.5 rounded-lg max-w-xs mx-auto animate-shake">
            {error}
          </p>
        )}

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}
