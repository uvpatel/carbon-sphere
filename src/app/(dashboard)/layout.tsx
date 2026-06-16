import React from 'react'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/Sidebar'
import { getCurrentUser } from '@/server/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  // Fallback protection just in case
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <Sidebar user={user} />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-background p-6 md:p-8">
        <div className="mx-auto w-full max-w-7xl space-y-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
