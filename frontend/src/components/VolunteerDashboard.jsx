import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Hours This Month", value: 142, trend: "+12 hrs vs last month", icon: "hours" },
  { label: "Active Applications", value: 3, trend: "2 pending review", icon: "applications" },
  { label: "Completed Hours", value: 328, trend: "Lifetime total", icon: "completed" },
  { label: "Impact Score", value: 87, trend: "Top 15% of volunteers", icon: "impact" },
];


const opportunities = [
  {
    id: 1,
    title: "Website Redesign for Local Shelter",
    ngoId: "NGO ID: 2",
    description: "Help us redesign our website to improve our online presence and reach more potential adopters.",
    skills: ["Web Development", "UI/UX Design"],
    ngoInitials: "HS",
    ngoName: "HopeShelter",
  },
  {
    id: 2,
    title: "Translation of Educational Materials",
    ngoId: "NGO ID: 2",
    description: "Translate educational materials from English to Spanish, French, or Arabic to support our global literacy programs.",
    skills: ["Translation", "Language Skills"],
    ngoInitials: "EL",
    ngoName: "EduLearn",
  },
  {
    id: 3,
    title: "Fundraising Gala Event Coordinator",
    ngoId: "NGO ID: 2",
    description: "Help plan and coordinate our annual fundraising gala to support children's medical research.",
    skills: ["Event Planning", "Marketing"],
    ngoInitials: "CF",
    ngoName: "Care Foundation",
  },
  {
    id: 4,
    title: "Youth Mentorship Program",
    ngoId: "NGO ID: 5",
    description: "Guide and mentor at-risk youth through weekly sessions focused on career development and life skills.",
    skills: ["Mentoring", "Communication", "Leadership"],
    ngoInitials: "YF",
    ngoName: "Youth First",
  },
  {
    id: 5,
    title: "Community Garden Coordinator",
    ngoId: "NGO ID: 3",
    description: "Help maintain and coordinate activities at our community garden that provides fresh produce to local families.",
    skills: ["Gardening", "Organization", "Teaching"],
    ngoInitials: "GF",
    ngoName: "Green Future",
  },
];

const navLinks = ["Dashboard", "Opportunities", "Messages", "My Profile"];
const sidebarLinks = [
  { label: "Dashboard", icon: ChartIcon },
  { label: "Opportunities", icon: BriefcaseIcon },
  { label: "Messages", icon: MessageIcon },
  { label: "My Profile", icon: InfoIcon },
  { label: "My Hours", icon: ClockIcon },
];


export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [showAllOpportunities, setShowAllOpportunities] = useState(false);
  // Add this state at the top with other useState declarations
const [profileImage, setProfileImage] = useState(null);
const [userName, setUserName] = useState("Volunteer"); 

// Add this effect to listen for image changes
useEffect(() => {
  // Load initial data
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    setProfileImage(savedImage);
  }

  // You can also load other profile data if you want to display name etc.
  // Inside the handleStorageChange or initial load:
const savedFormData = localStorage.getItem('profileFormData');
if (savedFormData) {
  try {
    const parsedData = JSON.parse(savedFormData);
    setUserName(parsedData.fullName || "Volunteer"); // ADD THIS
  } catch (error) {
    console.error('Error loading profile data:', error);
  }
}

  // Listen for storage changes (when data is updated in profile edit)
  const handleStorageChange = () => {
    const updatedImage = localStorage.getItem('profileImage');
    setProfileImage(updatedImage);
    
    // Load updated form data if needed
    const updatedFormData = localStorage.getItem('profileFormData');
    if (updatedFormData) {
      try {
        const parsedData = JSON.parse(updatedFormData);
        // Update any dashboard states that depend on profile data
        // For example, if you want to show the user's name:
        // setUserName(parsedData.fullName);
      } catch (error) {
        console.error('Error loading updated profile data:', error);
      }
    }
  };

  // Listen for custom profile update events
  const handleProfileUpdate = () => {
    const updatedImage = localStorage.getItem('profileImage');
    setProfileImage(updatedImage);
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('profileDataUpdated', handleProfileUpdate);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('profileDataUpdated', handleProfileUpdate);
  };
}, []);

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

  

  const displayedOpportunities = showAllOpportunities ? opportunities : opportunities.slice(0, 3);

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="dot-bg" />
        <div className="glow glow-1" />
        <div className="glow glow-2" />

        {/* ── Top Nav: sticky, hides on scroll down, reappears on scroll up ── */}
        <header className={`nav-wrap ${scrolled ? "nav-scrolled" : ""} ${navVisible ? "" : "nav-hidden"}`}>
          <nav className="nav-inner">
            <span className="brand">ServeSync</span>
            <div className="nav-links">
  {navLinks.map((n) => (
    <button 
      key={n} 
      className={`nav-link ${activeNav === n ? "active" : ""}`} 
      onClick={() => {
        setActiveNav(n);
        if (n === "My Profile") {
          navigate('/profile');
        }
      }}
    >
      {n}
    </button>
  ))}
