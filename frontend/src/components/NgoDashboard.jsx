import { useState, useEffect, useRef } from "react";

const stats = [
  { label: "Active Opportunities", value: 3, trend: "+1 this week", icon: "opportunities" },
  { label: "Total Applications", value: 12, trend: "+4 this week", icon: "applications" },
  { label: "Active Volunteers", value: 7, trend: "+2 this month", icon: "volunteers" },
  { label: "Pending Review", value: 1, trend: "Needs attention", icon: "pending" },
];

const recentApplications = [
  {
    id: 1,
    name: "John Doe",
    initials: "JD",
    role: "Website Redesign for Local Shelter",
    status: "pending",
    time: "2 hours ago",
    note: "I have 5 years of experience in web development and design. I've worked with several nonprofits before and would love to help improve your online presence.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    role: "Social Media Campaign Manager",
    status: "approved",
    time: "Yesterday",
    note: "I run digital campaigns for three NGOs in my city and have grown their combined following by 40K over the last year.",
  },
  {
    id: 3,
    name: "Marcus Webb",
    initials: "MW",
    role: "Financial Literacy Workshop Trainer",
    status: "pending",
    time: "2 days ago",
    note: "CFA holder with 8 years in community finance education. I've delivered workshops to 500+ low-income households.",
  },
];

const navLinks = ["Dashboard", "Opportunities", "Applications", "Messages"];
const sidebarLinks = [
  { label: "Dashboard", icon: ChartIcon },
  { label: "Opportunities", icon: BriefcaseIcon },
  { label: "Applications", icon: FileIcon },
  { label: "Messages", icon: MessageIcon },
  { label: "Organization Info", icon: InfoIcon },
];

