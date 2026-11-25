import { useEffect, useState } from "react"
import { api, today, dueToday, streak } from "./api"

const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function Habits() {
  const [habits, setHabits] = useState([])
  const [title, setTitle] = useState("")
  const [days, setDays] = useState([0, 1, 2, 3, 4, 5, 6])

  const load = () => api("/habits").then(setHabits)

  useEffect(() => { load() }, [])

  const add = async e => {
    e.preventDefault()
    if (!title.trim()) return
    await api("/habits", "POST", { title, days })
    setTitle("")
    load()
  }

  const toggle = async habit => {
    const dates = habit.dates.includes(today()) ? habit.dates.filter(d => d !== today()) : [...habit.dates, today()]
    await api("/habits/" + habit._id, "PUT", { dates })
    load()
  }

  const remove = async habit => {
    await api("/habits/" + habit._id, "DELETE")
    load()
  }

  const flip = d => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d])

  return (
    <>
      <h1>My Habits</h1>
      <form className="card" onSubmit={add}>
        <input placeholder="New habit" value={title} onChange={e => setTitle(e.target.value)} />
        <div className="days">
          {names.map((n, i) => <button type="button" key={n} className={days.includes(i) ? "day on" : "day"} onClick={() => flip(i)}>{n}</button>)}
        </div>
        <button className="primary">Add habit</button>
      </form>
      <div className="cards">
      {habits.map(h => (
        <div className="card row between" key={h._id}>
          <div>
            <b>{h.title}</b>
            <p className="muted">{h.days.length === 7 ? "Every day" : h.days.map(d => names[d]).join(", ")} · {streak(h.dates)} day streak</p>
          </div>
          <div>
            {dueToday(h) && <button className="ghost" onClick={() => toggle(h)}>{h.dates.includes(today()) ? "Undo" : "Mark done"}</button>}
            <button className="ghost" onClick={() => remove(h)}>Delete</button>
          </div>
        </div>
      ))}
      </div>
    </>
  )
}
