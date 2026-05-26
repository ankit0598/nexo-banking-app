import type { Card } from '../types'
import { formatINR } from '../store'

interface CardVisualProps {
  card: Card
  size?: 'sm' | 'md' | 'lg'
}

export default function CardVisual({ card, size = 'md' }: CardVisualProps) {
  const dims = {
    sm: 'w-72 h-44',
    md: 'w-80 h-48',
    lg: 'w-96 h-56',
  }[size]

  return (
    <div
      className={[
        'relative rounded-2xl overflow-hidden bg-gradient-to-br',
        card.gradient,
        'shadow-2xl shadow-black/40 border border-white/10',
        dims,
        card.frozen ? 'opacity-60' : '',
      ].join(' ')}
    >
      {/* decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/30 blur-2xl" />

      {card.frozen && (
        <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] flex items-center justify-center">
          <div className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-semibold">
            ❄ Frozen
          </div>
        </div>
      )}

      <div className="relative h-full p-5 flex flex-col justify-between text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/70">
              {card.type === 'credit' ? 'Credit Card' : 'Debit Card'}
            </div>
            <div className="text-sm font-semibold mt-0.5">HDFC Bank</div>
          </div>
          {/* chip */}
          <svg width="36" height="28" viewBox="0 0 36 28" className="opacity-90">
            <rect x="0" y="0" width="36" height="28" rx="4" fill="#fbbf24" />
            <path d="M6 8h24M6 14h24M6 20h24M12 4v20M24 4v20" stroke="#92400e" strokeWidth="0.8" />
          </svg>
        </div>

        <div>
          <div className="font-mono text-lg tracking-[0.25em] mb-3">
            •••• •••• •••• {card.last4}
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-white/60">Card Holder</div>
              <div className="text-xs font-semibold mt-0.5">{card.holderName}</div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-white/60">Expires</div>
              <div className="text-xs font-mono mt-0.5">{card.expiry}</div>
            </div>
            <div className="text-sm font-bold italic tracking-tight">{card.network}</div>
          </div>
        </div>
      </div>

      {card.type === 'credit' && card.spendLimit && card.currentSpend !== undefined && (
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur rounded-lg px-2 py-1 text-[10px] text-white/90 font-mono">
          {formatINR(card.currentSpend)} / {formatINR(card.spendLimit)}
        </div>
      )}
    </div>
  )
}
