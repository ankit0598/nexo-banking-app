import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  initialAccounts,
  initialBeneficiaries,
  initialBills,
  initialCards,
  initialTransactions,
  initialUser,
  initialHoldings,
  initialSIPs,
  initialPolicies,
  initialLoans,
  initialGoals,
  initialPropertyAssets,
} from './mockData'
import type {
  Account,
  Beneficiary,
  Bill,
  Card,
  Transaction,
  TransactionMode,
  User,
  Holding,
  SIP,
  InsurancePolicy,
  Loan,
  FinancialGoal,
  PropertyAsset,
} from './types'

interface AppStore {
  user: User
  accounts: Account[]
  transactions: Transaction[]
  cards: Card[]
  bills: Bill[]
  beneficiaries: Beneficiary[]
  holdings: Holding[]
  sips: SIP[]
  policies: InsurancePolicy[]
  loans: Loan[]
  goals: FinancialGoal[]
  propertyAssets: PropertyAsset[]

  addTransaction: (tx: Transaction) => void
  transfer: (
    fromAccountId: string,
    toBeneficiaryId: string,
    amount: number,
    mode: TransactionMode,
    note?: string,
  ) => { ok: boolean; message?: string }
  payBill: (
    billId: string,
    fromAccountId: string,
  ) => { ok: boolean; message?: string }
  freezeCard: (id: string) => void
  unfreezeCard: (id: string) => void
  updateCardLimit: (id: string, limit: number) => void
  addBeneficiary: (b: Beneficiary) => void
  addGoal: (goal: FinancialGoal) => void
  updateGoal: (id: string, updates: Partial<FinancialGoal>) => void
  deleteGoal: (id: string) => void
  reset: () => void
}

const newId = (prefix: string) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: initialUser,
      accounts: initialAccounts,
      transactions: initialTransactions,
      cards: initialCards,
      bills: initialBills,
      beneficiaries: initialBeneficiaries,
      holdings: initialHoldings,
      sips: initialSIPs,
      policies: initialPolicies,
      loans: initialLoans,
      goals: initialGoals,
      propertyAssets: initialPropertyAssets,

      addTransaction: (tx) =>
        set((s) => ({ transactions: [tx, ...s.transactions] })),

      transfer: (fromAccountId, toBeneficiaryId, amount, mode, note) => {
        const state = get()
        const from = state.accounts.find((a) => a.id === fromAccountId)
        const ben = state.beneficiaries.find((b) => b.id === toBeneficiaryId)
        if (!from) return { ok: false, message: 'Source account not found' }
        if (!ben) return { ok: false, message: 'Beneficiary not found' }
        if (amount <= 0) return { ok: false, message: 'Amount must be positive' }
        if (from.type !== 'credit_card' && from.balance < amount) {
          return { ok: false, message: 'Insufficient balance' }
        }
        const tx: Transaction = {
          id: newId('t'),
          accountId: fromAccountId,
          date: new Date().toISOString(),
          merchant: ben.name,
          description: note || `${mode} to ${ben.bankName} ${ben.accountNumber}`,
          amount,
          type: 'debit',
          category: 'transfer',
          mode,
          status: 'completed',
        }
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === fromAccountId
              ? {
                  ...a,
                  balance: a.balance - amount,
                  availableBalance:
                    a.availableBalance !== undefined
                      ? a.availableBalance - amount
                      : undefined,
                }
              : a,
          ),
          transactions: [tx, ...s.transactions],
        }))
        return { ok: true }
      },

      payBill: (billId, fromAccountId) => {
        const state = get()
        const bill = state.bills.find((b) => b.id === billId)
        const from = state.accounts.find((a) => a.id === fromAccountId)
        if (!bill) return { ok: false, message: 'Bill not found' }
        if (!from) return { ok: false, message: 'Source account not found' }
        if (bill.status === 'paid') return { ok: false, message: 'Bill already paid' }
        if (from.type !== 'credit_card' && from.balance < bill.amount) {
          return { ok: false, message: 'Insufficient balance' }
        }
        const tx: Transaction = {
          id: newId('t'),
          accountId: fromAccountId,
          date: new Date().toISOString(),
          merchant: bill.biller,
          description: `${bill.category} bill payment`,
          amount: bill.amount,
          type: 'debit',
          category: 'bills',
          mode: 'BILL',
          status: 'completed',
        }
        set((s) => ({
          bills: s.bills.map((b) =>
            b.id === billId ? { ...b, status: 'paid' as const } : b,
          ),
          accounts: s.accounts.map((a) =>
            a.id === fromAccountId
              ? {
                  ...a,
                  balance: a.balance - bill.amount,
                  availableBalance:
                    a.availableBalance !== undefined
                      ? a.availableBalance - bill.amount
                      : undefined,
                }
              : a,
          ),
          transactions: [tx, ...s.transactions],
        }))
        return { ok: true }
      },

      freezeCard: (id) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === id ? { ...c, frozen: true } : c)),
        })),

      unfreezeCard: (id) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === id ? { ...c, frozen: false } : c)),
        })),

      updateCardLimit: (id, limit) =>
        set((s) => ({
          cards: s.cards.map((c) =>
            c.id === id ? { ...c, spendLimit: limit } : c,
          ),
        })),

      addBeneficiary: (b) =>
        set((s) => ({ beneficiaries: [...s.beneficiaries, b] })),

      addGoal: (goal) =>
        set((s) => ({ goals: [...s.goals, goal] })),

      updateGoal: (id, updates) =>
        set((s) => ({
          goals: s.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),

      deleteGoal: (id) =>
        set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),

      reset: () =>
        set({
          user: initialUser,
          accounts: initialAccounts,
          transactions: initialTransactions,
          cards: initialCards,
          bills: initialBills,
          beneficiaries: initialBeneficiaries,
          holdings: initialHoldings,
          sips: initialSIPs,
          policies: initialPolicies,
          loans: initialLoans,
          goals: initialGoals,
          propertyAssets: initialPropertyAssets,
        }),
    }),
    { name: 'banking-app-store' },
  ),
)

// Helpers
export const formatINR = (n: number): string =>
  `₹${Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export const formatINRDecimal = (n: number): string =>
  `₹${Math.abs(n).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
