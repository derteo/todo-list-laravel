import { useCallback, useEffect, useState } from 'react'
import { api, errorMessage } from '../api'
import { useAuth } from '../auth.jsx'
import ListsPanel from '../components/ListsPanel.jsx'
import NotesPanel from '../components/NotesPanel.jsx'
import { useTitle } from '../useTitle'

// Il backend nasconde gli elementi con paranoid = 1 (eliminazione "soft").
const SOFT_DELETE = { paranoid: 1 }

export default function Home() {
  useTitle('ToDo List')
  const { name, logout } = useAuth()
  const [lists, setLists] = useState([])
  const [notes, setNotes] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [l, n] = await Promise.all([api('/checklists'), api('/notes')])
      setLists(l)
      setNotes(n)
      setError('')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // esegue una modifica e poi ricarica i dati dal server
  async function run(action) {
    try {
      await action()
      await load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  const activeListId = lists.some((l) => String(l.id) === filter) ? Number(filter) : null

  return (
    <div className="app">
      <header className="user-bar">
        <span className="user-label">{name || 'Utente'}</span>
        <div className="user-actions">
          <button type="button" className="btn btn-light" onClick={load}>Aggiorna</button>
          <button type="button" className="btn btn-danger-outline" onClick={logout}>Esci</button>
        </div>
      </header>

      <details className="hints">
        <summary>Come si usa</summary>
        <ul>
          <li>Clicca sul nome di una lista o sul testo di una nota per modificarlo (Invio salva, Esc annulla).</li>
          <li>Per aggiungere una nota scegli prima una lista dal menu sopra la tabella delle note.</li>
          <li>Clicca sullo stato per passare da "da fare" a "fatto".</li>
        </ul>
      </details>

      {error && (
        <div className="banner" role="alert">
          {error}
          <button type="button" className="btn btn-ghost" onClick={() => setError('')}>Chiudi</button>
        </div>
      )}

      {loading ? (
        <p className="loading">Caricamento…</p>
      ) : (
        <main className="tables">
          <ListsPanel
            lists={lists}
            notes={notes}
            onAdd={(listName) => run(() => api('/checklists', { method: 'POST', body: { name: listName, paranoid: 0 } }))}
            onRename={(id, next) => run(() => api(`/checklists/${id}`, { method: 'PUT', body: { name: next } }))}
            onDelete={(id) =>
              run(async () => {
                const own = notes.filter((n) => n.checklist_id === id)
                await Promise.all(own.map((n) => api(`/notes/${n.id}`, { method: 'PUT', body: SOFT_DELETE })))
                await api(`/checklists/${id}`, { method: 'PUT', body: SOFT_DELETE })
              })
            }
          />
          <NotesPanel
            lists={lists}
            notes={notes}
            activeListId={activeListId}
            onFilter={setFilter}
            onAdd={(listId, content) =>
              run(() =>
                api('/notes', { method: 'POST', body: { content, todo: 'todo', checklist_id: listId, paranoid: 0 } }),
              )
            }
            onEdit={(id, content) => run(() => api(`/notes/${id}`, { method: 'PUT', body: { content } }))}
            onToggle={(note) =>
              run(() => api(`/notes/${note.id}`, { method: 'PUT', body: { todo: note.todo === 'done' ? 'todo' : 'done' } }))
            }
            onDelete={(id) => run(() => api(`/notes/${id}`, { method: 'PUT', body: SOFT_DELETE }))}
          />
        </main>
      )}
    </div>
  )
}
