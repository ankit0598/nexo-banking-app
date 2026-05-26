import { useStore, formatINR } from '../store'
import LoanCard from '../components/LoanCard'

const TODAY = new Date('2026-05-25T00:00:00+05:30')

export default function Loans() {
  const loans = useStore((s) => s.loans)

  const activeLoans = loans.filter((l) => l.status === 'active')
  const totalOutstanding = activeLoans.reduce((s, l) => s + l.outstandingBalance, 0)
  const totalEmi = activeLoans.reduce((s, l) => s + l.emiAmount, 0)

  const upcomingEmis = activeLoans
    .map((l) => ({
      ...l,
      daysLeft: Math.round(
        (new Date(l.nextEmiDate).getTime() - TODAY.getTime()) / 86400000,
      ),
    }))
    .filter((l) => l.daysLeft >= 0 && l.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Loans & EMIs</h1>
        <div className="text-sm text-slate-400 mt-0.5">Outstanding debt & repayment tracker</div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-red-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
            Total Outstanding
          </div>
          <div className="text-2xl font-mono font-bold text-red-400">{formatINR(totalOutstanding)}</div>
        </div>
        <div className="bg-orange-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
            Monthly EMI Outflow
          </div>
          <div className="text-2xl font-mono font-bold text-orange-400">{formatINR(totalEmi)}</div>
        </div>
        <div className="bg-blue-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Active Loans</div>
          <div className="text-2xl font-mono font-bold text-blue-400">{activeLoans.length}</div>
        </div>
      </div>

      {/* Upcoming EMIs */}
      {upcomingEmis.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="text-sm font-semibold text-white mb-3">Upcoming EMIs — Next 30 Days</div>
          <div className="space-y-2">
            {upcomingEmis.map((loan) => (
              <div
                key={loan.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div>
                  <div className="text-sm font-medium text-white">{loan.lender}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Due:{' '}
                    {new Date(loan.nextEmiDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                    })}{' '}
                    ({loan.daysLeft === 0 ? 'Today' : `in ${loan.daysLeft}d`})
                  </div>
                </div>
                <div className="text-sm font-mono font-bold text-orange-400">
                  {formatINR(loan.emiAmount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loan cards */}
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Loan Details
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      </div>
    </div>
  )
}
