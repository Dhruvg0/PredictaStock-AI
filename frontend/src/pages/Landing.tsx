import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PackageSearch, ArrowRight, ShieldCheck, Cpu, Zap, LineChart, Globe, Layers, DollarSign, CheckCircle2, ChevronRight, Server, Database, Network, Brain } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 font-sans selection:bg-primary/30 overflow-x-hidden">
      
      {/* Background ambient noise/glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-900/10 blur-[150px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PackageSearch className="w-6 h-6 text-cyan-400" />
            <span className="font-bold text-lg tracking-tight text-white">PredictaStock AI</span>
          </div>
          <div className="hidden md:flex space-x-8 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#company" className="hover:text-white transition-colors">Company</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white transition-colors uppercase tracking-wider">
              Sign in
            </Link>
            <Link to="/register" className="text-[11px] font-bold bg-cyan-500 text-black px-5 py-2 rounded-full hover:bg-cyan-400 transition-colors uppercase tracking-widest">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 relative z-10 flex flex-col items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 bg-slate-800/40 border border-slate-700/50 text-cyan-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Cpu className="w-3 h-3" />
            <span>AI-Powered Predictions</span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl mb-6 text-white">
              Smarter Inventory.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Zero Stockouts.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto mb-10 font-normal">
              Deploy enterprise-grade predictive models in seconds. PredictaStock transforms raw sales data into decisive actions with unprecedented scale and accuracy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center bg-cyan-500 text-black px-8 py-3 text-xs font-bold rounded-full hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link to="/login" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-xs font-bold rounded-full border border-slate-700 hover:bg-slate-800 hover:text-white text-slate-300 transition-colors uppercase tracking-widest">
                View Documentation <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Futuristic Hero Interactive Element */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 w-full max-w-5xl relative perspective-1000"
          >
            {/* Glowing background behind */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 blur-[100px] -z-10 rounded-full" />
            
            {/* Main floating dashboard panel */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="bg-[#0f1115]/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
              
              {/* Header mockup */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex space-x-4">
                  <div className="w-24 h-2 bg-slate-800 rounded-full" />
                  <div className="w-16 h-2 bg-slate-800 rounded-full" />
                </div>
              </div>

              {/* Grid of UI elements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Chart Mockup */}
                <div className="col-span-2 bg-[#1a1d24] rounded-xl border border-slate-700/30 p-6 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-32 h-3 bg-slate-700 rounded-full" />
                    <div className="w-16 h-4 bg-cyan-500/20 text-cyan-400 text-[10px] uppercase font-bold px-2 flex items-center justify-center rounded-full">+24%</div>
                  </div>
                  
                  {/* Animated Graph lines */}
                  <div className="h-32 w-full flex items-end space-x-2">
                    {[30, 50, 40, 70, 55, 80, 60, 95, 85].map((height, i) => (
                      <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                        className="flex-1 bg-gradient-to-t from-cyan-500/10 to-cyan-400/50 rounded-t-sm"
                      />
                    ))}
                  </div>
                </div>

                {/* Right side widgets */}
                <div className="space-y-6">
                  {/* Status Widget */}
                  <div className="bg-[#1a1d24] rounded-xl border border-slate-700/30 p-6 flex flex-col items-center justify-center relative">
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-cyan-500/5 rounded-xl pointer-events-none" 
                    />
                    <Cpu className="w-8 h-8 text-cyan-400 mb-3" />
                    <div className="text-sm font-bold text-white mb-1">Predictive Core</div>
                    <div className="text-xs text-slate-400">Processing Live Data</div>
                  </div>

                  {/* Alert Widget */}
                  <div className="bg-[#1a1d24] rounded-xl border border-red-500/20 p-4 flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                      <Zap className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <div className="w-20 h-2 bg-slate-700 rounded-full mb-2" />
                      <div className="w-12 h-2 bg-slate-800 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Trusted By Ticker */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-20 mx-auto max-w-5xl py-8 w-full"
          >
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Trusted by Global Enterprises</p>
            <div className="flex flex-wrap justify-between items-center opacity-40 grayscale gap-8 px-8">
               <div className="text-lg font-bold flex items-center tracking-widest">GLOBAL LOGISTICS</div>
               <div className="text-lg font-bold flex items-center italic">NEXUS</div>
               <div className="text-lg font-bold flex items-center tracking-tight"><ShieldCheck className="w-5 h-5 mr-1"/> SYNAPSE</div>
               <div className="text-lg font-bold flex items-center uppercase">Omnicorp</div>
               <div className="text-lg font-bold flex items-center">Vanguard Systems</div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Core Intelligence Pillars */}
      <section id="platform" className="py-24 bg-[#0a0a0a] relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-semibold text-white mb-4">Core Capabilities</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
              The foundational features driving enterprise optimization. PredictaStock operates at the intersection of raw data and actionable intelligence.
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Top Left - Wide */}
            <div className="md:col-span-2 bg-[#111318] border border-slate-800/80 rounded-2xl p-8 flex flex-col justify-between group hover:border-slate-700 transition-colors">
              <Globe className="w-6 h-6 text-cyan-500 mb-20 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Global Visibility</h3>
                <p className="text-sm text-slate-400">
                  Real-time synchronization across your entire multi-store network. Uncover hidden bottlenecks and illuminate dark data silos with unprecedented clarity.
                </p>
              </div>
            </div>
            {/* Top Right - Square */}
            <div className="bg-[#111318] border border-slate-800/80 rounded-2xl p-8 flex flex-col justify-between group hover:border-slate-700 transition-colors">
              <LineChart className="w-6 h-6 text-cyan-500 mb-16 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Demand Forecasting</h3>
                <p className="text-sm text-slate-400">
                  Anticipate demand shifts and market trends weeks before they occur using our proprietary ML models.
                </p>
              </div>
            </div>
            {/* Bottom Left - Square */}
            <div className="bg-[#111318] border border-slate-800/80 rounded-2xl p-8 flex flex-col justify-between group hover:border-slate-700 transition-colors">
              <Zap className="w-6 h-6 text-cyan-500 mb-16 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Instant Alerts</h3>
                <p className="text-sm text-slate-400">
                  Automatic notifications before stockouts happen, allowing you to reorder just in time.
                </p>
              </div>
            </div>
            {/* Bottom Right - Wide */}
            <div className="md:col-span-2 bg-[#111318] border border-slate-800/80 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-end group hover:border-slate-700 transition-colors">
              <div className="max-w-sm mb-6 md:mb-0">
                <h3 className="text-xl font-semibold text-white mb-2">Continuous Learning</h3>
                <p className="text-sm text-slate-400">
                  Models that grow with you. The system continuously ingests sales data to refine its own accuracy.
                </p>
              </div>
              <button className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 border border-cyan-900/50 hover:bg-cyan-900/20 px-4 py-2 rounded flex items-center">
                Explore Features <ArrowRight className="w-3 h-3 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works pipeline */}
      <section className="py-24 bg-[#0a0a0a] relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-2xl font-semibold text-white">From Raw Data to Action</h2>
          </div>

          <div className="max-w-5xl mx-auto relative">
            {/* Connecting Line */}
            <div className="absolute top-12 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-[#111318] border border-slate-800 flex items-center justify-center mb-6 shadow-xl">
                  <Database className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold mb-2">Step 01</p>
                <h4 className="text-lg font-semibold text-white mb-3">Upload Data</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Easily upload your CSV files containing current inventory levels and past sales data.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-[#111318] border border-cyan-900/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <Brain className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold mb-2">Step 02</p>
                <h4 className="text-lg font-semibold text-white mb-3">AI Analysis</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our advanced machine learning models analyze your data to find patterns and predict future trends.
                </p>
              </div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-24 h-24 rounded-full bg-[#111318] border border-slate-800 flex items-center justify-center mb-6 shadow-xl">
                  <Network className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-bold mb-2">Step 03</p>
                <h4 className="text-lg font-semibold text-white mb-3">Get Insights</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Review clear, actionable recommendations on when to reorder stock to maximize profits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Verticals */}
      <section id="solutions" className="py-24 bg-[#0e1015] relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 max-w-5xl mx-auto">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold text-white mb-4">Built for Every Industry</h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tailored solutions designed for the unique complexities of specific high-stakes sectors.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
             <div className="bg-[#151821] p-6 rounded-xl border border-white/5 hover:border-cyan-900/50 transition-colors group">
               <PackageSearch className="w-5 h-5 text-cyan-400 mb-6" />
               <h4 className="text-white font-semibold mb-2">Retailers</h4>
               <p className="text-xs text-slate-400 mb-6 leading-relaxed">Optimize SKU-level inventory across thousands of stores. Reduce stockouts to near zero while minimizing holding costs.</p>
               <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center group-hover:text-cyan-300">Learn More <ArrowRight className="w-3 h-3 ml-2" /></span>
             </div>
             
             <div className="bg-[#151821] p-6 rounded-xl border border-white/5 hover:border-cyan-900/50 transition-colors group">
               <Server className="w-5 h-5 text-cyan-400 mb-6" />
               <h4 className="text-white font-semibold mb-2">Distributors</h4>
               <p className="text-xs text-slate-400 mb-6 leading-relaxed">Predict shortages before they impact partners. Synchronize multi-tier supplier networks dynamically.</p>
               <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center group-hover:text-cyan-300">Learn More <ArrowRight className="w-3 h-3 ml-2" /></span>
             </div>

             <div className="bg-[#151821] p-6 rounded-xl border border-white/5 hover:border-cyan-900/50 transition-colors group">
               <Globe className="w-5 h-5 text-cyan-400 mb-6" />
               <h4 className="text-white font-semibold mb-2">E-Commerce</h4>
               <p className="text-xs text-slate-400 mb-6 leading-relaxed">Dynamic capacity forecasting to handle seasonal spikes and mitigate disruption impacts in real-time.</p>
               <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center group-hover:text-cyan-300">Learn More <ArrowRight className="w-3 h-3 ml-2" /></span>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#0a0a0a] relative z-10 border-t border-white/5 flex flex-col items-center">
        <div className="text-center max-w-2xl px-6">
          <h2 className="text-4xl font-semibold text-white mb-6">Ready to optimize?</h2>
          <p className="text-sm text-slate-400 mb-10 font-normal leading-relaxed">
            Join the enterprises defining the next era of inventory operations. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-cyan-500 text-black px-8 py-3 text-xs font-bold rounded-full hover:bg-cyan-400 transition-colors uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              Get Started Now
            </Link>
            <Link to="/login" className="px-8 py-3 text-xs font-bold rounded-full border border-slate-700 hover:bg-slate-800 text-white transition-colors uppercase tracking-widest">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-[#050505] pt-16 pb-8 border-t border-white/5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <PackageSearch className="w-5 h-5 text-slate-300" />
                <span className="font-semibold text-sm tracking-tight text-white">PredictaStock AI</span>
              </div>
              <p className="max-w-xs mb-6">Powering data-driven inventory operations globally.</p>
              <div className="flex space-x-4">
                 <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-white">X</div>
                 <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-white">in</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-widest text-[10px]">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-widest text-[10px]">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase tracking-widest text-[10px]">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
               <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
            <p>© 2026 PredictaStock Systems Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
