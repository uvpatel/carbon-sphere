'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Leaf, ArrowRight, User, Mail, Lock } from 'lucide-react'
import { registerUser } from '@/server/actions/auth'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await registerUser(name, email, password)
      if (res.success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(res.error || 'Registration failed')
      }
    } catch {
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
          <h1 className="text-2xl font-bold tracking-tight text-white animate-fade-in">Create your account</h1>
          <p className="text-muted-foreground text-sm font-light">
            Join CarbonSphere and begin your green journey
          </p>
        </div>

        {/* Card */}
        <Card className="glass-card border border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold text-white">Register</CardTitle>
            <CardDescription className="text-muted-foreground text-xs font-light">
              Enter details below to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Your Name
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground z-10">
                    <User size={16} />
                  </span>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-10 w-full rounded-xl bg-muted border border-border text-white placeholder-muted-foreground focus-visible:border-emerald-500 focus-visible:ring-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground z-10">
                    <Mail size={16} />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-10 w-full rounded-xl bg-muted border border-border text-white placeholder-muted-foreground focus-visible:border-emerald-500 focus-visible:ring-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Password
                </Label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted-foreground z-10">
                    <Lock size={16} />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-10 w-full rounded-xl bg-muted border border-border text-white placeholder-muted-foreground focus-visible:border-emerald-500 focus-visible:ring-emerald-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm disabled:opacity-50 active:scale-98 transition-all duration-200"
              >
                {loading ? 'Creating Account...' : 'Register Account'}
                <ArrowRight size={16} />
              </Button>
            </form>
          </CardContent>
        </Card>

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
