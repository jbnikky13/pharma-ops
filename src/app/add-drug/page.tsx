'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddDrug() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    name: '', category: '', unit: 'tablets',
    reorder_level: 50, quantity: 0,
    expiry_date: '', supplier: '', cost_price: 0
  })

  async function handleSubmit() {
    setLoading(true)
    setMessage('')

    const { data: drug, error: drugError } = await supabase
      .from('drugs')
      .insert({ 
        name: form.name, 
        category: form.category, 
        unit: form.unit,
        reorder_level: form.reorder_level 
      })
      .select()
      .single()

    if (drugError) {
      setMessage('Error adding drug: ' + drugError.message)
      setLoading(false)
      return
    }

    const { error: invError } = await supabase
      .from('inventory')
      .insert({
        drug_id: drug.id,
        quantity: form.quantity,
        expiry_date: form.expiry_date,
        supplier: form.supplier,
        cost_price: form.cost_price
      })

    if (invError) {
      setMessage('Error adding inventory: ' + invError.message)
    } else {
      setMessage('Drug added successfully!')
      setTimeout(() => router.push('/inventory'), 1500)
    }
    setLoading(false)
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-400"
  const labelClass = "block text-gray-400 text-sm mb-1"

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Drug</h1>

      <div className="max-w-xl bg-gray-900 rounded-xl p-6 border border-gray-800 space-y-4">
        <div>
          <label className={labelClass}>Drug Name *</label>
          <input className={inputClass} placeholder="e.g. Amoxicillin"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <input className={inputClass} placeholder="e.g. Antibiotic"
            value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Unit</label>
            <select className={inputClass}
              value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
              <option>tablets</option>
              <option>capsules</option>
              <option>sachets</option>
              <option>vials</option>
              <option>bottles</option>
              <option>ampoules</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Reorder Level</label>
            <input type="number" className={inputClass}
              value={form.reorder_level} onChange={e => setForm({...form, reorder_level: +e.target.value})} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Current Quantity *</label>
            <input type="number" className={inputClass}
              value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Cost Price (₦)</label>
            <input type="number" className={inputClass}
              value={form.cost_price} onChange={e => setForm({...form, cost_price: +e.target.value})} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Expiry Date</label>
          <input type="date" className={inputClass}
            value={form.expiry_date} onChange={e => setForm({...form, expiry_date: e.target.value})} />
        </div>

        <div>
          <label className={labelClass}>Supplier</label>
          <input className={inputClass} placeholder="e.g. Emzor Pharmaceuticals"
            value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})} />
        </div>

        {message && (
          <p className={`text-sm ${message.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !form.name || !form.quantity}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 text-black font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : 'Add Drug'}
        </button>
      </div>
    </main>
  )
}
