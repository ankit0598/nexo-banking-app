import { useNavigate } from 'react-router-dom'

interface ActionTile {
  label: string
  to: string
  icon: JSX.Element
  tint: string
}

const tiles: ActionTile[] = [
  {
    label: 'Pay',
    to: '/transfer',
    tint: 'from-emerald-500/20 to-emerald-500/5 text-emerald-300',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    ),
  },
  {
    label: 'Transfer',
    to: '/transfer',
    tint: 'from-blue-500/20 to-blue-500/5 text-blue-300',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m17 3 4 4-4 4" />
        <path d="M21 7H7a4 4 0 0 0-4 4v0" />
        <path d="m7 21-4-4 4-4" />
        <path d="M3 17h14a4 4 0 0 0 4-4v0" />
      </svg>
    ),
  },
  {
    label: 'Scan QR',
    to: '/transfer',
    tint: 'from-purple-500/20 to-purple-500/5 text-purple-300',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 14h3v3M21 14v3M14 21h7" />
      </svg>
    ),
  },
  {
    label: 'Bills',
    to: '/bills',
    tint: 'from-amber-500/20 to-amber-500/5 text-amber-300',
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1.5L8 22l2-1.5L12 22l2-1.5L16 22l2-1.5L20 22V2L18 3.5 16 2l-2 1.5L12 2l-2 1.5L8 2 6 3.5Z" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {tiles.map((t) => (
        <button
          key={t.label}
          onClick={() => navigate(t.to)}
          className={`bg-gradient-to-br ${t.tint} border border-white/10 hover:border-white/20 rounded-xl p-4 flex flex-col items-start gap-3 transition-all hover:-translate-y-0.5`}
        >
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
            {t.icon}
          </div>
          <div className="text-sm font-semibold text-white">{t.label}</div>
        </button>
      ))}
    </div>
  )
}