export default function NgoDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setNavVisible(y < lastScrollY.current || y < 60);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="dot-bg" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />

        {/* Top Navigation Bar */}
        <header className={`nav-wrap ${scrolled ? "nav-scrolled" : ""} ${navVisible ? "" : "nav-hidden"}`}>
          <nav className="nav-inner">
            <span className="brand">ServeSync</span>
            <div className="nav-links">
              {navLinks.map((n) => (
                <button key={n} className={`nav-link ${activeNav === n ? "active" : ""}`} onClick={() => setActiveNav(n)}>{n}</button>
              ))}
            </div>
            <div className="nav-right">
              <span className="role-pill">NGO</span>
              <button className="icon-btn" aria-label="Notifications">
                <BellIcon />
                <span className="notif-dot" />
              </button>
              <div className="nav-avatar">H</div>
            </div>
          </nav>
        </header>

        {/* ── Layout ── */}
        <div className="layout">

          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-top">
              <div className="org-card">
                <div className="org-logo">H</div>
                <div>
                  <div className="org-name">HopeForAll Foundation</div>
                  <div className="org-tag"><span className="green-dot" />Active NGO</div>
                </div>
              </div>
            </div>
            <nav className="side-nav">
              {sidebarLinks.map(({ label, icon: Icon }) => (
                <button key={label} className={`side-link ${activeNav === label ? "s-active" : ""}`} onClick={() => setActiveNav(label)}>
                  <span className="side-icon"><Icon /></span>
                  <span>{label}</span>
                  {label === "Applications" && <span className="side-badge">3</span>}
                  {label === "Messages" && <span className="side-badge">2</span>}
                </button>
              ))}
            </nav>
            <div className="sidebar-footer">
              <button className="help-btn"><HelpIcon /><span>Help & Support</span></button>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="main">

            {/* Welcome banner */}
            <div className="welcome-banner anim-1">
              <div className="welcome-text">
                <div className="welcome-eyebrow">Good morning</div>
                <h1 className="welcome-title">HopeForAll Foundation</h1>
                <p className="welcome-sub">Here's what's happening with your volunteer programs today.</p>
              </div>
              <div className="welcome-art">
                <div className="art-ring ring-1" />
                <div className="art-ring ring-2" />
                <div className="art-ring ring-3" />
                <div className="art-core">3<span>active</span></div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid anim-2">
              {stats.map((s, i) => (
                <div className="stat-card" key={i} style={{ "--i": i }}>
                  <div className="stat-top">
                    <div className="stat-val">{s.value}</div>
                    <div className="stat-icon-wrap"><StatIcon type={s.icon} /></div>
                  </div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-trend">{s.trend}</div>
                  <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min((s.value / 15) * 100, 100)}%` }} /></div>
                </div>
              ))}
            </div>

            {/* Two column row */}
            <div className="two-col anim-3">
              {/* Applications */}
              <section className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Recent Applications</div>
                    <div className="card-sub">{recentApplications.length} new since last visit</div>
                  </div>
                  <button className="pill-btn">View All</button>
                </div>
                <div className="app-list">
                  {recentApplications.map((a) => (
                    <div className="app-row" key={a.id}>
                      <div className="app-avatar">{a.initials}</div>
                      <div className="app-info">
                        <div className="app-name">{a.name}</div>
                        <div className="app-role">{a.role}</div>
                        <p className="app-note">{a.note}</p>
                      </div>
                      <div className="app-meta">
                        <span className={`badge badge-${a.status}`}>{a.status}</span>
                        <div className="app-time">{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Right column */}
              <div className="right-col">
                <section className="card">
                  <div className="card-title" style={{ marginBottom: 14 }}>Quick Actions</div>
                  <div className="action-list">
                    {[
                      { icon: PlusIcon, label: "Create Opportunity", desc: "Post a new volunteer role" },
                      { icon: MessageIcon, label: "View Messages", desc: "2 unread conversations" },
                      { icon: FileIcon, label: "Review Applications", desc: "1 pending decision" },
                    ].map(({ icon: Icon, label, desc }) => (
                      <button className="action-row" key={label}>
                        <span className="action-icon"><Icon /></span>
                        <div className="action-text">
                          <span className="action-label">{label}</span>
                          <span className="action-desc">{desc}</span>
                        </div>
                        <ChevronIcon />
                      </button>
                    ))}
                  </div>
                </section>

                <section className="card card-dark">
                  <div className="card-title" style={{ color: "#fff", marginBottom: 4 }}>This Month</div>
                  <div className="card-sub" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Volunteer hours logged</div>
                  <div className="hours-display">142<span>hrs</span></div>
                  <div className="hours-bar-wrap">
                    {[40, 65, 50, 80, 55, 70, 90, 142].map((h, i) => (
                      <div key={i} className="hours-bar-col">
                        <div className="hours-bar-fill" style={{ height: `${(h / 142) * 100}%`, opacity: i === 7 ? 0.7 : 0.18 }} />
                      </div>
                    ))}
                  </div>
                  <div className="hours-label">Past 8 weeks</div>
                </section>
              </div>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}

/* ─── Icons ─── */
function StatIcon({ type }) {
  const s = { width: 14, height: 14 };
  if (type === "opportunities") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  );
  if (type === "applications") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
  if (type === "volunteers") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  if (type === "pending") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
  return null;
}

function ChartIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function BriefcaseIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function FileIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function MessageIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function InfoIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>; }
function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: "18px", height: "18px" }}
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function HelpIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function PlusIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>; }
function ChevronIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>; }

/* ─── Styles ─── */
const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

:root { --bg:#f0eeec; --card:#ffffff; --dark:#141822; --border:#e4e1db; --muted:#8f8b85; --font:'DM Sans',sans-serif; }
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
button{font-family:var(--font);cursor:pointer;background:none;border:none;}
body{background:var(--bg);}

.root{font-family:var(--font);min-height:100vh;background:var(--bg);color:var(--dark);overflow-x:hidden;}
.dot-bg{position:fixed;inset:0;background-image:radial-gradient(circle,#c8c4bc 1px,transparent 1px);background-size:26px 26px;pointer-events:none;z-index:0;opacity:.65;}
.glow{position:fixed;border-radius:50%;filter:blur(100px);pointer-events:none;z-index:0;}
.glow-1{width:600px;height:500px;top:-180px;right:-140px;background:radial-gradient(circle,rgba(20,24,34,.055) 0%,transparent 70%);}
.glow-2{width:500px;height:400px;bottom:-100px;left:-120px;background:radial-gradient(circle,rgba(20,24,34,.04) 0%,transparent 70%);}

/* Navigation */
.nav-wrap{
  position:sticky;
  top:0;
  z-index:200;
  padding:12px 20px 0;
  transition:transform .35s cubic-bezier(.4,0,.2,1), padding .3s;
}
.nav-wrap.nav-scrolled{padding-top:6px;padding-bottom:6px;}
.nav-wrap.nav-hidden{transform:translateY(-110%);}

.nav-inner{
  max-width:1160px;
  margin:0 auto;
  height:54px;
  background:rgba(255,255,255,.82);
  backdrop-filter:blur(22px) saturate(180%);
  -webkit-backdrop-filter:blur(22px) saturate(180%);
  border-radius:999px;
  border:1px solid rgba(228,225,219,.85);
  box-shadow:0 2px 20px rgba(0,0,0,.07),0 1px 4px rgba(0,0,0,.04);
  display:flex;
  align-items:center;
  padding:0 8px 0 22px;
  gap:20px;
  transition:box-shadow .3s,background .3s;
}
.nav-scrolled .nav-inner{
  background:rgba(255,255,255,.95);
  box-shadow:0 4px 36px rgba(0,0,0,.10),0 1px 4px rgba(0,0,0,.06);
}

.brand{font-size:16px;font-weight:800;color:var(--dark);letter-spacing:-.5px;white-space:nowrap;}
.nav-links{display:flex;gap:2px;flex:1;}
.nav-link{font-size:13px;font-weight:500;color:var(--muted);padding:6px 13px;border-radius:999px;transition:all .15s;}
.nav-link:hover{color:var(--dark);background:#f0eeec;}
.nav-link.active{color:var(--dark);font-weight:600;background:#f0eeec;}
.nav-right{display:flex;align-items:center;gap:6px;margin-left:auto;}
.role-pill{font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--dark);background:var(--bg);border:1.5px solid var(--border);padding:3px 10px;border-radius:999px;}
.icon-btn {
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #6b7280;           /* Explicit icon color */
  position: relative;
  transition: all .2s ease;
}

.icon-btn svg {
  width: 18px !important;   /* Force size */
  height: 18px !important;
  display: block;
  color: inherit;           /* Inherit button color */
  stroke: inherit;          /* Inherit stroke */
  fill: none;
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.notif-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;}
.nav-avatar{width:32px;height:32px;border-radius:50%;background:var(--dark);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-left:4px;}

/* ── Layout ── */
.layout{display:flex;max-width:1160px;margin:0 auto;padding:24px 20px 60px;gap:20px;position:relative;z-index:1;}

/* ── Sidebar ── */
.sidebar{width:216px;flex-shrink:0;display:flex;flex-direction:column;position:sticky;top:80px;height:fit-content;background:var(--card);border-radius:16px;border:1px solid var(--border);box-shadow:0 1px 2px rgba(0,0,0,.04),0 8px 32px rgba(0,0,0,.05);overflow:hidden;}
.sidebar-top{padding:20px 16px 16px;border-bottom:1px solid var(--border);}
.org-card{display:flex;align-items:center;gap:11px;}
.org-logo{width:42px;height:42px;border-radius:11px;background:var(--dark);color:#fff;font-size:18px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 2px 8px rgba(20,24,34,.22);}
.org-name{font-size:12.5px;font-weight:700;color:var(--dark);line-height:1.3;}
.org-tag{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted);margin-top:3px;}
.green-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0;box-shadow:0 0 0 2px rgba(34,197,94,.2);}
.side-nav{padding:10px 8px;flex:1;display:flex;flex-direction:column;gap:2px;}
.side-link{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:9px;font-size:12.5px;font-weight:500;color:var(--muted);text-align:left;width:100%;transition:all .15s;position:relative;}
.side-link:hover{background:var(--bg);color:var(--dark);}
.side-link.s-active{background:var(--dark);color:#fff;box-shadow:0 2px 12px rgba(20,24,34,.18);}
.side-link.s-active .side-icon{color:#fff;opacity:1;}
.side-icon{color:var(--muted);opacity:.8;display:flex;align-items:center;flex-shrink:0;}
.side-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(239,68,68,.1);color:#dc2626;border-radius:999px;padding:1px 7px;}
.side-link.s-active .side-badge{background:rgba(255,255,255,.18);color:#fff;}
.sidebar-footer{padding:12px 8px 14px;border-top:1px solid var(--border);}
.help-btn{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:500;color:var(--muted);width:100%;transition:all .15s;}
.help-btn:hover{background:var(--bg);color:var(--dark);}

/* ── Main ── */
.main{flex:1;min-width:0;display:flex;flex-direction:column;gap:16px;}

/* Welcome */
.welcome-banner{background:linear-gradient(135deg,#1e2535 0%,#2a3347 60%,#1e2535 100%);border-radius:18px;padding:28px 32px;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden;box-shadow:0 4px 32px rgba(20,24,34,.13),0 1px 3px rgba(20,24,34,.08);border:1px solid rgba(20,24,34,.08);}
.welcome-banner::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 75% 40%,rgba(255,255,255,.06) 0%,transparent 55%);pointer-events:none;}
.welcome-banner::after{content:'';position:absolute;bottom:-30px;right:120px;width:200px;height:200px;background:radial-gradient(circle,rgba(255,255,255,.025) 0%,transparent 70%);pointer-events:none;}
.welcome-eyebrow{font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.38);margin-bottom:6px;}
.welcome-title{font-size:24px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:6px;}
.welcome-sub{font-size:13px;color:rgba(255,255,255,.42);line-height:1.5;max-width:380px;}
.welcome-art{position:relative;width:96px;height:96px;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.art-ring{position:absolute;border-radius:50%;border:1.5px solid rgba(255,255,255,.12);animation:spin 12s linear infinite;}
.ring-1{width:88px;height:88px;animation-duration:10s;}
.ring-2{width:64px;height:64px;animation-duration:16s;animation-direction:reverse;}
.ring-3{width:40px;height:40px;animation-duration:8s;}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.art-core{font-size:26px;font-weight:900;color:#fff;display:flex;flex-direction:column;align-items:center;line-height:1;}
.art-core span{font-size:10px;font-weight:500;color:rgba(255,255,255,.38);letter-spacing:.1em;text-transform:uppercase;margin-top:2px;}

/* Stats */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px 18px 14px;transition:all .22s cubic-bezier(.4,0,.2,1);animation:fadeUp .5s ease both;animation-delay:calc(var(--i) * 60ms);cursor:default;position:relative;overflow:hidden;}
.stat-card::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(20,24,34,.07),transparent);opacity:0;transition:opacity .2s;}
.stat-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.10);border-color:#ccc8c0;}
.stat-card:hover::after{opacity:1;}
.stat-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;}
.stat-val{font-size:36px;font-weight:900;color:var(--dark);line-height:1;letter-spacing:-1.5px;}
.stat-icon-wrap{width:30px;height:30px;border-radius:8px;background:var(--bg);display:flex;align-items:center;justify-content:center;color:var(--muted);}
.stat-label{font-size:11.5px;font-weight:600;color:var(--muted);margin-bottom:8px;}
.stat-trend{font-size:11px;color:#22c55e;font-weight:600;margin-bottom:10px;}
.stat-bar{height:3px;background:var(--bg);border-radius:999px;overflow:hidden;}
.stat-bar-fill{height:100%;background:var(--dark);border-radius:999px;}

/* Two col */
.two-col{display:grid;grid-template-columns:1fr 310px;gap:14px;align-items:start;}

/* Cards */
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 4px 20px rgba(0,0,0,.04);}
.card-dark{background:var(--dark);border-color:var(--dark);box-shadow:0 4px 28px rgba(20,24,34,.2);}
.card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;gap:12px;}
.card-title{font-size:14px;font-weight:700;color:var(--dark);letter-spacing:-.2px;}
.card-sub{font-size:11.5px;color:var(--muted);margin-top:3px;}
.pill-btn{font-size:11.5px;font-weight:600;color:var(--dark);border:1.5px solid var(--border);padding:5px 14px;border-radius:999px;transition:all .15s;white-space:nowrap;}
.pill-btn:hover{background:var(--dark);color:#fff;border-color:var(--dark);}

/* App list */
.app-list{display:flex;flex-direction:column;}
.app-row{display:flex;gap:12px;padding:13px 10px;border-bottom:1px solid var(--border);border-radius:10px;margin:0 -10px;transition:background .15s;}
.app-row:last-child{border-bottom:none;}
.app-row:hover{background:var(--bg);}
.app-avatar{width:36px;height:36px;border-radius:10px;background:var(--dark);color:#fff;font-size:11.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;}
.app-info{flex:1;min-width:0;}
.app-name{font-size:13px;font-weight:700;color:var(--dark);margin-bottom:2px;}
.app-role{font-size:11px;color:var(--muted);margin-bottom:5px;}
.app-note{font-size:11.5px;color:#aaa49e;line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.app-meta{display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0;}
.app-time{font-size:10px;color:var(--muted);white-space:nowrap;}

/* Badges */
.badge{font-size:9.5px;font-weight:700;letter-spacing:.05em;padding:3px 9px;border-radius:999px;border:1.5px solid;white-space:nowrap;}
.badge-pending{color:#92400e;background:#fef3c7;border-color:#fde68a;}
.badge-approved{color:#065f46;background:#d1fae5;border-color:#6ee7b7;}

/* Right col */
.right-col{display:flex;flex-direction:column;gap:14px;}

/* Action list */
.action-list{display:flex;flex-direction:column;gap:3px;}
.action-row{display:flex;align-items:center;gap:11px;padding:10px 10px;border-radius:10px;transition:all .15s;width:100%;text-align:left;}
.action-row:hover{background:var(--bg);}
.action-icon{width:32px;height:32px;border-radius:8px;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--dark);flex-shrink:0;transition:all .15s;}
.action-row:hover .action-icon{background:var(--dark);color:#fff;border-color:var(--dark);}
.action-text{flex:1;display:flex;flex-direction:column;}
.action-label{font-size:12.5px;font-weight:600;color:var(--dark);}
.action-desc{font-size:10.5px;color:var(--muted);margin-top:1px;}
.action-row>svg{color:var(--muted);flex-shrink:0;}

/* Dark card / hours */
.hours-display{font-size:42px;font-weight:900;color:#fff;letter-spacing:-1.5px;line-height:1;margin-bottom:16px;}
.hours-display span{font-size:17px;font-weight:500;color:rgba(255,255,255,.3);margin-left:4px;}
.hours-bar-wrap{display:flex;align-items:flex-end;gap:5px;height:48px;margin-bottom:8px;}
.hours-bar-col{flex:1;height:100%;display:flex;align-items:flex-end;}
.hours-bar-fill{width:100%;background:#fff;border-radius:3px 3px 0 0;}
.hours-label{font-size:10px;color:rgba(255,255,255,.3);font-weight:500;letter-spacing:.04em;}

/* Animations */
.anim-1{animation:fadeUp .45s ease both .0s;}
.anim-2{animation:fadeUp .45s ease both .1s;}
.anim-3{animation:fadeUp .45s ease both .18s;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

/* Scrollbar */
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#dedad4;border-radius:3px;}

/* Responsive */
@media(max-width:1024px){.two-col{grid-template-columns:1fr;}}
@media(max-width:860px){.stats-grid{grid-template-columns:repeat(2,1fr);}.sidebar{display:none;}}
@media(max-width:560px){.nav-links{display:none;}.welcome-art{display:none;}.layout{padding:16px 12px 40px;}}
`;