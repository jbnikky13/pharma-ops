import Navbar from '@/components/Navbar'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
