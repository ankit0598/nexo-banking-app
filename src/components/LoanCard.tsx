import { formatINR } from '../store'
import type { Loan } from '../types'

const loanTypeLabel: Record<string, string> = {
  home: 'Home Loan',
  personal: 'Personal Loan',
  car: 'Car Loan',
}

const loanTypeColor: Record<string, string> = {
  home: 'text-blue-400 bg-blue-500/10',
  personal: 'text-orange-400 bg-orange-500/10',
  car: 'text-cyan-400 bg-cyan-500/10',
}

const loanTypeIcon: Record<string, string> = {
  home: '🏠',
  personal: '💼',
  car: '🚗',
}

const TODAY = new Date('2026-05-25T00:00:00+05:30')

export interface LoanCardProps {
  loan: Loan
}

export default function LoanCard({ loan }: LoanCardProps) {
  const paidOff = loan.principalAmount - loan.outstandingBalance
  const progress = (paidOff / loan.principalAmount) * 100
  const daysToEmi = Math.round(
    (new Date(loan.nextEmiDate).getTime() - TODAY.getTime()) / 86400000,
  )

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{loanTypeIcon[loan.loanType]}</div>
          <div>
            <div className="text-sm font-semibold text-white">{loan.lender}</div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${loanTypeColor[loan.loanType]}`}
            >
              {loanTypeLabel[loan.loanType]}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Outstanding</div>
          <div className="text-lg font-mono font-bold text-white">{formatINR(loan.outstandingBalance)}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
          <span>Paid: {formatINR(paidOff)}</span>
          <span>Principal: {formatINR(loan.principalAmount)}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            style={{ width: `${progress.toFixed(1)}%` }}
          />
        </div>
        <div className="text-[11px] text-slate-500 mt-1">{progress.toFixed(1)}% repaid</div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">EMI / Month</div>
          <div className="text-sm font-mono font-semibold text-emerald-400">{formatINR(loan.emiAmount)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Rate</div>
          <div className="text-sm font-mono font-semibold text-amber-400">{loan.interestRate}% p.a.</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Next EMI</div>
          <div
            className={`text-sm font-mono font-semibold ${
              daysToEmi <= 7 ? 'text-red-400' : 'text-slate-300'
            }`}
          >
            {daysToEmi === 0 ? 'Today' : `in ${daysToEmi}d`}
          </div>
        </div>
      </div>
    </div>
  )
}
