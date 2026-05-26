import { useStore } from '../store'
import AccountCard from './AccountCard'

export default function AccountsStrip() {
  const accounts = useStore((s) => s.accounts)
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Your Accounts</h2>
        <span className="text-xs text-slate-400">{accounts.length} accounts</span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1">
        {accounts.map((a) => (
          <AccountCard key={a.id} account={a} compact />
        ))}
      </div>
    </div>
  )
}
