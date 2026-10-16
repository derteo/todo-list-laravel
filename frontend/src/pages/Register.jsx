import { useState } from 'react'
import { Link } from 'react-router-dom'
import { errorMessage } from '../api'
import { useAuth } from '../auth.jsx'
import { useTitle } from '../useTitle'

export default function Register() {
  useTitle('Registrati · ToDo List')
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const name = form.name.trim()
    const email = form.email.trim()

    if (!name || !email || !form.password || !form.confirm) {
      setError('Compila tutti i campi.')
      return
    }
    if (form.password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Le password non coincidono.')
      return
    }

    setBusy(true)
    try {
      await register({ name, email, password: form.password, password_confirmation: form.confirm })
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
          <span className="auth-title">registrati</span>
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <div className="auth-field">
          <label htmlFor="name">Nome</label>
          <input id="name" type="text" value={form.name} onChange={set('name')}
            placeholder="Mario Rossi" autoComplete="name" autoFocus />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={set('email')}
            placeholder="nome@esempio.it" autoComplete="username" />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={set('password')}
            placeholder="minimo 8 caratteri" autoComplete="new-password" />
        </div>

        <div className="auth-field">
          <label htmlFor="confirm">Conferma password</label>
          <input id="confirm" type="password" value={form.confirm} onChange={set('confirm')}
            placeholder="ripeti la password" autoComplete="new-password" />
        </div>

        <button type="submit" className="auth-btn-primary" disabled={busy}>
          {busy ? '...' : 'Crea account'}
        </button>

        <p className="auth-footer">
          Hai già un account? <Link to="/login">Accedi</Link>
        </p>
      </form>
    </div>
  )
}