</div>
            <div className="nav-right">
              <span className="role-pill">Volunteer</span>
              <button className="icon-btn" aria-label="Notifications">
                <BellIcon />
                <span className="notif-dot" />
              </button>
              <div className="nav-avatar">
  {profileImage ? (
    <img 
      src={profileImage} 
      alt="Profile" 
      style={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: '50%',
        objectFit: 'cover' 
      }} 
    />
  ) : (
    'V'
  )}
</div>
            </div>
          </nav>
        </header>

        {/* ── Layout ── */}
        <div className="layout">

          {/* ── Sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-top">
              <div className="org-card">
                <div className="org-logo">
  {profileImage ? (
    <img 
      src={profileImage} 
      alt="Profile" 
      style={{ 
        width: '100%', 
        height: '100%', 
        borderRadius: '11px',
        objectFit: 'cover' 
      }} 
    />
  ) : (
    'V'
  )}
</div>
                <div>
                  <div className="org-name">{userName}</div> 
                  <div className="org-tag"><span className="green-dot" />Volunteer</div>
                </div>
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="sidebar-section">
              <div className="section-header">
                <span className="section-title">YOUR SKILLS</span>
              </div>
              <div className="skills-empty">
                <span>No skills added yet</span>
                <button className="add-skills-btn">+ Add Skills</button>
              </div>
            </div>

            {/* Activity Section */}
            <div className="sidebar-section">
              <div className="section-header">
                <span className="section-title">ACTIVITY</span>
              </div>
              <div className="activity-empty">
                No recent activity
              </div>
            </div>

            <nav className="side-nav">
  {sidebarLinks.map(({ label, icon: Icon }) => (
    <button 
      key={label} 
      className={`side-link ${activeNav === label ? "s-active" : ""}`} 
      onClick={() => {
        setActiveNav(label);
        if (label === "My Profile") {
          navigate('/profile'); // Add this line
        }
      }}
    >
      <span className="side-icon"><Icon /></span>
      <span>{label}</span>
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
                <div className="welcome-eyebrow">Welcome back</div>
                <h1 className="welcome-title">{userName}</h1> 
                <p className="welcome-sub">Find opportunities that match your skills and interests.</p>
              </div>
              <div className="welcome-art">
                <div className="art-ring ring-1" />
                <div className="art-ring ring-2" />
                <div className="art-ring ring-3" />
                <div className="art-core">87<span>impact</span></div>
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
                  <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min((s.value / 150) * 100, 100)}%` }} /></div>
                </div>
              ))}
            </div>

            {/* Find Opportunities Section */}
            <div className="opportunities-header anim-3">
              <div className="opportunities-header-content">
                <h2 className="opportunities-title">Find Opportunities</h2>
                <p className="opportunities-subtitle">Discover volunteering opportunities that match your skills and interests.</p>
              </div>
              <button className="pill-btn browse-btn">Browse All Opportunities</button>
            </div>

            {/* Opportunities Grid */}
            <div className="opportunities-grid">
              {displayedOpportunities.map((opp, index) => (
                <div className="opportunity-card anim-3" key={opp.id} style={{ animationDelay: `${0.2 + index * 0.05}s` }}>
                  <div className="opportunity-header">
                    <div className="opportunity-ngo">
                      <div className="ngo-avatar">{opp.ngoInitials}</div>
                      <div>
                        <div className="opportunity-title">{opp.title}</div>
                        <div className="opportunity-ngo-id">{opp.ngoId}</div>
                      </div>
                    </div>
                  </div>
                  <p className="opportunity-description">{opp.description}</p>
                  <div className="opportunity-skills">
                    {opp.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  <button className="view-details-btn">
                    View details <ChevronIcon />
                  </button>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {!showAllOpportunities && opportunities.length > 3 && (
              <div className="show-more-container">
                <button className="show-more-btn" onClick={() => setShowAllOpportunities(true)}>
                  Show More Opportunities
                </button>
              </div>
            )}

            {/* Quick Actions Row */}
            <div className="quick-actions-row anim-3">
              <section className="card">
                <div className="card-title" style={{ marginBottom: 16 }}>My Applications</div>
                <div className="application-status">
                  <div className="status-item">
                    <span className="status-value">2</span>
                    <span className="status-label">Pending</span>
                  </div>
                  <div className="status-item">
                    <span className="status-value">1</span>
                    <span className="status-label">Accepted</span>
                  </div>
                  <div className="status-item">
                    <span className="status-value">3</span>
                    <span className="status-label">Completed</span>
                  </div>
                </div>
                <button className="view-all-apps">View All Applications</button>
              </section>

              <section className="card card-dark">
                <div className="card-title" style={{ color: "#fff", marginBottom: 4 }}>This Week</div>
                <div className="card-sub" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Upcoming commitments</div>
                <div className="upcoming-list">
                  <div className="upcoming-item">
                    <div className="upcoming-day">Today</div>
                    <div className="upcoming-task">Website Redesign - 2 hrs</div>
                  </div>
                  <div className="upcoming-item">
                    <div className="upcoming-day">Tomorrow</div>
                    <div className="upcoming-task">Team Meeting - 1 hr</div>
                  </div>
                  <div className="upcoming-item">
                    <div className="upcoming-day">Fri</div>
                    <div className="upcoming-task">Translation Work - 3 hrs</div>
                  </div>
                </div>
              </section>
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
  if (type === "hours") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
  if (type === "applications") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  );
  if (type === "completed") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
  if (type === "impact") return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-2.17 2.17a4 4 0 0 1-5.66 0L9 12 3 6"/><path d="M12 22v-6"/><path d="M12 2v6"/><path d="M6 12H2"/><path d="M22 12h-4"/>
    </svg>
  );
  return null;
}

function ChartIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function BriefcaseIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function MessageIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function InfoIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>; }
function ClockIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        width: "18px", 
        height: "18px",
        display: "block"
      }}
    >
      <path 
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path 
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
function HelpIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
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

/* ── Nav: sticky, hides on scroll down, reappears on scroll up ── */
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
  color: #4b5563;  /* This color will be inherited by the icon */
  position: relative;
  transition: all .2s ease;
}

.icon-btn svg {
  width: 18px !important;
  height: 18px !important;
  display: block;
  color: inherit;  /* Inherit color from parent button */
}

.icon-btn:hover {
  background: #f3f4f6;
  color: #1f2937;  /* Darker on hover */
}

/* Ensure the bell icon paths are visible */
.icon-btn svg path {
  stroke: currentColor;  /* Use the current text color */
  fill: none;
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

/* Sidebar Sections */
.sidebar-section{padding:16px 16px 12px;border-bottom:1px solid var(--border);}
.section-header{margin-bottom:10px;}
.section-title{font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--muted);text-transform:uppercase;}
.skills-empty{display:flex;flex-direction:column;gap:8px;}
.skills-empty span{font-size:11px;color:var(--muted);}
.add-skills-btn{font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;padding:6px 10px;border-radius:999px;width:fit-content;transition:all .15s;}
.add-skills-btn:hover{background:#dbeafe;}
.activity-empty{font-size:11px;color:var(--muted);padding:4px 0;}

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

/* Opportunities Header */
.opportunities-header{display:flex;align-items:center;justify-content:space-between;margin:8px 0 4px;}
.opportunities-header-content{flex:1;}
.opportunities-title{font-size:18px;font-weight:800;color:var(--dark);letter-spacing:-.3px;margin-bottom:4px;}
.opportunities-subtitle{font-size:12.5px;color:var(--muted);}
.browse-btn{font-size:12px;padding:8px 18px;}

/* Opportunities Grid */
.opportunities-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:16px;}
.opportunity-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:18px;transition:all .22s cubic-bezier(.4,0,.2,1);animation:fadeUp .5s ease both;display:flex;flex-direction:column;}
.opportunity-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.10);border-color:#ccc8c0;}
.opportunity-header{margin-bottom:12px;}
.opportunity-ngo{display:flex;align-items:center;gap:10px;}
.ngo-avatar{width:36px;height:36px;border-radius:10px;background:var(--dark);color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.opportunity-title{font-size:13px;font-weight:700;color:var(--dark);margin-bottom:2px;line-height:1.4;}
.opportunity-ngo-id{font-size:10px;color:var(--muted);}
.opportunity-description{font-size:11.5px;color:#6b6b6b;line-height:1.5;margin-bottom:14px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.opportunity-skills{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;}
.skill-tag{font-size:9px;font-weight:600;color:var(--dark);background:var(--bg);padding:4px 10px;border-radius:999px;border:1px solid var(--border);}
.view-details-btn{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#3b82f6;margin-top:auto;padding:4px 0;width:fit-content;}
.view-details-btn:hover{color:#2563eb;}
.view-details-btn svg{transition:transform .15s;}
.view-details-btn:hover svg{transform:translateX(3px);}

/* Show More */
.show-more-container{display:flex;justify-content:center;margin:0 0 20px;}
.show-more-btn{font-size:12px;font-weight:600;color:var(--dark);background:var(--card);border:1.5px solid var(--border);padding:10px 24px;border-radius:999px;transition:all .15s;}
.show-more-btn:hover{background:var(--dark);color:#fff;border-color:var(--dark);}

/* Quick Actions Row */
.quick-actions-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}

/* Cards */
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 4px 20px rgba(0,0,0,.04);}
.card-dark{background:var(--dark);border-color:var(--dark);box-shadow:0 4px 28px rgba(20,24,34,.2);}
.card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;gap:12px;}
.card-title{font-size:14px;font-weight:700;color:var(--dark);letter-spacing:-.2px;}
.card-sub{font-size:11.5px;color:var(--muted);margin-top:3px;}

/* Application Status */
.application-status{display:flex;justify-content:space-around;margin:16px 0 20px;}
.status-item{text-align:center;}
.status-value{display:block;font-size:28px;font-weight:800;color:var(--dark);line-height:1;}
.status-label{font-size:10px;color:var(--muted);margin-top:4px;}
.view-all-apps{width:100%;font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;padding:10px;border-radius:999px;transition:all .15s;}
.view-all-apps:hover{background:#dbeafe;}

/* Upcoming List */
.upcoming-list{display:flex;flex-direction:column;gap:12px;}
.upcoming-item{display:flex;align-items:center;gap:12px;}
.upcoming-day{font-size:10px;font-weight:700;color:rgba(255,255,255,.5);width:45px;}
.upcoming-task{font-size:11px;color:#fff;}

.pill-btn{font-size:11.5px;font-weight:600;color:var(--dark);border:1.5px solid var(--border);padding:5px 14px;border-radius:999px;transition:all .15s;white-space:nowrap;}
.pill-btn:hover{background:var(--dark);color:#fff;border-color:var(--dark);}

/* Animations */
.anim-1{animation:fadeUp .45s ease both .0s;}
.anim-2{animation:fadeUp .45s ease both .1s;}
.anim-3{animation:fadeUp .45s ease both .18s;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

/* Scrollbar */
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#dedad4;border-radius:3px;}

/* Responsive */
@media(max-width:1024px){
  .opportunities-grid{grid-template-columns:1fr;}
  .quick-actions-row{grid-template-columns:1fr;}
}
@media(max-width:860px){
  .stats-grid{grid-template-columns:repeat(2,1fr);}
  .sidebar{display:none;}
  .opportunities-header{flex-direction:column;align-items:flex-start;gap:12px;}
}
@media(max-width:560px){
  .nav-links{display:none;}
  .welcome-art{display:none;}
  .layout{padding:16px 12px 40px;}
  .stats-grid{grid-template-columns:1fr;}
}
`;