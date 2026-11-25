import { useState } from "react"
import Logo from "./Logo"
import { api } from "./api"

export default function Auth({ mode, go, onDone }) {
  const signup = mode === "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const set = key => e => setForm({ ...form, [key]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    try {
      onDone(await api(signup ? "/signup" : "/login", "POST", form))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth">
      <aside>
        <Logo />
        <h2>{signup ? "Meet your everyday fresh start" : "A fresh day and a little more progress"}</h2>
      </aside>
      <form onSubmit={submit}>
        <button type="button" className="link" onClick={() => go("landing")}>Back to home</button>
        <h1>{signup ? "Small steps start here" : "Welcome back"}</h1>
        {signup && <input placeholder="Your name" value={form.name} onChange={set("name")} />}
        <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
        <input type="password" placeholder="Password" value={form.password} onChange={set("password")} />
        {error && <p className="error">{error}</p>}
        <button className="primary big">{signup ? "Create account" : "Log in"}</button>
        <button type="button" className="link" onClick={() => go(signup ? "login" : "signup")}>
          {signup ? "Already have an account? Log in" : "New to HabiFlow? Sign up"}
        </button>
      </form>
    </div>
  )
}
