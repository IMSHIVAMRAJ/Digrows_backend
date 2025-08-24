import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import UserManagement from './components/UserManagement'
import ExpertManagement from './components/ExpertManagement'
import ExpertCategoryManagement from './components/ExpertCategoryManagement'
import MentorCategoryManagement from './components/MentorCategoryManagement'
import PitchDeckManagement from './components/PitchDeckManagement'
import PaymentManagement from './components/PaymentManagement'
import UserPaymentManagement from './components/UserPaymentManagement'
import AdminLogin from './components/AdminLogin';

import './App.css'

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Routes>
           <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/experts" element={<ExpertManagement />} />
          <Route path="/expert-categories" element={<ExpertCategoryManagement />} />
          <Route path="/mentor-categories" element={<MentorCategoryManagement />} />
          <Route path="/pitch-decks" element={<PitchDeckManagement />} />
          <Route path="/payments" element={<PaymentManagement />} />
          <Route path="/user-payments" element={<UserPaymentManagement />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

