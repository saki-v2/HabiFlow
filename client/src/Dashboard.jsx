import { useEffect, useState } from "react"
import { api, today, dayKey, dueToday, streak } from "./api"

export default function Dashboard({ name }) {
  const [habits, setHabits] = useState([])
  const [tasks, setTasks] = useState([])

  const load = () => {
    api("/habits").then(setHabits)
    api("/tasks").then(setTasks)
  }

  useEffect(load, [])

  const tick = async habit => {
    const dates = habit.dates.includes(today()) ? habit.dates.filter(d => d !== today()) : [...habit.dates, today()]
    await api("/habits/" + habit._id, "PUT", { dates })
    load()
  }

  const list = habits.filter(dueToday)
  const done = list.filter(h => h.dates.includes(today())).length
  const open = tasks.filter(t => !t.done && t.due === today())
  const best = Math.max(0, ...habits.map(h => streak(h.dates)))

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const scheduled = habits.filter(h => h.days.includes(d.getDay()))
    const finished = scheduled.filter(h => h.dates.includes(dayKey(d))).length
    return { label: d.toLocaleDateString(undefined, { weekday: "short" }), pct: scheduled.length ? finished / scheduled.length : 0 }
  })

  return (
    <>
      <h1>Good day, {name}</h1>
      <p className="muted">{done} of {list.length} habits done today</p>
      <div className="stats">
        <div className="card"><span>Today</span><b>{done}/{list.length}</b></div>
        <div className="card"><span>Best streak</span><b>{best}</b></div>
        <div className="card"><span>Tasks due today</span><b>{open.length}</b></div>
      </div>
      <div className="cols">
        <div className="card">
          <h3>Today's habits</h3>
          {list.length === 0 && <p className="muted">No habits scheduled today</p>}
          {list.map(h => (
            <div className="row" key={h._id}>
              <button className={h.dates.includes(today()) ? "tick on" : "tick"} onClick={() => tick(h)} />
              <span>{h.title}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="card">
            <h3>This week</h3>
            <div className="bars">
              {week.map((w, i) => <div key={i}><i style={{ height: w.pct * 100 + "%" }} /><span>{w.label}</span></div>)}
            </div>
          </div>
          <div className="card">
            <h3>Tasks due</h3>
            {open.length === 0 && <p className="muted">Nothing due today</p>}
            {open.map(t => <div className="row" key={t._id}>{t.title}</div>)}
          </div>
        </div>
      </div>
    </>
  )
}
