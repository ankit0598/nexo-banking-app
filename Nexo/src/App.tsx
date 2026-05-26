import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './screens/Dashboard'
import Accounts from './screens/Accounts'
import AccountDetail from './screens/AccountDetail'
import Transfer from './screens/Transfer'
import Cards from './screens/Cards'
import Bills from './screens/Bills'
import Insights from './screens/Insights'
import Profile from './screens/Profile'
import Investments from './screens/Investments'
import InvestmentDetail from './screens/InvestmentDetail'
import Insurance from './screens/Insurance'
import Loans from './screens/Loans'
import Goals from './screens/Goals'

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/:id" element={<AccountDetail />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/investments/:id" element={<InvestmentDetail />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </AppShell>
  )
}
