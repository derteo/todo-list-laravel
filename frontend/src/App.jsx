import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './auth.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

function Protected({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function GuestOnly({ children }) {
  const { token } = useAuth()
  return token ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Protected><Home /></Protected>} />
      <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

      {/* vecchi indirizzi della versione senza React */}
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      <Route path="/auth/login.html" element={<Navigate to="/login" replace />} />
      <Route path="/auth/register.html" element={<Navigate to="/register" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
