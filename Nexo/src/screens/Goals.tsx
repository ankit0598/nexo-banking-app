import { useState } from 'react'
import { useStore, formatINR } from '../store'
import GoalCard from '../components/GoalCard'
import Modal from '../components/Modal'
import type { FinancialGoal, GoalCategory } from '../types'

const goalCategoryOptions: { value: GoalCategory; label: string; icon: string }[] = [
  { value: 'emergency_fund', label: 'Emergency Fund', icon: '🏦' },
  { value: 'vacation', label: 'Vacation', icon: '✈️' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'home_down_payment', label: 'Home Down Payment', icon: '🏠' },
  { value: 'vehicle', label: 'Vehicle', icon: '🚗' },
  { value: 'retirement', label: 'Retirement', icon: '🌴' },
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'other', label: 'Other', icon: '🎯' },
]

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50'

export default function Goals() {
  const goals = useStore((s) => s.goals)
  const addGoal = useStore((s) => s.addGoal)

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    name: '',
    category: 'other' as GoalCategory,
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    monthlyContribution: '',
  })
  const [error, setError] = useState('')

  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0)
  const onTrack = goals.filter((g) => g.status === 'on_track').length

  const handleAdd = () => {
    if (!form.name.trim()) { setError('Goal name is required'); return }
    const target = Number(form.targetAmount)
    if (!target || target <= 0) { setError('Enter a valid target amount'); return }
    if (!form.targetDate) { setError('Target date is required'); return }

    const newGoal: FinancialGoal = {
      id: `g${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      targetAmount: target,
      currentAmount: Math.max(0, Number(form.currentAmount) || 0),
      targetDate: form.targetDate,
      monthlyContribution: Math.max(0, Number(form.monthlyContribution) || 0),
      status: 'on_track',
    }
    addGoal(newGoal)
    setShowAdd(false)
    setForm({ name: '', category: 'other', targetAmount: '', currentAmount: '', targetDate: '', monthlyContribution: '' })
    setError('')
  }

  const handleClose = () => {
    setShowAdd(false)
    setError('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Goals</h1>
          <div className="text-sm text-slate-400 mt-0.5">Track your savings milestones</div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium rounded-xl transition-colors"
        >
          + Add Goal
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Total Goals</div>
          <div className="text-2xl font-mono font-bold text-blue-400">{goals.length}</div>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Total Saved</div>
          <div className="text-lg font-mono font-bold text-emerald-400">{formatINR(totalSaved)}</div>
        </div>
        <div className="bg-purple-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">Total Target</div>
          <div className="text-lg font-mono font-bold text-purple-400">{formatINR(totalTarget)}</div>
        </div>
        <div className="bg-amber-500/10 rounded-xl p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">On Track</div>
          <div className="text-2xl font-mono font-bold text-amber-400">
            {onTrack}/{goals.length}
          </div>
        </div>
      </div>

      {/* Goal cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
        {goals.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500">
            No goals yet. Add your first financial goal!
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      <Modal
        open={showAdd}
        onClose={handleClose}
        title="Add Financial Goal"
        footer={
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-2 text-sm bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl hover:bg-emerald-500/30 transition-colors"
            >
              Add Goal
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{error}</div>
          )}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Goal Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Hawaii Vacation"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as GoalCategory }))}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            >
              {goalCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Target Amount (₹)</label>
              <input
                type="number"
                value={form.targetAmount}
                onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))}
                placeholder="5,00,000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Already Saved (₹)</label>
              <input
                type="number"
                value={form.currentAmount}
                onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))}
                placeholder="0"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Target Date</label>
              <input
                type="date"
                value={form.targetDate}
                onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Monthly Contribution (₹)</label>
              <input
                type="number"
                value={form.monthlyContribution}
                onChange={(e) => setForm((f) => ({ ...f, monthlyContribution: e.target.value }))}
                placeholder="5,000"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
