import { useEffect, useState } from "react"
import { api, today } from "./api"

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [due, setDue] = useState(today())
  const [tab, setTab] = useState("Today")

  const load = () => api("/tasks").then(setTasks)

  useEffect(() => { load() }, [])

  const add = async e => {
    e.preventDefault()
    if (!title.trim()) return
    await api("/tasks", "POST", { title, due })
    setTitle("")
    load()
  }

  const flip = async task => {
    await api("/tasks/" + task._id, "PUT", { done: !task.done })
    load()
  }

  const remove = async task => {
    await api("/tasks/" + task._id, "DELETE")
    load()
  }

  const shown = tasks.filter(t => tab === "Completed" ? t.done : !t.done && (tab === "Today" ? t.due <= today() : t.due > today()))

  return (
    <>
      <h1>Tasks & Schedule</h1>
      <form className="card" onSubmit={add}>
        <input placeholder="New task" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="date" value={due} onChange={e => setDue(e.target.value)} />
        <button className="primary">Add task</button>
      </form>
      <div className="tabs">
        {["Today", "Upcoming", "Completed"].map(t => <button key={t} className={t === tab ? "day on" : "day"} onClick={() => setTab(t)}>{t}</button>)}
      </div>
      {shown.length === 0 && <p className="muted">Nothing here yet</p>}
      {shown.map(t => (
        <div className="card row between" key={t._id}>
          <div className="row">
            <button className={t.done ? "tick on" : "tick"} onClick={() => flip(t)} />
            <span>{t.title}</span>
            <span className="muted">{t.due}</span>
          </div>
          <button className="ghost" onClick={() => remove(t)}>Delete</button>
        </div>
      ))}
    </>
  )
}
