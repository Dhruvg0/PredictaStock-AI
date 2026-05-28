import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Forecasting from './pages/Forecasting'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected SaaS Routes */}
          <Route path="/app" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="forecasting" element={<Forecasting />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
