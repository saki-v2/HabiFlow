import { useEffect, useState } from "react"
import { api } from "./api"

export default function Settings({ rename }) {
  const [me, setMe] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => { api("/me").then(setMe) }, [])

  if (!me) return null

  const set = key => e => {
    setSaved(false)
    setMe({ ...me, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value })
  }

  const save = async e => {
    e.preventDefault()
    await api("/me", "PUT", me)
    rename(me.name)
    setSaved(true)
  }

  return (
    <>
      <h1>Settings</h1>
      <p className="muted">How you appear, when you want to be nudged, and the account behind your progress</p>
      <form className="card" onSubmit={save}>
        <h3>Profile & reminders</h3>
        <label>Display name</label>
        <input value={me.name} onChange={set("name")} />
        <label>Time zone</label>
        <select value={me.timezone} onChange={set("timezone")}>
          {Intl.supportedValuesOf("timeZone").map(z => <option key={z}>{z}</option>)}
        </select>
        <label>Daily reminder</label>
        <input type="time" value={me.reminderTime} onChange={set("reminderTime")} />
        <label className="row">
          <input className="check" type="checkbox" checked={me.inApp} onChange={set("inApp")} />
          In-app reminders
        </label>
        <button className="primary">Save preferences</button>
        {saved && <p className="muted">Preferences saved</p>}
      </form>
      <div className="card">
        <h3>Account</h3>
        <p className="muted">Email</p>
        <p>{me.email}</p>
        <p className="muted">Role</p>
        <p>{me.role === "admin" ? "Admin" : "Member"}</p>
      </div>
      <div className="card">
        <h3>Privacy</h3>
        <p className="muted">Your habits, tasks and history are private to your account. Administrators see counts and activity, never your entries</p>
      </div>
    </>
  )
}
