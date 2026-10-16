import { useRef, useState } from 'react'

// Testo modificabile al click: Invio o click fuori salvano, Esc annulla.
export default function EditableText({ value, onSave, title }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const cancelled = useRef(false)

  function start() {
    cancelled.current = false
    setDraft(value)
    setEditing(true)
  }

  function commit() {
    setEditing(false)
    const next = draft.trim()
    if (!cancelled.current && next && next !== value) onSave(next)
  }

  if (!editing) {
    return (
      <span
        className="editable"
        role="button"
        tabIndex={0}
        title={title}
        onClick={start}
        onKeyDown={(e) => e.key === 'Enter' && start()}
      >
        {value}
      </span>
    )
  }

  return (
    <input
      className="inline-input"
      type="text"
      value={draft}
      autoFocus
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
        if (e.key === 'Escape') {
          cancelled.current = true
          setEditing(false)
        }
      }}
    />
  )
}
