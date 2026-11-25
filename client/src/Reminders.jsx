import { useEffect, useState } from "react"
import { api } from "./api"

export default function Reminders() {
  const [items, setItems] = useState([])

  const load = () => api("/reminders").then(setItems)

  useEffect(() => { load() }, [])

  const read = async item => {
    await api("/reminders/" + item._id, "PUT", { read: true })
    load()
  }

  const readAll = async () => {
    await api("/reminders/read", "PUT")
    load()
  }

  const remove = async item => {
    await api("/reminders/" + item._id, "DELETE")
    load()
  }

  return (
    <>
      <div className="row between">
        <h1>Reminders</h1>
        <button className="ghost" onClick={readAll}>Mark all read</button>
      </div>
      <p className="muted">Habit nudges and task alerts, collected in one place while you use the app</p>
      {items.length === 0 && <p className="muted">No reminders yet</p>}
      {items.map(i => (
        <div className="card row between" key={i._id}>
          <div>
            <b>{i.title}{!i.read && <span className="dot" />}</b>
            <p>{i.text}</p>
            <p className="muted">{new Date(i.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
          </div>
          <div>
            {!i.read && <button className="ghost" onClick={() => read(i)}>Mark read</button>}
            <button className="ghost" onClick={() => remove(i)}>Delete</button>
          </div>
        </div>
      ))}
    </>
  )
}
