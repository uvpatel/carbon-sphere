'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  Download, 
  Trash2, 
  Save, 
  Check, 
  Bell, 
  Monitor, 
  ShieldAlert,
  Loader
} from 'lucide-react'
import { 
  getSettingsData, 
  updateUserSettings, 
  updateNotificationPrefs, 
  exportUserData, 
  requestAccountDeletion 
} from '@/server/actions/settings'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [savingPrefs, setSavingPrefs] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [prefSuccess, setPrefSuccess] = useState(false)
  const [notifSuccess, setNotifSuccess] = useState(false)

  // Settings State
  const [theme, setTheme] = useState('dark')
  const [unitSystem, setUnitSystem] = useState('metric')

  // Notifications State
  const [emailMarketing, setEmailMarketing] = useState(false)
  const [emailMilestones, setEmailMilestones] = useState(true)
  const [emailWeeklyDigest, setEmailWeeklyDigest] = useState(true)
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    getSettingsData().then((user) => {
      if (user) {
        setTheme(user.settings?.theme || 'dark')
        setUnitSystem(user.settings?.unitSystem || 'metric')
        setEmailMarketing(user.notificationPreference?.emailMarketing ?? false)
        setEmailMilestones(user.notificationPreference?.emailMilestones ?? true)
        setEmailWeeklyDigest(user.notificationPreference?.emailWeeklyDigest ?? true)
        setPushEnabled(user.notificationPreference?.pushEnabled ?? false)
      }
      setLoading(false)
    })
  }, [])

  const handleSavePrefs = async () => {
    setSavingPrefs(true)
    setError('')
    try {
      const res = await updateUserSettings(theme, unitSystem)
      if (res.success) {
        setPrefSuccess(true)
        setTimeout(() => setPrefSuccess(false), 2000)
      } else {
        setError(res.error || 'Failed to update preferences')
      }
    } catch (e) {
      setError('An unexpected error occurred.')
    } finally {
      setSavingPrefs(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSavingNotifications(true)
    setError('')
    try {
      const res = await updateNotificationPrefs(
        emailMarketing,
        emailMilestones,
        emailWeeklyDigest,
        pushEnabled
      )
      if (res.success) {
        setNotifSuccess(true)
        setTimeout(() => setNotifSuccess(false), 2000)
      } else {
        setError(res.error || 'Failed to update notification preferences')
      }
    } catch (e) {
      setError('An unexpected error occurred.')
    } finally {
      setSavingNotifications(false)
    }
  }

  const handleExportData = async () => {
    setExporting(true)
    setError('')
    try {
      const res = await exportUserData()
      if (res.success && res.payload) {
        // Trigger browser file download of JSON payload
        const blob = new Blob([res.payload], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `carbonsphere-compliance-export-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        setError(res.error || 'Failed to compile data export.')
      }
    } catch (e) {
      setError('An unexpected error occurred.')
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you absolutely sure you want to request account deletion? This operation is irreversible and will mark all logged entries as deleted.')) {
      return
    }

    setDeleting(true)
    setError('')
    try {
      const res = await requestAccountDeletion()
      if (res.success) {
        router.push('/')
        router.refresh()
      } else {
        setError(res.error || 'Failed to delete account.')
      }
    } catch (e) {
      setError('An unexpected error occurred.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size={32} className="animate-spin text-emerald-400" />
        <span className="text-xs text-muted-foreground mt-4">Retrieving user configurations...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Settings</h1>
        <p className="text-muted-foreground text-sm font-light">Manage your preferences, notification options, and GDPR compliance items.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold max-w-xl animate-shake">
          {error}
        </div>
      )}

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Preferences */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-border flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Settings size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Application Options</h3>
                <p className="text-xs text-muted-foreground font-light">Custom themes and measurement systems</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Theme Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">UI Color Scheme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="dark">Dark Theme (Option C - Recommended)</option>
                  <option value="light">Light Theme</option>
                  <option value="system">Follow System Preferences</option>
                </select>
              </div>

              {/* Unit System */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Measurement Standard</label>
                <select
                  value={unitSystem}
                  onChange={(e) => setUnitSystem(e.target.value)}
                  className="w-full p-3 bg-muted border border-border rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="metric">Metric (kilometers, kilograms)</option>
                  <option value="imperial">Imperial (miles, pounds)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSavePrefs}
            disabled={savingPrefs || prefSuccess}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm cursor-pointer disabled:opacity-50 active:scale-98 transition-all duration-200"
          >
            {prefSuccess ? 'Preferences Saved!' : savingPrefs ? 'Saving...' : 'Save General Preferences'}
            {prefSuccess ? <Check size={16} /> : <Save size={16} />}
          </button>
        </div>

        {/* Notification Preferences */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-border flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Email Subscriptions</h3>
                <p className="text-xs text-muted-foreground font-light">Manage notifications and digets</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setEmailMarketing(!emailMarketing)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  emailMarketing ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-muted/30 border-border text-muted-foreground'
                }`}
              >
                <div>
                  <span className="block font-bold text-sm text-white mb-0.5">Marketing & Tips</span>
                  <span className="block text-xs font-light">Receive eco tips, articles, and product feature news.</span>
                </div>
                {emailMarketing && <Check size={18} className="text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setEmailMilestones(!emailMilestones)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  emailMilestones ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-muted/30 border-border text-muted-foreground'
                }`}
              >
                <div>
                  <span className="block font-bold text-sm text-white mb-0.5">Milestone Notifications</span>
                  <span className="block text-xs font-light">Get alerts when you unlock badges or hit goals.</span>
                </div>
                {emailMilestones && <Check size={18} className="text-emerald-400" />}
              </button>

              <button
                type="button"
                onClick={() => setEmailWeeklyDigest(!emailWeeklyDigest)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  emailWeeklyDigest ? 'bg-emerald-500/10 border-emerald-500 text-white' : 'bg-muted/30 border-border text-muted-foreground'
                }`}
              >
                <div>
                  <span className="block font-bold text-sm text-white mb-0.5">Weekly Progress Digests</span>
                  <span className="block text-xs font-light">Receive weekly email statements summarizing your streak and savings.</span>
                </div>
                {emailWeeklyDigest && <Check size={18} className="text-emerald-400" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveNotifications}
            disabled={savingNotifications || notifSuccess}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm cursor-pointer disabled:opacity-50 active:scale-98 transition-all duration-200"
          >
            {notifSuccess ? 'Subscriptions Saved!' : savingNotifications ? 'Saving...' : 'Save Email Subscriptions'}
            {notifSuccess ? <Check size={16} /> : <Save size={16} />}
          </button>
        </div>

        {/* GDPR Compliance Actions */}
        <div className="glass-card p-6 md:p-8 rounded-2xl border border-border flex flex-col justify-between space-y-6 lg:col-span-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Monitor size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Compliance & GDPR Actions</h3>
                <p className="text-xs text-muted-foreground font-light">Export your personal files or request account closure</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Export Data */}
              <div className="p-5 rounded-xl bg-muted/20 border border-border/50 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Portability Data Export</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Download a raw JSON snapshot copy containing your email profile, active plan timelines, streak counters, and calculations log.
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={exporting}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border hover:bg-muted/50 text-xs font-semibold text-white cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
                >
                  {exporting ? 'Compiling Payload...' : 'Export My Personal Data (JSON)'}
                  <Download size={14} />
                </button>
              </div>

              {/* Delete Account */}
              <div className="p-5 rounded-xl bg-destructive/5 border border-destructive/10 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-destructive">Right to be Forgotten (Forget Me)</h4>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Closing your account marks user records as inactive. Session cookies will be deleted, logging a compliance audit verification log.
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-destructive hover:bg-red-600 text-white font-semibold text-xs cursor-pointer active:scale-95 disabled:opacity-50 transition-all border border-transparent"
                >
                  {deleting ? 'Closing Account...' : 'Request Account Deletion'}
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
