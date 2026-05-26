import { NavLink } from 'react-router-dom'
import { useStore } from '../store'

interface NavItem {
  to: string
  label: string
  icon: JSX.Element
}

const iconClass = 'w-5 h-5 shrink-0'

const homeIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z" />
  </svg>
)
const walletIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7a2 2 0 0 1 2-2h12l4 3v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="M16 13h3" />
  </svg>
)
const sendIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </svg>
)
const cardIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
)
const receiptIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1.5L8 22l2-1.5L12 22l2-1.5L16 22l2-1.5L20 22V2L18 3.5 16 2l-2 1.5L12 2l-2 1.5L8 2 6 3.5Z" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
)
const trendingUpIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
)
const buildingIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-4h6v4" />
    <path d="M9 11h2M13 11h2M9 15h2M13 15h2" />
  </svg>
)
const shieldIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
)
const targetIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)
const chartIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="M7 15l4-5 4 3 5-7" />
  </svg>
)
const userIcon = (
  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
)

const overviewItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: homeIcon },
]

const bankingItems: NavItem[] = [
  { to: '/accounts', label: 'Accounts', icon: walletIcon },
  { to: '/cards', label: 'Cards', icon: cardIcon },
  { to: '/transfer', label: 'Transfer & Pay', icon: sendIcon },
  { to: '/bills', label: 'Bills', icon: receiptIcon },
]

const wealthItems: NavItem[] = [
  { to: '/investments', label: 'Investments', icon: trendingUpIcon },
  { to: '/loans', label: 'Loans & EMIs', icon: buildingIcon },
  { to: '/insurance', label: 'Insurance', icon: shieldIcon },
  { to: '/goals', label: 'Goals', icon: targetIcon },
]

const analyticsItems: NavItem[] = [
  { to: '/insights', label: 'Insights', icon: chartIcon },
]

const profileItems: NavItem[] = [
  { to: '/profile', label: 'Profile & Settings', icon: userIcon },
]

const itemClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
    isActive
      ? 'bg-blue-500/10 text-blue-300'
      : 'text-slate-400 hover:text-white hover:bg-white/5',
  ].join(' ')

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
        {label}
      </div>
      <nav className="flex flex-col gap-0.5 mb-5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={itemClass}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-blue-400 rounded-r" />
                )}
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

export default function Sidebar() {
  const user = useStore((s) => s.user)

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-slate-900/40 border-r border-white/5 px-4 py-6 overflow-y-auto">
      {/* Brand / User */}
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
          N
        </div>
        <div>
          <div className="text-sm font-bold text-white">Nexo</div>
          <div className="text-[11px] text-slate-500">Wealth Super-App</div>
        </div>
      </div>

      {/* User chip */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl mb-6 border border-white/5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {user.fullName.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-white truncate">{user.fullName}</div>
          <div className="text-[10px] font-mono text-slate-500">{user.customerId}</div>
        </div>
      </div>

      <NavSection label="Overview" items={overviewItems} />
      <NavSection label="Banking" items={bankingItems} />
      <NavSection label="Wealth" items={wealthItems} />
      <NavSection label="Analytics" items={analyticsItems} />

      <div className="mt-auto">
        <div className="border-t border-white/5 pt-4">
          <NavSection label="Account" items={profileItems} />
        </div>
        <div className="px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-0.5">KYC Status</div>
          <div className="text-xs font-semibold text-emerald-300">✓ Verified</div>
        </div>
      </div>
    </aside>
  )
}
