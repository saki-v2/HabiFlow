import "dotenv/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const ref = { type: mongoose.Schema.Types.ObjectId, ref: "User" }

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  suspended: { type: Boolean, default: false },
  timezone: { type: String, default: "Africa/Nairobi" },
  reminderTime: { type: String, default: "08:00" },
  inApp: { type: Boolean, default: true }
}, { timestamps: true }))

const Habit = mongoose.model("Habit", new mongoose.Schema({
  user: ref,
  title: String,
  days: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
  dates: { type: [String], default: [] }
}, { timestamps: true }))

const Task = mongoose.model("Task", new mongoose.Schema({
  user: ref,
  title: String,
  due: String,
  done: { type: Boolean, default: false }
}, { timestamps: true }))

const Notification = mongoose.model("Notification", new mongoose.Schema({
  user: ref,
  key: String,
  title: String,
  text: String,
  read: { type: Boolean, default: false }
}, { timestamps: true }))

const Ai = mongoose.model("Ai", new mongoose.Schema({ user: ref }, { timestamps: true }))

const app = express()
app.use(cors(), express.json())

const sign = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET)

const auth = async (req, res, next) => {
  try {
    const { id } = jwt.verify((req.headers.authorization || "").replace("Bearer ", ""), process.env.JWT_SECRET)
    req.user = await User.findById(id)
    if (!req.user || req.user.suspended) throw new Error()
    next()
  } catch {
    res.status(401).json({ error: "Please log in again" })
  }
}

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ error: "Enter a name, an email and a password of at least 8 characters" })
  if (await User.findOne({ email })) return res.status(400).json({ error: "That email is already registered" })
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
  res.json({ token: sign(user), name: user.name, role: user.role })
})

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) return res.status(400).json({ error: "Email or password is incorrect" })
  if (user.suspended) return res.status(403).json({ error: "This account is suspended" })
  res.json({ token: sign(user), name: user.name, role: user.role })
})

const crud = (path, Model) => {
  app.get(path, auth, async (req, res) => res.json(await Model.find({ user: req.user._id }).sort("-createdAt")))
  app.post(path, auth, async (req, res) => res.json(await Model.create({ ...req.body, user: req.user._id })))
  app.put(`${path}/:id`, auth, async (req, res) => res.json(await Model.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { ...req.body, user: req.user._id }, { new: true })))
  app.delete(`${path}/:id`, auth, async (req, res) => {
    await Model.deleteOne({ _id: req.params.id, user: req.user._id })
    res.json({ ok: true })
  })
}

crud("/api/habits", Habit)
crud("/api/tasks", Task)

app.get("/api/me", auth, (req, res) => {
  const { name, email, role, timezone, reminderTime, inApp } = req.user
  res.json({ name, email, role, timezone, reminderTime, inApp })
})

app.put("/api/me", auth, async (req, res) => {
  const { name, timezone, reminderTime, inApp } = req.body
  Object.assign(req.user, { name, timezone, reminderTime, inApp })
  await req.user.save()
  res.json({ ok: true })
})

app.get("/api/reminders", auth, async (req, res) => {
  const { _id, inApp, reminderTime, timezone } = req.user
  const now = new Date()
  const date = now.toLocaleDateString("en-CA", { timeZone: timezone })
  const time = now.toLocaleTimeString("en-GB", { timeZone: timezone, hour: "2-digit", minute: "2-digit" })
  if (inApp && time >= reminderTime) {
    const habits = await Habit.find({ user: _id })
    const tasks = await Task.find({ user: _id, done: false, due: date })
    const items = [
      ...habits
        .filter(h => h.days.includes(new Date(date).getUTCDay()) && !h.dates.includes(date))
        .map(h => ({ key: `h${h._id}${date}`, title: "Habit reminder", text: `Time for "${h.title}". Keep your streak alive` })),
      ...tasks.map(t => ({ key: `t${t._id}${date}`, title: "Task due today", text: t.title }))
    ]
    for (const item of items) {
      if (!(await Notification.exists({ user: _id, key: item.key }))) await Notification.create({ ...item, user: _id })
    }
  }
  res.json(await Notification.find({ user: _id }).sort("-createdAt").limit(50))
})

app.put("/api/reminders/read", auth, async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { read: true })
  res.json({ ok: true })
})

crud("/api/reminders", Notification)

const admin = (req, res, next) => (req.user.role === "admin" ? next() : res.status(403).json({ error: "Admins only" }))

app.get("/api/admin", auth, admin, async (req, res) => {
  const habits = await Habit.find()
  const recent = await Habit.find().sort("-updatedAt").limit(8)
  res.json({
    users: await User.find().select("name email role suspended").sort("createdAt"),
    habits: habits.length,
    checkins: habits.reduce((total, h) => total + h.dates.length, 0),
    ai: await Ai.countDocuments({ createdAt: { $gt: new Date(Date.now() - 86400000) } }),
    activity: recent.map(h => ({ text: `Member updated a habit · ${h.title}`, at: h.updatedAt }))
  })
})

app.put("/api/admin/users/:id", auth, admin, async (req, res) => {
  await User.updateOne({ _id: req.params.id, role: "user" }, { suspended: req.body.suspended })
  res.json({ ok: true })
})

app.delete("/api/admin/users/:id", auth, admin, async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id, role: "user" })
  if (user) await Promise.all([Habit, Task, Notification].map(Model => Model.deleteMany({ user: user._id })))
  res.json({ ok: true })
})

app.post("/api/ai", auth, async (req, res) => {
  await Ai.create({ user: req.user._id })
  const habits = await Habit.find({ user: req.user._id })
  const reply = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-5-5",
      max_tokens: 500,
      system: `You are Pulse, a friendly habit assistant. The user's habits are: ${habits.map(h => h.title).join(", ") || "none yet"}. Keep replies short and practical`,
      messages: [{ role: "user", content: req.body.message }]
    })
  }).then(r => r.json())
  res.json({ reply: reply.content?.[0]?.text || "Pulse is unavailable right now" })
})

const seedAdmin = async () => {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env
  if (!email || !password) return
  if (await User.exists({ email })) return User.updateOne({ email }, { role: "admin" })
  await User.create({ name: "Admin", email, password: await bcrypt.hash(password, 10), role: "admin" })
}

mongoose.connect(process.env.MONGO_URI).then(seedAdmin).then(() => app.listen(process.env.PORT || 5000))
