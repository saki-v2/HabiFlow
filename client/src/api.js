const base = import.meta.env.VITE_API_URL

export const api = async (path, method = "GET", body) => {
  const res = await fetch(base + "/api" + path, {
    method,
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + localStorage.getItem("token") },
    body: body && JSON.stringify(body)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error)
  return data
}

export const dayKey = d => d.toLocaleDateString("en-CA")

export const today = () => dayKey(new Date())

export const dueToday = habit => habit.days.includes(new Date().getDay())

export const streak = dates => {
  let count = 0
  const d = new Date()
  while (dates.includes(dayKey(d))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}
