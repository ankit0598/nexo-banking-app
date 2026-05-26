export type AccountType = 'savings' | 'current' | 'credit_card'
export type Category =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'salary'
  | 'transfer'
  | 'other'
export type TransactionMode = 'UPI' | 'NEFT' | 'IMPS' | 'CARD' | 'ATM' | 'BILL'
export type TransactionStatus = 'completed' | 'pending' | 'failed'
export type CardNetwork = 'Visa' | 'Mastercard' | 'RuPay'
export type BillCategory =
  | 'electricity'
  | 'mobile'
  | 'internet'
  | 'credit_card'
  | 'rent'
  | 'insurance'
export type BillStatus = 'upcoming' | 'paid' | 'overdue'
export type KycStatus = 'verified' | 'pending' | 'rejected'

export interface Account {
  id: string
  name: string
  type: AccountType
  accountNumber: string // masked '••••4521'
  balance: number
  availableBalance?: number
  creditLimit?: number
  bankName: string
  ifsc?: string
  gradient: string // tailwind gradient classes
}

export interface Transaction {
  id: string
  accountId: string
  date: string // ISO
  merchant: string
  description?: string
  amount: number // positive
  type: 'debit' | 'credit'
  category: Category
  mode: TransactionMode
  status: TransactionStatus
}

export interface Card {
  id: string
  accountId: string
  type: 'debit' | 'credit'
  network: CardNetwork
  last4: string
  holderName: string
  expiry: string // MM/YY
  frozen: boolean
  spendLimit?: number
  currentSpend?: number
  gradient: string
}

export interface Bill {
  id: string
  biller: string
  category: BillCategory
  amount: number
  dueDate: string // ISO
  status: BillStatus
  autopay: boolean
}

export interface Beneficiary {
  id: string
  name: string
  accountNumber: string
  ifsc: string
  bankName: string
  nickname?: string
}

export interface Transfer {
  id: string
  fromAccountId: string
  toBeneficiaryId?: string
  toUPI?: string
  amount: number
  mode: TransactionMode
  note?: string
  timestamp: string
  status: TransactionStatus
}

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  customerId: string
  kycStatus: KycStatus
}

// ─── Investments ───────────────────────────────────────────────────────────────

export type AssetClass = 'equity' | 'mutual_fund' | 'gold' | 'fd' | 'ppf'

export interface Holding {
  id: string
  name: string
  symbol?: string
  assetClass: AssetClass
  units: number
  avgBuyPrice: number
  currentPrice: number
  investedAmount: number
  currentValue: number
  dayChange: number
  dayChangePct: number
  totalGainLoss: number
  totalGainLossPct: number
}

export interface SIP {
  id: string
  holdingId: string
  name: string
  amount: number
  frequency: 'monthly' | 'quarterly'
  nextDate: string
  status: 'active' | 'paused'
}

// ─── Insurance ─────────────────────────────────────────────────────────────────

export type PolicyType = 'term' | 'health' | 'vehicle' | 'ulip'
export type PolicyStatus = 'active' | 'expired' | 'claim_pending'

export interface InsurancePolicy {
  id: string
  insurer: string
  policyType: PolicyType
  policyNumber: string
  coverAmount: number
  premiumAmount: number
  premiumFrequency: 'monthly' | 'quarterly' | 'annually'
  nextPremiumDate: string
  expiryDate: string
  status: PolicyStatus
}

// ─── Loans ─────────────────────────────────────────────────────────────────────

export type LoanType = 'home' | 'personal' | 'car'
export type LoanStatus = 'active' | 'closed' | 'overdue'

export interface Loan {
  id: string
  lender: string
  loanType: LoanType
  accountNumber: string
  principalAmount: number
  outstandingBalance: number
  emiAmount: number
  interestRate: number
  tenure: number
  remainingTenure: number
  nextEmiDate: string
  startDate: string
  status: LoanStatus
}

// ─── Goals ─────────────────────────────────────────────────────────────────────

export type GoalCategory =
  | 'emergency_fund'
  | 'vacation'
  | 'education'
  | 'home_down_payment'
  | 'vehicle'
  | 'retirement'
  | 'wedding'
  | 'other'

export type GoalStatus = 'on_track' | 'behind' | 'achieved'

export interface FinancialGoal {
  id: string
  name: string
  category: GoalCategory
  targetAmount: number
  currentAmount: number
  targetDate: string
  monthlyContribution: number
  status: GoalStatus
}

// ─── Property ──────────────────────────────────────────────────────────────────

export interface PropertyAsset {
  id: string
  name: string
  location: string
  estimatedValue: number
  purchaseValue: number
  purchaseDate: string
}
