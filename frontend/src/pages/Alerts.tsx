import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Bell, AlertTriangle, Info, CheckCircle2, MoreVertical, Loader2 } from 'lucide-react'
import api from '@/lib/api'

interface Alert {
  id: number
  type: string
  title: string
  store: string
  time: string
  message: string
}

export default function Alerts() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const res = await api.get('/alerts')
      return res.data as Alert[]
    }
  })

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Alert Center</h1>
          <p className="text-slate-500 mt-1">Real-time notifications and system alerts</p>
        </div>
        <button className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center transition-colors">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p>Analyzing inventory health...</p>
          </div>
        ) : alerts?.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p>All clear! No alerts to display.</p>
          </div>
        ) : (
          alerts?.map(alert => (
            <Card key={alert.id} className={`shadow-sm border-l-4 ${
              alert.type === 'critical' ? 'border-l-red-500' : 
              alert.type === 'warning' ? 'border-l-amber-500' : 
              alert.type === 'info' ? 'border-l-blue-500' : 'border-l-emerald-500'
            }`}>
              <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-shrink-0 mt-1">
                  {alert.type === 'critical' ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                  ) : alert.type === 'warning' ? (
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                  ) : alert.type === 'info' ? (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Info className="w-5 h-5 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
                    <h3 className={`text-lg font-semibold ${
                      alert.type === 'critical' ? 'text-red-700' : 'text-slate-900'
                    }`}>{alert.title}</h3>
                    <span className="text-xs font-medium text-slate-500 mt-1 sm:mt-0">{alert.time}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-600 mb-2">{alert.store}</div>
                  <p className="text-slate-600 text-sm leading-relaxed">{alert.message}</p>
                  
                  {alert.type === 'critical' && (
                    <div className="mt-4 flex gap-3">
                      <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                        Review & Reorder
                      </button>
                      <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-200 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="hidden sm:block">
                  <button className="text-slate-400 hover:text-slate-600 p-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
