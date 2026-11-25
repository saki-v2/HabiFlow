import { useEffect, useState } from "react"
import { api } from "./api"

export default function Administration() {
  const [data, setData] = useState(null)
  const [search, setSearch] = useState("")

  const load = () => api("/admin").then(setData).catch(() => setData(false))

  useEffect(() => { load() }, [])

  if (data === false) return <h1>Admins only</h1>
  if (!data) return null

  const users = data.users.filter(u => (u.name + u.email).toLowerCase().includes(search.toLowerCase()))

  const suspend = async user => {
    await api("/admin/users/" + user._id, "PUT", { suspended: !user.suspended })
    load()
  }

  const remove = async user => {
    await api("/admin/users/" + user._id, "DELETE")
    load()
  }

  return (
    <>
      <h1>Administration</h1>
      <p className="muted">Accounts, usage and recent activity across HabiFlow</p>
      <div className="stats four">
        <div className="card"><span>Users</span><b>{data.users.length}</b></div>
        <div className="card"><span>Habits</span><b>{data.habits}</b></div>
        <div className="card"><span>Check-ins</span><b>{data.checkins}</b></div>
        <div className="card"><span>AI requests, last 24 hours</span><b>{data.ai}</b></div>
      </div>
      <div className="card">
        <div className="row between">
          <h3>Users</h3>
          <input className="search" placeholder="Search by name or email" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {users.map(u => (
          <div className="row between" key={u._id}>
            <div>
              <b>{u.name}</b>
              <p className="muted">{u.email}</p>
            </div>
            <div>
              <span className="pill">{u.role === "admin" ? "Admin" : "Member"}</span>
              <span className="pill">{u.suspended ? "Suspended" : "Active"}</span>
              {u.role === "user" && <button className="ghost" onClick={() => suspend(u)}>{u.suspended ? "Restore" : "Suspend"}</button>}
              {u.role === "user" && <button className="ghost" onClick={() => remove(u)}>Delete</button>}
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Recent activity</h3>
        {data.activity.length === 0 && <p className="muted">No activity yet</p>}
        {data.activity.map((a, i) => (
          <div className="row between" key={i}>
            <span>{a.text}</span>
            <span className="muted">{new Date(a.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
          </div>
        ))}
      </div>
    </>
  )
}
