const API = '/api'

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.message || `Errore ${status}`)
    this.status = status
    this.data = data
  }
}

let onUnauthorized = () => {}
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const token = localStorage.getItem('sanctum_token')
  let res
  try {
    res = await fetch(API + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, { message: 'Impossibile connettersi al server.' })
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null)
  if (res.status === 401 && auth) onUnauthorized()
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

// Il backend risponde in inglese: traduciamo i messaggi più comuni.
function translate(msg) {
  if (/invalid credentials/i.test(msg)) return 'Credenziali non valide.'
  if (/already been taken/i.test(msg)) return 'Questa email è già registrata.'
  if (/valid email/i.test(msg)) return 'Inserisci un indirizzo email valido.'
  if (/at least 8/i.test(msg)) return 'La password deve essere di almeno 8 caratteri.'
  return msg
}

export function errorMessage(err) {
  if (err instanceof ApiError) {
    if (err.data?.errors) {
      const first = Object.values(err.data.errors)[0]
      return translate(Array.isArray(first) ? first[0] : first)
    }
    if (err.status === 0) return err.message
    if (err.status >= 500) return 'Errore del server, riprova tra poco.'
    return translate(err.message)
  }
  return 'Qualcosa è andato storto.'
}
