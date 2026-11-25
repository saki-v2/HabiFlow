import { useState } from "react"
import { api } from "./api"

const ideas = ["Plan my day", "Summarise my week", "Which habit needs attention?"]

export default function Pulse({ close }) {
  const [messages, setMessages] = useState([{ from: "ai", text: "Hi, I am Pulse. Ask me anything about your habits" }])
  const [text, setText] = useState("")

  const send = async message => {
    if (!message.trim()) return
    setMessages(m => [...m, { from: "me", text: message }])
    setText("")
    const { reply } = await api("/ai", "POST", { message }).catch(e => ({ reply: e.message }))
    setMessages(m => [...m, { from: "ai", text: reply }])
  }

  return (
    <aside className="pulse">
      <div className="row between">
        <div>
          <b>Pulse</b>
          <p className="muted">Your personal habit assistant</p>
        </div>
        <button className="ghost" onClick={close}>Close</button>
      </div>
      <div className="chat">
        {messages.map((m, i) => <p key={i} className={m.from}>{m.text}</p>)}
      </div>
      <div className="days">
        {ideas.map(i => <button key={i} className="day" onClick={() => send(i)}>{i}</button>)}
      </div>
      <form onSubmit={e => { e.preventDefault(); send(text) }}>
        <input placeholder="Ask about your habits" value={text} onChange={e => setText(e.target.value)} />
      </form>
    </aside>
  )
}
