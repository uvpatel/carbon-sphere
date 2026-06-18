'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calculator, 
  MessageSquare, 
  Flame, 
  TrendingUp, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Leaf,
  BookOpen,
  Settings
} from 'lucide-react'
import { logoutUser } from '@/server/actions/auth'

interface SidebarProps {
  user: {
    name?: string
    email: string
  } | null
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Calculator', href: '/calculator', icon: Calculator },
    { name: 'AI Coach', href: '/coach', icon: MessageSquare },
    { name: 'Impact Simulator', href: '/simulator', icon: TrendingUp },
    { name: 'My Plan', href: '/plan', icon: BookOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    const res = await logoutUser()
    if (res.success) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <aside 
      className={`relative flex flex-col h-screen bg-card border-r border-border text-foreground transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-6 -right-3 flex items-center justify-center w-6 h-6 rounded-full bg-border hover:bg-muted border border-border text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200 z-50"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Header Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50 h-20">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
          <Leaf size={18} className="animate-pulse-slow" />
        </div>
        {!isCollapsed && (
          <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
            CarbonSphere
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/15' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
              }`}
            >
              <Icon size={20} className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-emerald-400' : 'text-muted-foreground'}`} />
              {!isCollapsed && <span className="text-sm tracking-wide">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User profile / Logout footer */}
      {user && (
        <div className="p-4 border-t border-border/50 bg-muted/20">
          <div className="flex items-center justify-between gap-3 overflow-hidden">
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate text-foreground">{user.name || 'User'}</span>
                <span className="text-xs truncate text-muted-foreground">{user.email}</span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer ${
                isCollapsed ? 'w-full' : ''
              }`}
              title="Log Out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
