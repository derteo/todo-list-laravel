import { useState } from 'react'
import EditableText from './EditableText.jsx'

export default function ListsPanel({ lists, notes, onAdd, onRename, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')

  function close() {
    setAdding(false)
    setName('')
  }

  function submit(e) {
    e.preventDefault()
    const value = name.trim()
    if (!value) return
    onAdd(value)
    close()
  }

  const noteCount = (id) => notes.filter((n) => n.checklist_id === id).length

  return (
    <section className="panel">
      <div className="panel-toolbar">
        {adding ? (
          <form className="inline-form" onSubmit={submit}>
            <input
              type="text"
              value={name}
              autoFocus
              placeholder="Nome della lista"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && close()}
            />
            <button type="submit" className="btn btn-confirm">Aggiungi</button>
            <button type="button" className="btn btn-ghost" onClick={close}>Annulla</button>
          </form>
        ) : (
          <button type="button" className="btn btn-outline" onClick={() => setAdding(true)}>
            + Nuova lista
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Liste</th>
            <th aria-label="Azioni" />
          </tr>
        </thead>
        <tbody>
          {lists.length === 0 && (
            <tr><td colSpan={2} className="empty">Nessuna lista: creane una per iniziare.</td></tr>
          )}
          {lists.map((list) => (
            <tr key={list.id}>
              <td>
                <EditableText
                  value={list.name}
                  title="Clicca per rinominare la lista"
                  onSave={(next) => onRename(list.id, next)}
                />
              </td>
              <td className="cell-action">
                <button
                  type="button"
                  className="btn-x"
                  aria-label={`Elimina la lista ${list.name}`}
                  onClick={() => {
                    const n = noteCount(list.id)
                    const extra = n ? ` e le sue ${n} ${n === 1 ? 'nota' : 'note'}` : ''
                    if (window.confirm(`Eliminare la lista "${list.name}"${extra}?`)) onDelete(list.id)
                  }}
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
