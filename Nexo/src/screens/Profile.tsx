import { useStore } from '../store'

export default function Profile() {
  const user = useStore((s) => s.user)
  const reset = useStore((s) => s.reset)
  const beneficiaries = useStore((s) => s.beneficiaries)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile & Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account, security, and preferences</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-slate-900/40 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold text-white">{user.fullName}</div>
            <div className="text-sm text-slate-400">{user.email}</div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">CIF: {user.customerId}</div>
          </div>
          <div className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-medium">
            KYC Verified
          </div>
        </div>
      </div>

      <Section title="Personal Information">
        <Row label="Full Name" value={user.fullName} />
        <Row label="Email" value={user.email} />
        <Row label="Phone" value={user.phone} mono />
        <Row label="Customer ID" value={user.customerId} mono />
      </Section>

      <Section title="Security">
        <ToggleRow label="Biometric Login" desc="Face ID / Fingerprint" enabled />
        <ToggleRow label="Two-Factor Authentication" desc="SMS + Authenticator app" enabled />
        <ToggleRow label="Transaction Alerts" desc="SMS + Email on every transaction" enabled />
        <ToggleRow label="International Card Usage" desc="Disabled by default for safety" enabled={false} />
      </Section>

      <Section title="Beneficiaries">
        <div className="divide-y divide-white/5">
          {beneficiaries.map((b) => (
            <div key={b.id} className="flex items-center gap-3 px-3 py-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/15 text-blue-300 flex items-center justify-center text-sm font-semibold">
                {b.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{b.name}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  {b.bankName} · {b.accountNumber} · {b.ifsc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Preferences">
        <Row label="Currency" value="₹ INR (English-India)" />
        <Row label="Language" value="English" />
        <Row label="Theme" value="Dark" />
      </Section>

      <div className="flex gap-3">
        <button
          onClick={() => {
            if (confirm('Reset all data to defaults? This will undo all transfers and bill payments.')) {
              reset()
            }
          }}
          className="px-4 py-2.5 rounded-lg bg-red-500/15 text-red-300 text-sm font-semibold border border-red-500/30 hover:bg-red-500/25"
        >
          Reset Prototype Data
        </button>
        <button className="px-4 py-2.5 rounded-lg bg-white/5 text-slate-300 text-sm font-semibold border border-white/10 hover:bg-white/10">
          Sign Out
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
      <div className="px-2 mb-2 text-sm font-semibold text-white">{title}</div>
      {children}
    </div>
  )
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm text-white ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  )
}

function ToggleRow({ label, desc, enabled }: { label: string; desc: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-3">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        <div className="text-[11px] text-slate-500">{desc}</div>
      </div>
      <div
        className={[
          'w-10 h-6 rounded-full relative transition-colors',
          enabled ? 'bg-blue-500' : 'bg-slate-700',
        ].join(' ')}
      >
        <div
          className={[
            'absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all',
            enabled ? 'left-4' : 'left-0.5',
          ].join(' ')}
        />
      </div>
    </div>
  )
}
