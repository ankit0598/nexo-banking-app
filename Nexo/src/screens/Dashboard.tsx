import NetWorthHero from '../components/NetWorthHero'
import WealthBreakdown from '../components/WealthBreakdown'
import UpcomingPayments from '../components/UpcomingPayments'
import RecentTransactions from '../components/RecentTransactions'
import HealthScore from '../components/HealthScore'
import { useStore, formatINR } from '../store'

export default function Dashboard() {
  const user = useStore((s) => s.user)
  const holdings = useStore((s) => s.holdings)

  const now = new Date('2026-05-25T10:30:00+05:30')
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user.fullName.split(' ')[0]

  const totalDayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0)
  const totalPortfolio = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const topMovers = [...holdings]
    .sort((a, b) => Math.abs(b.dayChange) - Math.abs(a.dayChange))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <div className="text-sm text-slate-400">{greeting},</div>
        <h1 className="text-2xl font-bold text-white">{firstName} Mehta</h1>
        <div className="text-xs text-slate-500 mt-0.5">
          {now.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Section 1: Net Worth Hero */}
      <NetWorthHero />

      {/* Section 2: Financial Health Score */}
      <HealthScore />

      {/* Section 3: Wealth Snapshot */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <WealthBreakdown />

        {/* Portfolio Today */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-white">Portfolio Today</div>
            <div
              className={`text-sm font-mono font-semibold ${
                totalDayChange >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {totalDayChange >= 0 ? '▲ +' : '▼ '}
              {formatINR(Math.abs(totalDayChange))}
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-white mb-4">
            {formatINR(totalPortfolio)}
          </div>
          <div className="space-y-2">
            {topMovers.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl"
              >
                <div>
                  <div className="text-xs font-medium text-white truncate max-w-[160px]">
                    {h.name}
                  </div>
                  <div className="text-[10px] text-slate-500">{h.assetClass.replace('_', ' ')}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-semibold text-white">
                    {formatINR(h.currentValue)}
                  </div>
                  {h.dayChange !== 0 && (
                    <div
                      className={`text-[10px] font-mono ${
                        h.dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {h.dayChange >= 0 ? '+' : ''}
                      {formatINR(h.dayChange)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Upcoming Payments */}
      <UpcomingPayments />

      {/* Section 4: Recent Activity */}
      <RecentTransactions limit={5} title="Recent Activity" showViewAll />
    </div>
  )
}
