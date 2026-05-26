import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">{children}</div>
      </main>
    </div>
  )
}
