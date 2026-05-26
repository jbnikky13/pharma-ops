import Link from 'next/link'
import { LayoutDashboard, Package, Bell, PlusCircle } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center gap-8">
      <span className="font-bold text-lg text-green-400">PharmaOps</span>
      <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
        <LayoutDashboard size={16} /> Dashboard
      </Link>
      <Link href="/inventory" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
        <Package size={16} /> Inventory
      </Link>
      <Link href="/alerts" className="flex items-center gap-2 text-gray-300 hover:text-white text-sm">
        <Bell size={16} /> Alerts
      </Link>
      <Link href="/add-drug" className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm ml-auto">
        <PlusCircle size={16} /> Add Drug
      </Link>
    </nav>
  )
}
