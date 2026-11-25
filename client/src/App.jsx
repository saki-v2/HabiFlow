import { useEffect, useState } from "react"
import Logo from "./Logo"
import Landing from "./Landing"
import Auth from "./Auth"
import Dashboard from "./Dashboard"
import Habits from "./Habits"
import Tasks from "./Tasks"
import Progress from "./Progress"
import Reminders from "./Reminders"
import Settings from "./Settings"
import Administration from "./Administration"
import Pulse from "./Pulse"
import { api } from "./api"

const pages = { Dashboard, "My Habits": Habits, "Tasks & Schedule": Tasks, Progress, Reminders, Settings, Administration }

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [name, setName] = useState(localStorage.getItem("name"))
  const [role, setRole] = useState(localStorage.getItem("role"))
  const [view, setView] = useState("landing")
  const [page, setPage] = useState("Dashboard")
  const [ai, setAi] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (token) api("/reminders").then(items => setUnread(items.filter(i => !i.read).length)).catch(() => {})
  }, [token, page])

  const login = data => {
    localStorage.setItem("token", data.token)
    localStorage.setItem("name", data.name)
    localStorage.setItem("role", data.role)
    setToken(data.token)
    setName(data.name)
    setRole(data.role)
  }

  const rename = value => {
    localStorage.setItem("name", value)
    setName(value)
  }

  const logout = () => {
    localStorage.clear()
    setToken(null)
    setPage("Dashboard")
    setView("landing")
  }

  if (!token) return view === "landing" ? <Landing go={setView} /> : <Auth mode={view} go={setView} onDone={login} />

  const Page = pages[page]
  const links = Object.keys(pages).filter(p => p !== "Administration" || role === "admin")

  return (
    <div className="shell">
      <aside className="side">
        <Logo />
        {links.map(p => (
          <button key={p} className={p === page ? "nav active" : "nav"} onClick={() => setPage(p)}>{p}</button>
        ))}
        <div className="spacer" />
        <div className="user">
          <span>{name}</span>
          <button onClick={logout}>Log out</button>
        </div>
      </aside>
      <main>
        <header>
          <span className="muted">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</span>
          <button className="primary" onClick={() => setAi(true)}>Ask AI</button>
          <button className="bell" onClick={() => setPage("Reminders")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10 21h4" />
            </svg>
            {unread > 0 && <b>{unread}</b>}
          </button>
        </header>
        <Page name={name} rename={rename} go={setPage} />
      </main>
      {ai && <Pulse close={() => setAi(false)} />}
    </div>
  )
}
