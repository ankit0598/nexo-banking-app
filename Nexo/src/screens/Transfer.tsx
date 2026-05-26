import { useState } from 'react'
import { useStore, formatINR } from '../store'
import Modal from '../components/Modal'
import type { TransactionMode } from '../types'

const modes: TransactionMode[] = ['UPI', 'IMPS', 'NEFT']

export default function Transfer() {
  const accounts = useStore((s) => s.accounts.filter((a) => a.type !== 'credit_card'))
  const beneficiaries = useStore((s) => s.beneficiaries)
  const transfer = useStore((s) => s.transfer)

  const [fromId, setFromId] = useState(accounts[0]?.id || '')
  const [toId, setToId] = useState(beneficiaries[0]?.id || '')
  const [amount, setAmount] = useState('')
  const [mode, setMode] = useState<TransactionMode>('UPI')
  const [note, setNote] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message?: string } | null>(null)

  const from = accounts.find((a) => a.id === fromId)
  const to = beneficiaries.find((b) => b.id === toId)
  const amt = Number(amount) || 0

  const submit = () => {
    const r = transfer(fromId, toId, amt, mode, note)
    setResult(r)
    if (r.ok) {
      setAmount('')
      setNote('')
    }
    setConfirmOpen(false)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Transfer & Pay</h1>
        <p className="text-sm text-slate-400 mt-1">Send money via UPI, IMPS, or NEFT</p>
      </div>

      {result && (
        <div
          className={[
            'rounded-xl border p-4 text-sm',
            result.ok
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300',
          ].join(' ')}
        >
          {result.ok ? '✓ Transfer successful' : `✕ ${result.message}`}
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-5">
        <Field label="From Account">
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
          {from && (
            <div className="text-[11px] font-mono text-slate-500 mt-1">
              Available: {formatINR(from.balance)}
            </div>
          )}
        </Field>

        <Field label="To Beneficiary">
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} · {b.bankName} {b.accountNumber}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Amount (₹)">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-2xl font-mono font-semibold text-white focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2 mt-2">
            {[500, 1000, 5000, 10000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
              >
                +{formatINR(v)}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Mode">
          <div className="flex gap-2">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={[
                  'flex-1 text-sm font-medium py-2 rounded-lg border transition-colors',
                  mode === m
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-white/5 text-slate-400 border-white/10 hover:text-white',
                ].join(' ')}
              >
                {m}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Note (optional)">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's this for?"
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </Field>

        <button
          disabled={!from || !to || amt <= 0}
          onClick={() => setConfirmOpen(true)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:from-blue-400 hover:to-indigo-500 transition-all"
        >
          Continue
        </button>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Transfer"
        footer={
          <>
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 rounded-lg bg-white/5 text-slate-300 text-sm hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold"
            >
              Confirm & Send
            </button>
          </>
        }
      >
        <div className="space-y-3 text-sm">
          <Row k="From" v={from ? `${from.name} ${from.accountNumber}` : '-'} />
          <Row k="To" v={to ? `${to.name} · ${to.bankName}` : '-'} />
          <Row k="Mode" v={mode} />
          {note && <Row k="Note" v={note} />}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-slate-400">Amount</span>
            <span className="text-2xl font-bold font-mono text-white">{formatINR(amt)}</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2">{label}</label>
      {children}
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{k}</span>
      <span className="text-white font-medium">{v}</span>
    </div>
  )
}
