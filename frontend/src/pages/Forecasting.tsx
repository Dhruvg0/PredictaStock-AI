import { useQuery } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { Brain, TrendingUp, AlertTriangle, Loader2, ArrowLeft, Target, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '@/lib/api'

export default function Forecasting() {
  const [searchParams] = useSearchParams()
  const inventoryId = searchParams.get('item') || '1' // Default to 1 for demo purposes
  
  const { data: forecast, isLoading: isForecastLoading } = useQuery({
    queryKey: ['forecast', inventoryId],
    queryFn: async () => {
      const res = await api.get(`/forecasting/predict/${inventoryId}`)
      return res.data
    }
  })

  // Generate chart data showing historical vs forecast
  // In a real system, we'd fetch actual historical timeline from the backend
  const chartData = [
    { day: 'Day -3', demand: 32, type: 'historical' },
    { day: 'Day -2', demand: 41, type: 'historical' },
    { day: 'Day -1', demand: 38, type: 'historical' },
    { day: 'Today', demand: 45, type: 'historical' },
    { day: 'Day +1', forecast: forecast?.forecasted_demand_next_day || 48, type: 'forecast' },
    { day: 'Day +2', forecast: (forecast?.forecasted_demand_next_day || 48) * 1.1, type: 'forecast' },
    { day: 'Day +3', forecast: (forecast?.forecasted_demand_next_day || 48) * 0.9, type: 'forecast' },
  ]

  return (
    <div className="space-y-8 relative z-10">
      <Link to="/app/inventory" className="inline-flex items-center text-[10px] uppercase tracking-widest font-semibold text-cyan-400 hover:text-cyan-300 transition-colors mb-2">
        <ArrowLeft className="w-3 h-3 mr-1" /> Back to Inventory
      </Link>
      
      <div>
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-1 flex items-center">
          <Brain className="w-8 h-8 mr-3 text-cyan-400" /> Forecasting Analysis
        </h1>
        <p className="text-sm text-slate-400 font-normal tracking-wide">Machine learning predictions for product ID <span className="font-semibold text-cyan-400">#{inventoryId}</span></p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-[#111318]/80 backdrop-blur-md rounded-2xl border border-cyan-500/20 p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="flex items-center mb-4 text-cyan-400">
            <Target className="w-4 h-4 mr-2" />
            <h3 className="text-[11px] font-semibold uppercase tracking-widest">Next Day Forecast</h3>
          </div>
          <div>
            {isForecastLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
            ) : (
              <div>
                <div className="text-4xl font-bold text-white">
                  {Math.round(forecast?.forecasted_demand_next_day || 0)} <span className="text-sm font-semibold text-cyan-500/50 uppercase">units</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">Expected demand</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-[#111318]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-lg">
          <div className="flex items-center mb-4 text-emerald-400">
            <TrendingUp className="w-4 h-4 mr-2" />
            <h3 className="text-[11px] font-semibold uppercase tracking-widest">Demand Trend</h3>
          </div>
          <div>
             <div className="text-4xl font-bold text-white">+12.4%</div>
             <p className="text-xs text-emerald-500 mt-2 font-medium flex items-center">Trending upwards</p>
          </div>
        </div>

        <div className="bg-[#111318]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-lg">
          <div className="flex items-center mb-4 text-amber-400">
            <Zap className="w-4 h-4 mr-2" />
            <h3 className="text-[11px] font-semibold uppercase tracking-widest">Stockout Risk</h3>
          </div>
          <div>
             <div className="text-4xl font-bold text-amber-500">18%</div>
             <p className="text-xs text-slate-400 mt-2 font-medium">Moderate risk (7 Days)</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111318]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        <h2 className="text-lg font-semibold text-white mb-6">Historical vs Forecasted Demand</h2>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#334155" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#334155" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', color: '#fff' }} 
              />
              <Area type="monotone" dataKey="demand" stroke="#475569" strokeWidth={2} fillOpacity={1} fill="url(#colorDemand)" />
              <Area type="monotone" dataKey="forecast" stroke="#06b6d4" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
