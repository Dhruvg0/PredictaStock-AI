import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Filter, AlertCircle, CheckCircle2, Loader2, ArrowRight, UploadCloud, Plus, X, Server, Database, Eye, Trash2 } from 'lucide-react'
import api from '@/lib/api'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'

interface InventoryItem {
  id: number
  store_id: string
  store_name: string
  product_sku: string
  product_name: string
  quantity_on_hand: number
  reorder_threshold: number
  risk_level: string
  days_stock_left: number
}

interface AddProductForm {
  product_sku: string
  product_name: string
  store_name: string
  quantity_on_hand: number
  reorder_threshold: number
}

export default function Inventory() {
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const queryClient = useQueryClient()
  
  const { data: items, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await api.get('/inventory')
      return res.data as InventoryItem[]
    }
  })

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<AddProductForm>()

  const addMutation = useMutation({
    mutationFn: async (data: AddProductForm) => {
      await api.post('/inventory', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      setShowAddModal(false)
      reset()
    }
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
      setShowUploadModal(false)
      setUploadFile(null)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ ids, deleteAll }: { ids?: number[], deleteAll?: boolean }) => {
      await api.delete('/inventory/bulk', { data: { ids, delete_all: deleteAll } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      setSelectedIds(new Set())
    }
  })

  const onSubmitAdd = (data: AddProductForm) => {
    addMutation.mutate(data)
  }

  const onUpload = () => {
    if (uploadFile) {
      uploadMutation.mutate(uploadFile)
    }
  }

  const filtered = items?.filter(item => 
    item.product_name.toLowerCase().includes(search.toLowerCase()) || 
    item.store_name.toLowerCase().includes(search.toLowerCase())
  ) || []

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(i => i.id)))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedIds.size > 0 && confirm('Are you sure you want to delete the selected items?')) {
      deleteMutation.mutate({ ids: Array.from(selectedIds) })
    }
  }

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete ALL inventory data? This cannot be undone.')) {
      deleteMutation.mutate({ deleteAll: true })
    }
  }

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-1">Product Inventory</h1>
          <p className="text-sm text-slate-400 font-normal tracking-wide">Explore and manage stock levels.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.size > 0 && (
             <button 
               onClick={handleDeleteSelected}
               disabled={deleteMutation.isPending}
               className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-lg font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center shadow-sm disabled:opacity-50"
             >
               <Trash2 className="w-4 h-4 mr-2" /> Delete Selected ({selectedIds.size})
             </button>
          )}
          <button 
             onClick={handleDeleteAll}
             disabled={deleteMutation.isPending || items?.length === 0}
             className="bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-900/50 px-5 py-2.5 rounded-lg font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center shadow-sm disabled:opacity-50"
          >
             <Trash2 className="w-4 h-4 mr-2" /> Delete All Data
          </button>

          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700 px-5 py-2.5 rounded-lg font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center shadow-sm"
          >
            <Database className="w-4 h-4 mr-2" /> Bulk Upload
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-5 py-2.5 rounded-lg font-semibold text-[11px] uppercase tracking-widest transition-all flex items-center shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </button>
        </div>
      </div>

      <div className="bg-[#111318]/60 backdrop-blur-md rounded-2xl border border-slate-800/80 shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-b border-slate-800/80 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              placeholder="Search products..."
              className="pl-10 h-10 w-full rounded-lg border border-slate-700 bg-[#0a0a0a] text-white px-3 py-1 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/50 focus-visible:border-cyan-500 placeholder-slate-600"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-700 h-10 px-4 py-2 text-[11px] uppercase tracking-widest font-semibold text-slate-300 hover:text-white transition-colors w-full sm:w-auto">
            <Filter className="mr-2 h-4 w-4 text-cyan-500" />
            Filters
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 bg-[#0a0a0a]/50">
              <tr className="text-left text-[10px] uppercase tracking-widest font-semibold text-slate-400">
                <th className="px-6 py-4 align-middle w-12 text-center">
                   <input 
                      type="checkbox" 
                      className="rounded border-slate-700 bg-slate-800/50 text-cyan-500 focus:ring-cyan-500"
                      checked={filtered.length > 0 && selectedIds.size === filtered.length}
                      onChange={toggleAll}
                   />
                </th>
                <th className="px-6 py-4 align-middle">Product Name</th>
                <th className="px-6 py-4 align-middle">Store Location</th>
                <th className="px-6 py-4 align-middle text-right">Quantity</th>
                <th className="px-6 py-4 align-middle">Status</th>
                <th className="px-6 py-4 align-middle text-right">Est. Days Left</th>
                <th className="px-6 py-4 align-middle text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading || deleteMutation.isPending ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-500 mb-4" />
                    <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Processing data...</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-16 text-center text-slate-500">
                    <Server className="w-10 h-10 mx-auto text-slate-700 mb-4" />
                    <p className="text-sm font-medium">No products available.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-slate-800/30 group">
                    <td className="px-6 py-4 align-middle text-center">
                       <input 
                          type="checkbox" 
                          className="rounded border-slate-700 bg-slate-800/50 text-cyan-500 focus:ring-cyan-500"
                          checked={selectedIds.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                       />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="font-semibold text-slate-200">{item.product_name}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.product_sku}</div>
                    </td>
                    <td className="px-6 py-4 align-middle text-slate-400 font-medium">{item.store_name}</td>
                    <td className="px-6 py-4 align-middle text-right text-cyan-400 font-semibold">{item.quantity_on_hand}</td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center">
                        {item.risk_level === 'High Risk' ? (
                          <span className="flex items-center text-red-400 font-semibold text-[10px] uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                            <AlertCircle className="w-3 h-3 mr-1.5" /> Critical
                          </span>
                        ) : item.risk_level === 'Medium Risk' ? (
                          <span className="flex items-center text-amber-400 font-semibold text-[10px] uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3 mr-1.5" /> Warning
                          </span>
                        ) : (
                          <span className="flex items-center text-emerald-400 font-semibold text-[10px] uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1.5" /> Good
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle text-right text-slate-300 font-medium">{Math.round(item.days_stock_left)}</td>
                    <td className="px-6 py-4 align-middle text-right">
                      <Link to={`/app/forecasting?item=${item.id}`} className="inline-flex items-center justify-center bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 p-2 rounded-lg transition-all group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal (Glassmorphic) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] rounded-2xl shadow-2xl border border-cyan-500/20 w-full max-w-md overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800/80">
              <h2 className="text-lg font-semibold text-white">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitAdd)} className="p-6 space-y-5">
              {addMutation.isError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold uppercase tracking-widest text-center shadow-inner">Failed to add product.</div>
              )}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">SKU Code</label>
                <input {...register('product_sku', { required: true })} className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm shadow-inner transition-all" placeholder="e.g. PRD-12345" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Product Name</label>
                <input {...register('product_name', { required: true })} className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm shadow-inner transition-all" placeholder="e.g. Fresh Milk" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Store Location</label>
                <input {...register('store_name', { required: true })} className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm shadow-inner transition-all" placeholder="e.g. Downtown Branch" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Quantity</label>
                  <input type="number" {...register('quantity_on_hand', { required: true, valueAsNumber: true })} className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm shadow-inner transition-all" placeholder="0" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Reorder Level</label>
                  <input type="number" {...register('reorder_threshold', { required: true, valueAsNumber: true })} className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm shadow-inner transition-all" placeholder="0" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-[10px] font-semibold text-slate-400 hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-[10px] font-semibold text-black bg-cyan-500 hover:bg-cyan-400 rounded-lg uppercase tracking-widest flex items-center disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  {isSubmitting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : null}
                  Save Product
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bulk Upload Modal (Glassmorphic) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111318] rounded-2xl shadow-2xl border border-cyan-500/20 w-full max-w-md overflow-hidden relative"
          >
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
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                
                <Database className="w-10 h-10 text-slate-600 group-hover:text-cyan-400 mx-auto mb-4 transition-colors pointer-events-none" />
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
