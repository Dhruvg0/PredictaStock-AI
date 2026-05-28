import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { PackageSearch, Loader2, Cpu } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('')
      const formData = new URLSearchParams()
      formData.append('username', data.email)
      formData.append('password', data.password)
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      // If VITE_API_URL already has /api, don't duplicate it
      const loginUrl = apiUrl.endsWith('/api') ? `${apiUrl}/auth/token` : `${apiUrl}/api/auth/token`
      
      // Use raw axios to prevent any interceptor interference and force form-urlencoded
      const response = await axios.post(loginUrl, formData.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      const token = response.data.access_token
      
      // Fetch user profile using the configured api client
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const userRes = await api.get('/auth/me')
      
      setAuth(token, userRes.data)
      navigate('/app/dashboard')
    } catch (err: any) {
      console.log(err.response?.data)
      setError(err.response?.data?.detail || 'Failed to login. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] p-4 font-sans text-slate-50 selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Ambient glowing background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-cyan-900/10 blur-[120px]"></div>
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] rounded-full bg-blue-900/10 blur-[150px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex flex-col items-center justify-center mb-10 group hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <PackageSearch className="w-6 h-6 text-black" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-white">PredictaStock AI</span>
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-cyan-400 font-bold mt-2 border border-cyan-900/50 bg-cyan-900/10 px-3 py-1 rounded-full">
            <Cpu className="w-3 h-3" />
            <span>Secure Node Login</span>
          </div>
        </Link>

        <div className="bg-[#111318]/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm font-normal">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm font-medium text-center shadow-inner">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input 
                type="email"
                {...register('email')}
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm shadow-inner"
                placeholder="operator@enterprise.com"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot key?</a>
              </div>
              <input 
                type="password"
                {...register('password')}
                className="w-full bg-[#0a0a0a] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all text-sm shadow-inner"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs uppercase tracking-widest rounded-lg px-4 py-4 mt-6 transition-all flex items-center justify-center disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 font-normal">
            No account? <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

