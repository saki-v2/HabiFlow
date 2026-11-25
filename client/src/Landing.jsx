import Logo from "./Logo"

const habits = [
  ["Drink water", "8 glasses · Every day", true],
  ["Read a few pages", "10 minutes · Every day", true],
  ["Move your body", "20 minutes · Mon–Fri", true],
  ["Wind down", "5 minutes · Every evening", false]
]

const week = ["✓", "✓", "✓", "✓", "✓", "S", "M"]

const benefits = [
  ["Made for your everyday", "Simple enough to start today"],
  ["Always up to date", "Real-time habit management"],
  ["Progress, not perfection", "Build consistency at your own pace"]
]

const features = [
  ["01", "Your habits, in real time", "Add, edit, or check off a habit. Your progress updates instantly, so you always know where you stand", "#e7ede3"],
  ["02", "A routine that fits your life", "Start with one small habit. Choose your own schedule and adjust it as your days change", "#f0ece3"],
  ["03", "See how far you’ve come", "Turn everyday check-ins into a clear picture of your progress. Celebrate consistency, not perfection", "#eeece4"]
]

const steps = [
  ["01", "Pick one small habit", "A glass of water. A short walk. Choose something that feels doable"],
  ["02", "Make it part of your day", "Set a rhythm that works for you, then check in as you go"],
  ["03", "Keep showing up", "Watch your progress grow, one small win at a time"]
]

const faqs = [
  ["Do I need a perfect routine to start?", "Not at all. Begin with one easy habit, even if it only takes a minute. Small, repeatable actions are a great place to start"],
  ["What does real-time management mean?", "When you add, edit, or complete a habit, your progress updates right away. No manual refresh or extra steps"],
  ["What if I miss a day?", "That’s part of being human. Pick it up again when you’re ready. A missed day doesn’t erase the progress you’ve made"]
]

const scroll = id => document.getElementById(id).scrollIntoView({ behavior: "smooth" })

export default function Landing({ go }) {
  return (
    <div className="lp">
      <nav className="lp-nav">
        <Logo />
        <div className="lp-links">
          <button onClick={() => scroll("features")}>Features</button>
          <button onClick={() => scroll("how")}>How it works</button>
          <button onClick={() => scroll("faq")}>FAQs</button>
        </div>
        <div className="lp-acct">
          <button className="ghost" onClick={() => go("login")}>Log in</button>
          <button className="primary" onClick={() => go("signup")}>Sign up</button>
        </div>
      </nav>
      <section className="lp-hero">
        <div>
          <span className="lp-pill">SMALL STEPS. REAL PROGRESS.</span>
          <h1>Better habits<br />One day<br />at a time</h1>
          <p>A little more focus. A little more you. Build routines, manage habits in real time, and see every small win add up, all in one simple space</p>
          <div className="lp-actions">
            <button className="primary" onClick={() => go("signup")}>Get started →</button>
            <button onClick={() => scroll("how")}>See how it works ↗</button>
          </div>
          <small className="lp-muted">Start small. No experience needed</small>
        </div>
        <div className="lp-frame">
          <div className="lp-dash">
            <div>
              <div>
                <b>A fresh start, Alex</b>
                <p className="lp-muted">Monday, November 23</p>
              </div>
              <span className="lp-pill">● Live updates</span>
            </div>
            <div className="lp-prog">
              <div><span>Your daily progress</span><b>3 of 4 complete</b></div>
              <div className="lp-track"><i /></div>
            </div>
            <div>
              {habits.map(([title, note, on]) => (
                <div className="lp-h" key={title}>
                  <div><span className={on ? "lp-box" : "lp-box off"}>{on && "✓"}</span>{title}</div>
                  <span className="lp-muted">{note}</span>
                </div>
              ))}
            </div>
            <div className="lp-week">
              {week.map((d, i) => <i key={i} className={i > 4 ? "off" : ""}>{d}</i>)}
            </div>
          </div>
        </div>
      </section>
      <section className="lp-band">
        {benefits.map(([title, text]) => <div key={title}><b>{title}</b><span>{text}</span></div>)}
      </section>
      <section className="lp-sec" id="features">
        <span className="lp-eyebrow">LESS FRICTION. MORE FOLLOW-THROUGH.</span>
        <h2>Everything you need and nothing you don’t</h2>
        <div className="lp-three">
          {features.map(([n, title, text, bg]) => (
            <div className="lp-card" style={{ background: bg }} key={n}>
              <span className="lp-num">{n}</span>
              <h3>{title}</h3>
              <p className="lp-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="lp-sec alt" id="how">
        <span className="lp-eyebrow">A SIMPLE WAY TO BEGIN</span>
        <h2>Your next chapter starts small</h2>
        <div className="lp-three">
          {steps.map(([n, title, text]) => (
            <div className="lp-step" key={n}>
              <h3><span className="lp-num">{n}</span>{title}</h3>
              <p className="lp-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="lp-sec lp-faq" id="faq">
        <div>
          <span className="lp-eyebrow">A LITTLE CLARITY</span>
          <h2>New to habit tracking<br />You’re in the right place</h2>
          <p className="lp-muted">Keep it simple. You can figure out the rest one day at a time</p>
        </div>
        <dl>
          {faqs.map(([q, a]) => <div key={q}><dt>{q}</dt><dd>{a}</dd></div>)}
        </dl>
      </section>
      <section className="lp-cta">
        <div>
          <h2>A better day starts with one small step</h2>
          <p>You don’t have to change everything. Just start with one habit</p>
        </div>
        <button className="sand" onClick={() => go("signup")}>Get started →</button>
      </section>
      <footer>
        <Logo />
        <span>Small steps. A little better, every day</span>
        <div>
          <button onClick={() => go("login")}>Log in</button>
          <button onClick={() => go("signup")}>Sign up</button>
        </div>
      </footer>
    </div>
  )
}
