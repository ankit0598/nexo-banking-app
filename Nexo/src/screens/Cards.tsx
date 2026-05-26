import { useState } from 'react'
import { useStore, formatINR } from '../store'
import CardVisual from '../components/CardVisual'
import StatusBadge from '../components/StatusBadge'

export default function Cards() {
  const cards = useStore((s) => s.cards)
  const freezeCard = useStore((s) => s.freezeCard)
  const unfreezeCard = useStore((s) => s.unfreezeCard)
  const updateCardLimit = useStore((s) => s.updateCardLimit)

  const [selectedId, setSelectedId] = useState(cards[0]?.id || '')
  const selected = cards.find((c) => c.id === selectedId) || cards[0]

  const [limitInput, setLimitInput] = useState('')

  if (!selected) return null

  const applyLimit = () => {
    const v = Number(limitInput)
    if (v > 0) {
      updateCardLimit(selected.id, v)
      setLimitInput('')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Cards</h1>
        <p className="text-sm text-slate-400 mt-1">Manage debit and credit cards · {cards.length} active</p>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-3 -mx-1 px-1">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={[
              'rounded-2xl transition-all shrink-0',
              selectedId === c.id ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950' : 'opacity-70 hover:opacity-100',
            ].join(' ')}
          >
            <CardVisual card={c} size="sm" />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400">
                {selected.type === 'credit' ? 'Credit Card' : 'Debit Card'}
              </div>
              <h2 className="text-lg font-semibold text-white mt-1">
                {selected.network} •••• {selected.last4}
              </h2>
            </div>
            {selected.frozen ? (
              <StatusBadge tone="blue">Frozen</StatusBadge>
            ) : (
              <StatusBadge tone="emerald">Active</StatusBadge>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Stat label="Card Holder" value={selected.holderName} mono={false} />
            <Stat label="Expiry" value={selected.expiry} />
            <Stat label="Network" value={selected.network} mono={false} />
            {selected.type === 'credit' && selected.spendLimit !== undefined && (
              <>
                <Stat label="Credit Limit" value={formatINR(selected.spendLimit)} />
                <Stat label="Current Spend" value={formatINR(selected.currentSpend || 0)} tone="amber" />
                <Stat
                  label="Available"
                  value={formatINR((selected.spendLimit || 0) - (selected.currentSpend || 0))}
                  tone="emerald"
                />
              </>
            )}
          </div>

          {selected.type === 'credit' && selected.spendLimit !== undefined && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Credit Utilization</span>
                <span className="font-mono">
                  {Math.round(((selected.currentSpend || 0) / selected.spendLimit) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: `${((selected.currentSpend || 0) / selected.spendLimit) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => (selected.frozen ? unfreezeCard(selected.id) : freezeCard(selected.id))}
            className={[
              'w-full py-3 rounded-xl font-semibold text-sm transition-all',
              selected.frozen
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400'
                : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-500/30',
            ].join(' ')}
          >
            {selected.frozen ? 'Unfreeze Card' : '❄ Freeze Card'}
          </button>

          {selected.type === 'credit' && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
              <div className="text-xs uppercase tracking-wider text-slate-400">Update Spend Limit</div>
              <input
                type="number"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                placeholder={String(selected.spendLimit || 0)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={applyLimit}
                disabled={!Number(limitInput)}
                className="w-full py-2 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-semibold border border-blue-500/30 disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 text-xs text-slate-400">
            <div>• PIN can be reset from the bank app</div>
            <div>• International usage disabled by default</div>
            <div>• 24/7 fraud monitoring active</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatProps {
  label: string
  value: string
  mono?: boolean
  tone?: 'emerald' | 'amber'
}

function Stat({ label, value, mono = true, tone }: StatProps) {
  const cls = tone === 'emerald' ? 'text-emerald-400' : tone === 'amber' ? 'text-amber-400' : 'text-white'
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{label}</div>
      <div className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${cls}`}>{value}</div>
    </div>
  )
}
