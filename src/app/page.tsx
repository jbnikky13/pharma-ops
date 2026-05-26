'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AlertTriangle, Package, TrendingDown, Bell } from 'lucide-react'

interface Stats {
  totalDrugs: number
  lowStock: number
  expiringSoon: number
  activeAlerts: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalDrugs: 0, lowStock: 0, expiringSoon: 0, activeAlerts: 0
  })

  useEffect(() => {
    async function fetchStats() {
      const { count: totalDrugs } = await supabase
        .from('drugs').select('*', { count: 'exact', head: true })

      const { count: lowStock } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .lt('quantity', 50)

      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      const { count: expiringSoon } = await supabase
        .from('inventory')
        .select('*', { count: 'exact', head: true })
        .lt('expiry_date', thirtyDaysFromNow.toISOString())

      const { count: activeAlerts } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('is_resolved', false)

      setStats({
        totalDrugs: totalDrugs || 0,
        lowStock: lowStock || 0,
        expiringSoon: expiringSoon || 0,
        activeAlerts: activeAlerts || 0
      })
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Drugs', value: stats.totalDrugs, icon: Package, color: 'bg-blue-500' },
    { label: 'Low Stock', value: stats.lowStock, icon: TrendingDown, color: 'bg-yellow-500' },
    { label: 'Expiring Soon', value: stats.expiringSoon, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Active Alerts', value: stats.activeAlerts, icon: Bell, color: 'bg-purple-500' },
  ]

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">PharmaOps Dashboard</h1>
      <p className="text-gray-400 mb-8">AI-powered pharmacy inventory intelligence</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <card.icon size={20} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-gray-400 text-sm">{card.label}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
