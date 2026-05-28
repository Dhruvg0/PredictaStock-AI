import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, List, TrendingUp, Bell, Settings, PackageSearch, LogOut, Search, Command } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { motion, AnimatePresence } from 'framer-motion'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', href: '/app/inventory', icon: List },
    { name: 'Forecasting', href: '/app/forecasting', icon: TrendingUp },
    { name: 'Alerts', href: '/app/alerts', icon: Bell },
  ]

  const bottomNav = [
    { name: 'Settings', href: '/app/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-50 selection:bg-primary/30 relative">
      
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* Floating Sidebar Container */}
      <div className="hidden md:flex p-4 pr-0 h-full">
        <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-2xl flex flex-col shadow-glass relative overflow-hidden">
          
          {/* subtle top inner glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Logo Area */}
          <div className="flex items-center h-20 px-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center mr-3 shadow-glow">
              <PackageSearch className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              PredictaStock
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Operations</div>
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  {item.name}
                </Link>
              )
            })}

            <div className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-2">System</div>
            {bottomNav.map((item) => {
              const isActive = location.pathname.startsWith(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'text-white bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-3 transition-colors ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-400'}`} />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* User Profile Area */}
          <div className="p-4 m-3 mt-0 rounded-xl bg-slate-950/50 border border-slate-800/50 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center font-semibold text-sm shadow-inner shrink-0">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {user?.full_name || 'Admin User'}
                  </span>
                  <span className="text-xs text-slate-500 truncate">
                    Enterprise Plan
                  </span>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header (Search & Command) */}
        <header className="h-20 flex items-center justify-between px-8 z-10">
          
          {/* Mobile logo */}
          <div className="md:hidden flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center mr-3 shadow-glow">
              <PackageSearch className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">PredictaStock</span>
          </div>

          <div className="hidden md:flex flex-1 max-w-md relative group">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search across your enterprise..." 
              className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:bg-slate-900/80 focus:ring-1 focus:ring-primary/50 transition-all backdrop-blur-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-flex items-center gap-1 bg-slate-800/80 border border-slate-700/50 px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400">
                <Command className="w-3 h-3" /> K
              </kbd>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             {/* Notification Bell */}
             <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50">
               <Bell className="w-5 h-5" />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
             </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
