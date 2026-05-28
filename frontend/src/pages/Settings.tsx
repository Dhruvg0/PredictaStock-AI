import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth'
import { CheckCircle2 } from 'lucide-react'

export default function Settings() {
  const user = useAuthStore(state => state.user)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account and platform preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Personal details and account management.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.full_name || ''} 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''} 
                  disabled
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 text-slate-500 px-3 py-2 text-sm cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
                Save Changes
              </button>
              {isSaved && (
                <span className="flex items-center text-sm text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> Profile updated successfully
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Control how and when you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'email-alerts', label: 'Email Alerts', desc: 'Receive critical stockout warnings via email.' },
              { id: 'daily-digest', label: 'Daily Digest', desc: 'A daily morning summary of inventory health.' },
              { id: 'sms-alerts', label: 'SMS Notifications', desc: 'Text messages for high-severity issues only.' }
            ].map(pref => (
              <div key={pref.id} className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="space-y-0.5">
                  <label htmlFor={pref.id} className="text-sm font-medium text-slate-900 cursor-pointer">{pref.label}</label>
                  <p className="text-sm text-slate-500">{pref.desc}</p>
                </div>
                <div className="flex items-center h-5">
                  <input
                    id={pref.id}
                    type="checkbox"
                    defaultChecked={pref.id !== 'sms-alerts'}
                    className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary focus:ring-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
