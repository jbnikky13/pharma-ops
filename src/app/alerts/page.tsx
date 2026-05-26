'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface Alert {
  id: string
  message: string
  alert_type: string
  is_resolved: boolean
  created_at: string
  drugs: { name: string }
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    async function fetchAlerts() {
      const { data } = await supabase
        .from('alerts')
        .select('*, drugs(name)')
        .eq('is_resolved', false)
        .order('created_at', { ascending: false })
      setAlerts(data || [])
    }
    fetchAlerts()
  }, [])

  async function resolveAlert(id: string) {
    await supabase.from('alerts').update({ is_resolved: true }).eq('id', id)
    setAlerts(alerts.filter(a => a.id !== id))
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Active Alerts</h1>
      <div className="space-y-4">
        {alerts.length === 0 && (
          <p className="text-gray-400">No active alerts. All systems normal.</p>
        )}
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-gray-900 border border-red-900 rounded-xl p-5 flex items-start justify-between">
            <div className="flex gap-3">
              <AlertTriangle className="text-red-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-red-400">{alert.drugs?.name}</p>
                <p className="text-gray-300 text-sm mt-1">{alert.message}</p>
                <p className="text-gray-500 text-xs mt-2">{new Date(alert.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <button
              onClick={() => resolveAlert(alert.id)}
              className="ml-4 text-green-400 hover:text-green-300 flex items-center gap-1 text-sm"
            >
              <CheckCircle size={16} /> Resolve
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
