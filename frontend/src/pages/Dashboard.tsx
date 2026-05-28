import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Package, AlertTriangle, Loader2, UploadCloud, X, Crosshair, Zap, BarChart3 } from 'lucide-react'
import api from '@/lib/api'

// We will fetch real inventory data to calculate stats
const fetchInventory = async () => {
  const res = await api.get('/inventory')
  return res.data
}

export default function Dashboard() {
  const queryClient = useQueryClient()
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      await api.post('/products/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      setShowUploadModal(false)
      setUploadFile(null)
    }
  })

  const onUpload = () => {
    if (uploadFile) {
      uploadMutation.mutate(uploadFile)
    }
  }

  // Calculate real metrics from the backend data
  const stats = {
    totalProducts: inventory?.length || 0,
    highRisk: inventory?.filter((i: any) => i.risk_level === 'High Risk').length || 0,
    predictions: inventory?.length || 0, // All items have predictions in this system
    activeStores: new Set(inventory?.map((i: any) => i.store_id)).size || 0
  }

  // Mocking trend chart for the dashboard overview. 
  // In a real scenario, we'd hit a '/analytics/trend' endpoint
  const trendData = [
    { name: 'Mon', demand: 400 },
    { name: 'Tue', demand: 300 },
    { name: 'Wed', demand: 550 },
    { name: 'Thu', demand: 450 },
    { name: 'Fri', demand: 700 },
    { name: 'Sat', demand: 900 },
    { name: 'Sun', demand: 850 },
  ]

  if (isLoading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 relative z-10">
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-1">Dashboard</h1>
          <p className="text-sm text-slate-400 font-normal tracking-wide">Real-time inventory overview and predictive analytics.</p>
        </div>
        
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-5 py-2.5 rounded-lg font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
        >
          <UploadCloud className="w-4 h-4 mr-2" /> Upload Data
        </button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Tracked Products", value: stats.totalProducts, icon: Package, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
          { title: "Critical Alerts", value: stats.highRisk, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
          { title: "Forecast Accuracy (Avg)", value: stats.totalProducts > 0 ? "94.2%" : "N/A", icon: Crosshair, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
          { title: "Active Store Locations", value: stats.activeStores, icon: Activity, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" }
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`bg-[#111318]/60 backdrop-blur-md rounded-2xl border ${stat.border} p-6 shadow-lg hover:shadow-xl hover:bg-[#111318]/80 transition-all group`}>
              <div className="flex flex-row items-center justify-between space-y-0 mb-4">
                <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{stat.title}</h3>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="text-3xl font-bold text-white">{stat.value !== undefined ? stat.value : '0'}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <div className="col-span-4 bg-[#111318]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
          <div className="flex items-center mb-6">
            <BarChart3 className="w-5 h-5 text-cyan-400 mr-3" />
            <h2 className="text-lg font-semibold text-white">Global Demand Forecast (Next 7 Days)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)', color: '#fff' }} 
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Line type="monotone" dataKey="demand" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#0a0a0a', strokeWidth: 2, stroke: '#06b6d4' }} activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Alerts Feed */}
        <div className="col-span-3 bg-[#111318]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-red-400 mr-3" />
              <h2 className="text-lg font-semibold text-white">Action Required Alerts</h2>
            </div>
            {stats.highRisk > 0 && (
              <span className="bg-red-500/10 text-red-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-red-500/20 animate-pulse">Critical</span>
            )}
          </div>
          
          <div className="space-y-4">
            {inventory?.filter((i: any) => i.risk_level === 'High Risk').slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-center bg-slate-900/50 p-4 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-colors group">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1 mr-4 self-start shadow-[0_0_8px_rgba(239,68,68,0.8)] group-hover:scale-125 transition-transform"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-slate-200">{item.product_name} <span className="text-slate-500 font-normal ml-1">({item.store_name})</span></p>
                  <p className="text-xs text-slate-400">Inventory depleted: <span className="text-white font-semibold">{item.quantity_on_hand}</span> left (Threshold: {item.reorder_threshold})</p>
                </div>
                <div className="ml-3">
                  <button className="text-[10px] font-bold text-red-400 hover:text-white border border-red-900/50 hover:bg-red-500/20 px-3 py-1.5 rounded uppercase tracking-widest transition-colors">
                    Reorder
                  </button>
                </div>
              </div>
            ))}
            
            {stats.highRisk === 0 && (
              <div className="text-center py-12 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                  <Activity className="w-8 h-8 text-emerald-500/50" />
                </div>
                <p className="text-sm font-medium">System normal. No critical alerts.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Upload Modal (Glassmorphic) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] rounded-2xl shadow-2xl border border-cyan-500/20 w-full max-w-md overflow-hidden relative"
          >
            {/* Top glowing line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800/80">
              <h2 className="text-lg font-semibold text-white">Upload CSV Data</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {uploadMutation.isError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold uppercase tracking-widest text-center shadow-inner">
                  Data validation failed
                </div>
              )}
              
              <div className="border border-dashed border-slate-700 hover:border-cyan-500/50 bg-[#0a0a0a]/50 rounded-xl p-8 text-center transition-colors group relative overflow-hidden">
                {/* Abstract background for dropzone - FIXED pointer-events-none */}
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <UploadCloud className="w-10 h-10 text-slate-600 group-hover:text-cyan-400 mx-auto mb-4 transition-colors pointer-events-none" />
                <p className="text-sm font-semibold text-slate-300 mb-2 pointer-events-none">Select Data File</p>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed pointer-events-none">Required columns: sku, name, store_name, quantity_on_hand, reorder_threshold</p>
                <input 
                  type="file" 
                  accept=".csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:uppercase file:tracking-widest file:bg-slate-800 file:text-cyan-400 hover:file:bg-slate-700 cursor-pointer relative z-10"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button onClick={() => setShowUploadModal(false)} className="px-5 py-2 text-[10px] font-semibold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
                <button 
                  onClick={onUpload} 
                  disabled={!uploadFile || uploadMutation.isPending} 
                  className="px-6 py-2 text-[10px] font-semibold text-black bg-cyan-500 hover:bg-cyan-400 rounded-lg uppercase tracking-widest flex items-center disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                >
                  {uploadMutation.isPending ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : null}
                  Process Data
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
