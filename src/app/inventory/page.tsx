'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface InventoryItem {
  id: string
  quantity: number
  expiry_date: string
  supplier: string
  drugs: { name: string; category: string; reorder_level: number }
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInventory() {
      const { data } = await supabase
        .from('inventory')
        .select('*, drugs(name, category, reorder_level)')
        .order('quantity', { ascending: true })
      setItems(data || [])
      setLoading(false)
    }
    fetchInventory()
  }, [])

  const getStockStatus = (qty: number, reorderLevel: number) => {
    if (qty === 0) return { label: 'Out of Stock', color: 'text-red-500' }
    if (qty < reorderLevel) return { label: 'Low Stock', color: 'text-yellow-500' }
    return { label: 'In Stock', color: 'text-green-500' }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Inventory</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left py-3">Drug Name</th>
                <th className="text-left py-3">Category</th>
                <th className="text-left py-3">Quantity</th>
                <th className="text-left py-3">Expiry</th>
                <th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const status = getStockStatus(item.quantity, item.drugs?.reorder_level)
                return (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-900">
                    <td className="py-3 font-medium">{item.drugs?.name}</td>
                    <td className="py-3 text-gray-400">{item.drugs?.category}</td>
                    <td className="py-3">{item.quantity}</td>
                    <td className="py-3 text-gray-400">{item.expiry_date}</td>
                    <td className={`py-3 font-medium ${status.color}`}>{status.label}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
