import { useState, useMemo } from 'react'
import { useStore, formatINR } from '../store'
import BillRow from '../components/BillRow'
import Modal from '../components/Modal'
import type { Bill } from '../types'

export default function Bills() {
  const bills = useStore((s) => s.bills)
  const allAccounts = useStore((s) => s.accounts)
  const accounts = useMemo(() => allAccounts.filter((a) => a.type !== 'credit_card'), [allAccounts])
  const payBill = useStore((s) => s.payBill)

  const [payTarget, setPayTarget] = useState<Bill | null>(null)
  const [fromId, setFromId] = useState(accounts[0]?.id || '')
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null)

  const upcoming = bills.filter((b) => b.status === 'upcoming')
  const paid = bills.filter((b) => b.status === 'paid')
  const overdue = bills.filter((b) => b.status === 'overdue')
  const totalDue = upcoming.reduce((s, b) => s + b.amount, 0)

  const confirmPay = () => {
    if (!payTarget) return
    const r = payBill(payTarget.id, fromId)
    setToast({ ok: r.ok, message: r.ok ? `Paid ${payTarget.biller}` : r.message || 'Failed' })
    setPayTarget(null)
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Bills & Payments</h1>
        <p className="text-sm text-slate-400 mt-1">Track and pay upcoming bills</p>
      </div>

      {toast && (
        <div
          className={[
            'rounded-xl border p-3 text-sm',
            toast.ok
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300',
          ].join(' ')}
        >
          {toast.ok ? '✓ ' : '✕ '}
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total Due" value={formatINR(totalDue)} tone="amber" />
        <Stat label="Upcoming" value={String(upcoming.length)} mono={false} tone="blue" />
        <Stat label="Overdue" value={String(overdue.length)} mono={false} tone="red" />
        <Stat label="Paid This Month" value={String(paid.length)} mono={false} tone="emerald" />
      </div>

      <Section title="Upcoming">
        {upcoming.length === 0 ? (
          <Empty text="No upcoming bills" />
        ) : (
          upcoming.map((b) => <BillRow key={b.id} bill={b} onPay={setPayTarget} />)
        )}
      </Section>

      {paid.length > 0 && (
        <Section title="Paid">
          {paid.map((b) => (
            <BillRow key={b.id} bill={b} />
          ))}
        </Section>
      )}

      <Modal
        open={!!payTarget}
        onClose={() => setPayTarget(null)}
        title={payTarget ? `Pay ${payTarget.biller}` : 'Pay Bill'}
        footer={
          <>
            <button
              onClick={() => setPayTarget(null)}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={confirmPay}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold"
            >
              Pay {payTarget ? formatINR(payTarget.amount) : ''}
            </button>
          </>
        }
      >
        {payTarget && (
          <div className="space-y-4 text-sm">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">Amount</div>
              <div className="text-3xl font-bold font-mono text-white mt-1">
                {formatINR(payTarget.amount)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Due {new Date(payTarget.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2">Pay from</label>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.accountNumber}) · {formatINR(a.balance)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="px-2 mb-2 text-base font-semibold text-white">{title}</div>
      <div className="divide-y divide-white/5">{children}</div>
    </div>
  )
}

function Empty({ text }: { text: string }) {
  return <div className="px-3 py-8 text-center text-sm text-slate-500">{text}</div>
}

interface StatProps {
  label: string
  value: string
  tone: 'emerald' | 'amber' | 'red' | 'blue'
  mono?: boolean
}

function Stat({ label, value, tone, mono = true }: StatProps) {
  const cls = {
    emerald: 'bg-emerald-500/10 text-emerald-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
    blue: 'bg-blue-500/10 text-blue-400',
  }[tone]
  return (
    <div className={`${cls} rounded-xl p-4`}>
      <div className="text-[11px] uppercase tracking-wider opacity-80 mb-1">{label}</div>
      <div className={`text-xl font-bold ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  )
}
