import { useState } from 'react'
import EditableText from './EditableText.jsx'

export default function NotesPanel({ lists, notes, activeListId, onFilter, onAdd, onEdit, onToggle, onDelete }) {
  const [content, setContent] = useState('')

  const activeList = lists.find((l) => l.id === activeListId)
  const visible = activeListId ? notes.filter((n) => n.checklist_id === activeListId) : notes

  function submit(e) {
    e.preventDefault()
    const value = content.trim()
    if (!value || !activeListId) return
    onAdd(activeListId, value)
    setContent('')
  }

  return (
    <section className="panel">
      <div className="panel-toolbar">
        <select value={activeListId ?? ''} onChange={(e) => onFilter(e.target.value)} aria-label="Filtra per lista">
          <option value="">Tutte le liste</option>
          {lists.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      {activeList && (
        <form className="add-note-row" onSubmit={submit}>
          <span className="add-note-label">Nuova nota in "{activeList.name}"</span>
          <input
            type="text"
            value={content}
            placeholder="Cosa devi fare?"
            onChange={(e) => setContent(e.target.value)}
          />
          <button type="submit" className="btn btn-dark">Aggiungi</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Nota</th>
            <th>Lista</th>
            <th>Stato</th>
            <th aria-label="Azioni" />
          </tr>
        </thead>
        <tbody>
          {visible.length === 0 && (
            <tr>
              <td colSpan={4} className="empty">
                {activeListId ? 'Nessuna nota in questa lista.' : 'Nessuna nota.'}
              </td>
            </tr>
          )}
          {visible.map((note) => {
            const done = note.todo === 'done'
            return (
              <tr key={note.id}>
                <td className={done ? 'is-done' : ''}>
                  <EditableText
                    value={note.content}
                    title="Clicca per modificare la nota"
                    onSave={(next) => onEdit(note.id, next)}
                  />
                </td>
                <td>{note.checklist?.name ?? '—'}</td>
                <td>
                  <button
                    type="button"
                    className={`status ${done ? 'status-done' : 'status-todo'}`}
                    title={done ? 'Segna come da fare' : 'Segna come fatta'}
                    onClick={() => onToggle(note)}
                  >
                    {done ? 'fatto' : 'da fare'}
                  </button>
                </td>
                <td className="cell-action">
                  <button
                    type="button"
                    className="btn-x"
                    aria-label="Elimina la nota"
                    onClick={() => onDelete(note.id)}
                  >
                    ×
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
