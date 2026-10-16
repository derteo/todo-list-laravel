import { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '../api'
import { useAuth } from '../auth.jsx'
import { useTitle } from '../useTitle'

export default function Login() {
  useTitle('Accedi · ToDo List')
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Inserisci email e password.')
      return
    }
    setBusy(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(errorMessage(err))
      setBusy(false)
    }
  }

  return (
    <div className="auth-body">
      <form className="auth-card" onSubmit={onSubmit}>
        <div className="auth-header">
          <span className="auth-brand">ToDo List</span>
          <span className="auth-slash">/</span>
          <span className="auth-title">accedi</span>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@esempio.it" autoComplete="username" autoFocus />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password" />
        </div>

        <button type="submit" className="auth-btn-primary" disabled={busy}>
          {busy ? '...' : 'Accedi'}
        </button>

        <p className="auth-footer">
          Non hai un account? <Link to="/register">Registrati</Link>
        </p>
      </form>
    </div>
  )
}
