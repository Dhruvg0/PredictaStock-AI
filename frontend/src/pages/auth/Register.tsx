import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '@/lib/api'
import { PackageSearch, Loader2, Cpu } from 'lucide-react'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('')
      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        full_name: data.full_name
      })
      // Auto-redirect to login with a success message (in a real app, you might use a toast)
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-4 font-sans text-slate-50 selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Ambient glowing background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-900/10 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 py-12">
        <Link to="/" className="flex flex-col items-center justify-center mb-10 group hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <PackageSearch className="w-6 h-6 text-black" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">PredictaStock AI</span>
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-cyan-400 font-bold mt-2 border border-cyan-900/50 bg-cyan-900/10 px-3 py-1 rounded-full">
            <Cpu className="w-3 h-3" />
            <span>Infrastructure Setup</span>
          </div>
        </Link>

        <div className="bg-[#111318]/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-white mb-2">Initialize Account</h1>
            <p className="text-slate-400 text-sm font-light">Deploy PredictaStock AI for your supply chain</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium text-center shadow-inner">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
              <input 
                type="text"
                {...register('full_name')}
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm shadow-inner"
                placeholder="Operator Name"
              />
              {errors.full_name && <p className="text-xs text-red-400 mt-1">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input 
                type="email"
                {...register('email')}
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm shadow-inner"
                placeholder="operator@enterprise.com"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key Phrase</label>
              <input 
                type="password"
                {...register('password')}
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm shadow-inner"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Confirm Key Phrase</label>
              <input 
                type="password"
                {...register('confirm_password')}
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-sm shadow-inner"
                placeholder="••••••••"
              />
              {errors.confirm_password && <p className="text-xs text-red-400 mt-1">{errors.confirm_password.message}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-widest rounded-lg px-4 py-4 mt-6 transition-all flex items-center justify-center disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 font-light">
            Already authorized? <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
