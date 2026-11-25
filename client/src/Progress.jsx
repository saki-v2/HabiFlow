import { useEffect, useState } from "react"
import { api, dayKey, streak } from "./api"

const lastDays = n => Array.from({ length: n }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (n - 1 - i))
  return dayKey(d)
})

export default function Progress() {
  const [habits, setHabits] = useState([])

  useEffect(() => { api("/habits").then(setHabits) }, [])

  const days = lastDays(30)

  return (
    <>
      <h1>Progress</h1>
      <p className="muted">The last 30 days of every habit</p>
      {habits.map(h => {
        const done = days.filter(d => h.dates.includes(d)).length
        return (
          <div className="card" key={h._id}>
            <div className="row between">
              <b>{h.title}</b>
              <span className="muted">{Math.round((done / 30) * 100)}% · {streak(h.dates)} day streak</span>
            </div>
            <div className="grid">
              {days.map(d => <i key={d} className={h.dates.includes(d) ? "cell on" : "cell"} title={d} />)}
            </div>
          </div>
        )
      })}
    </>
  )
}
