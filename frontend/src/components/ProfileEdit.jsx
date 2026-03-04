import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function VolunteerProfileEdit() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("My Profile");
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "Test Volunteer",
    email: "test.volunteer@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate volunteer with experience in web development and community outreach. Looking to use my skills to make a positive impact.",
    occupation: "Frontend Developer",
    linkedin: "linkedin.com/in/testvolunteer",
    portfolio: "testvolunteer.com",
    availability: {
      weeklyHours: 10,
      days: ["Monday", "Wednesday", "Friday"],
      startDate: "2024-04-01",
      workPreference: "remote"
    },
    interests: ["Education", "Environment", "Technology"],
    language: "English",
    timezone: "PST (UTC-8)",
    notifications: {
      email: {
        opportunities: true,
        applications: true,
        messages: true,
        newsletter: false
      },
      push: {
        opportunities: false,
        applications: true,
        messages: true
      }
    }
  });

  const [skills, setSkills] = useState([
    { name: "Web Development", level: "Expert" },
    { name: "UI/UX Design", level: "Intermediate" },
    { name: "Translation", level: "Beginner" }
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("Beginner");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // ADD THESE THREE LINES RIGHT AFTER:
const [profileImage, setProfileImage] = useState(null);
const [profileImagePreview, setProfileImagePreview] = useState(null);
const fileInputRef = useRef(null);


  const navLinks = ["Dashboard", "Opportunities", "Messages", "My Profile"];
  const sidebarLinks = [
    { label: "Dashboard", icon: ChartIcon },
    { label: "Opportunities", icon: BriefcaseIcon },
    { label: "Messages", icon: MessageIcon },
    { label: "My Profile", icon: InfoIcon },
    { label: "My Hours", icon: ClockIcon },
  ];

  const handleNavigation = (label) => {
    setActiveNav(label);
    if (label === "Dashboard") {
      navigate('/'); // Navigate back to dashboard
    } else if (label === "My Profile") {
      navigate('/profile/edit'); // Stay on profile page
    } else if (label === "Opportunities") {
      navigate('/opportunities'); // If you have this route
    } else if (label === "Messages") {
      navigate('/messages'); // If you have this route
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleNotificationChange = (type, channel, field) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [channel]: {
          ...prev.notifications[channel],
          [field]: !prev.notifications[channel][field]
        }
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill, level: newSkillLevel }]);
      setNewSkill("");
      setShowSkillInput(false);
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = () => {
  setIsSaving(true);
  
  // Save ALL form data to localStorage
  localStorage.setItem('profileFormData', JSON.stringify(formData));
  localStorage.setItem('profileSkills', JSON.stringify(skills));
  
  // Profile image is already saved in handleImageUpload
  
  // Simulate API call
  setTimeout(() => {
    setIsSaving(false);
    setSaveSuccess(true);
    
    // Trigger custom event for same-window updates
    window.dispatchEvent(new Event('profileDataUpdated'));
    
    setTimeout(() => setSaveSuccess(false), 3000);
  }, 1500);
};

  // Add these functions before the return statement
const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file (JPG, PNG, or GIF)');
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
      setProfileImage(reader.result);
      
      // Save to localStorage to persist across pages
      localStorage.setItem('profileImage', reader.result);
      
      // Trigger storage event for other tabs/windows
      window.dispatchEvent(new Event('storage'));
      
      // ADD THIS LINE - Trigger profile data updated event
      window.dispatchEvent(new Event('profileDataUpdated'));
    };
    reader.readAsDataURL(file);
  }
};

const handleRemoveImage = () => {
  setProfileImagePreview(null);
  setProfileImage(null);
  localStorage.removeItem('profileImage');
  
  // Trigger storage event for other tabs/windows
  window.dispatchEvent(new Event('storage'));
  
  // ADD THIS LINE - Trigger profile data updated event
  window.dispatchEvent(new Event('profileDataUpdated'));
  
  // Reset file input
  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }
};

// Load ALL saved data on component mount
useEffect(() => {
  // Load profile image
  const savedImage = localStorage.getItem('profileImage');
  if (savedImage) {
    setProfileImage(savedImage);
    setProfileImagePreview(savedImage);
  }
  
  // Load form data
  const savedFormData = localStorage.getItem('profileFormData');
  if (savedFormData) {
    try {
      const parsedData = JSON.parse(savedFormData);
      setFormData(parsedData);
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }
  
  // Load skills
  const savedSkills = localStorage.getItem('profileSkills');
  if (savedSkills) {
    try {
      setSkills(JSON.parse(savedSkills));
    } catch (error) {
      console.error('Error loading saved skills:', error);
    }
  }
}, []);

  return (
  <>
    <style>{styles}</style>
    <div className="root">
      <div className="dot-bg" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* Top Nav */}
      <header className={`nav-wrap ${scrolled ? "nav-scrolled" : ""} ${navVisible ? "" : "nav-hidden"}`}>
        <nav className="nav-inner">
          <span className="brand">ServeSync</span>
          <div className="nav-links">
            {navLinks.map((n) => (
              <button 
                key={n} 
                className={`nav-link ${activeNav === n ? "active" : ""}`} 
                onClick={() => handleNavigation(n)} // FIXED: Now uses handleNavigation
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
            <div className="nav-avatar">V</div>
          </div>
        </nav>
      </header>

        {/* Layout */}
        <div className="layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sidebar-top">
              <div className="org-card">
                <div className="org-logo">V</div>
                <div>
                  <div className="org-name">{formData.fullName}</div>
                  <div className="org-tag"><span className="green-dot" />Volunteer</div>
                </div>
              </div>
            </div>
            
            <nav className="side-nav">
              {sidebarLinks.map(({ label, icon: Icon }) => (
                <button key={label} className={`side-link ${activeNav === label ? "s-active" : ""}`} onClick={() => setActiveNav(label)}>
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

          {/* Main Content */}
          <main className="main">
            {/* Header with Save Button */}
            <div className="profile-header anim-1">
              <div>
                <h1 className="profile-title">Edit Profile</h1>
                <p className="profile-subtitle">Manage your personal information and preferences</p>
              </div>
              <div className="profile-actions">
                {saveSuccess && <span className="save-success">Changes saved!</span>}
                <button className="pill-btn cancel-btn">Cancel</button>
                <button className="save-btn" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Profile Edit Grid */}
            <div className="profile-grid">
              {/* Left Column - Profile Picture & Basic Info */}
              <div className="profile-left">

              {/* Profile Picture Card */}
<section className="card profile-card anim-2">
  <div className="card-title">Profile Picture</div>
  <div className="profile-pic-section">
    <div className="profile-pic-large">
      {profileImagePreview ? (
        <img 
          src={profileImagePreview} 
          alt="Profile" 
          style={{ 
            width: '100%', 
            height: '100%', 
            borderRadius: '20px',
            objectFit: 'cover' 
          }} 
        />
      ) : (
        formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      )}
    </div>
    <div className="profile-pic-actions">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="profile-image-upload"
      />
      <label htmlFor="profile-image-upload" className="pic-upload-btn">
        Upload New
      </label>
      <button className="pic-remove-btn" onClick={handleRemoveImage}>
        Remove
      </button>
      <p className="pic-hint">JPG, PNG or GIF. Max 2MB.</p>
    </div>
  </div>
</section>

                {/* Personal Information Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">Personal Information</div>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-input"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <span className="verified-badge">✓ Verified</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-input"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </section>

                {/* Professional Information Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">Professional Information</div>
                  <div className="form-group">
                    <label className="form-label">Current Occupation</label>
                    <input
                      type="text"
                      name="occupation"
                      className="form-input"
                      value={formData.occupation}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile</label>
                    <input
                      type="url"
                      name="linkedin"
                      className="form-input"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Portfolio/Website</label>
                    <input
                      type="url"
                      name="portfolio"
                      className="form-input"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                    />
                  </div>
                </section>
              </div>

              {/* Right Column - Bio, Skills, Preferences */}
              <div className="profile-right">
                {/* Bio Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">About Me</div>
                  <div className="form-group">
                    <textarea
                      name="bio"
                      className="form-textarea"
                      rows="5"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell organizations about yourself, your experience, and what motivates you to volunteer..."
                    />
                  </div>
                </section>

                {/* Skills Card */}
                <section className="card profile-card anim-2">
                  <div className="card-header-between">
                    <div className="card-title">Your Skills</div>
                    <button className="add-skill-btn" onClick={() => setShowSkillInput(true)}>
                      <PlusIcon /> Add Skill
                    </button>
                  </div>
                  
                  {showSkillInput && (
                    <div className="add-skill-form">
                      <input
                        type="text"
                        className="skill-input"
                        placeholder="e.g., Web Development"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                      />
                      <select
                        className="skill-level-select"
                        value={newSkillLevel}
                        onChange={(e) => setNewSkillLevel(e.target.value)}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button className="skill-add-btn" onClick={handleAddSkill}>Add</button>
                      <button className="skill-cancel-btn" onClick={() => setShowSkillInput(false)}>Cancel</button>
                    </div>
                  )}

                  <div className="skills-list">
                    {skills.map((skill, index) => (
                      <div className="skill-item" key={index}>
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span className={`skill-level-badge level-${skill.level.toLowerCase()}`}>
                            {skill.level}
                          </span>
                        </div>
                        <button className="skill-remove" onClick={() => handleRemoveSkill(index)}>✕</button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Availability Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">Availability</div>
                  
                  <div className="form-group">
                    <label className="form-label">Weekly Hours Available</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.availability.weeklyHours}
                      onChange={(e) => handleNestedChange("availability", "weeklyHours", parseInt(e.target.value))}
                      min="1"
                      max="40"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Available Days</label>
                    <div className="days-grid">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <label className="day-checkbox" key={day}>
                          <input
                            type="checkbox"
                            checked={formData.availability.days.includes(day)}
                            onChange={(e) => {
                              const newDays = e.target.checked
                                ? [...formData.availability.days, day]
                                : formData.availability.days.filter(d => d !== day);
                              handleNestedChange("availability", "days", newDays);
                            }}
                          />
                          <span>{day.slice(0, 3)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.availability.startDate}
                      onChange={(e) => handleNestedChange("availability", "startDate", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Preference</label>
                    <div className="radio-group">
                      {["remote", "onsite", "hybrid"].map(pref => (
                        <label className="radio-label" key={pref}>
                          <input
                            type="radio"
                            name="workPreference"
                            value={pref}
                            checked={formData.availability.workPreference === pref}
                            onChange={(e) => handleNestedChange("availability", "workPreference", e.target.value)}
                          />
                          <span className="radio-custom"></span>
                          <span className="radio-text">{pref.charAt(0).toUpperCase() + pref.slice(1)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Interests Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">Interests & Causes</div>
                  <div className="interests-grid">
                    {["Education", "Environment", "Healthcare", "Animals", "Arts & Culture", "Technology", "Social Justice", "Disaster Relief"].map(interest => (
                      <label className="interest-tag" key={interest}>
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={(e) => {
                            const newInterests = e.target.checked
                              ? [...formData.interests, interest]
                              : formData.interests.filter(i => i !== interest);
                            setFormData(prev => ({ ...prev, interests: newInterests }));
                          }}
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Preferences Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">Preferences</div>
                  
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Time Zone</label>
                    <select
                      className="form-select"
                      value={formData.timezone}
                      onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                    >
                      <option value="PST (UTC-8)">PST (UTC-8)</option>
                      <option value="MST (UTC-7)">MST (UTC-7)</option>
                      <option value="CST (UTC-6)">CST (UTC-6)</option>
                      <option value="EST (UTC-5)">EST (UTC-5)</option>
                      <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                    </select>
                  </div>
                </section>

                {/* Notification Settings Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">Notification Settings</div>
                  
                  <div className="notification-section">
                    <div className="notification-section-title">Email Notifications</div>
                    {[
                      { key: "opportunities", label: "New opportunity matches" },
                      { key: "applications", label: "Application updates" },
                      { key: "messages", label: "Messages from NGOs" },
                      { key: "newsletter", label: "Newsletter" }
                    ].map(item => (
                      <label className="toggle-label" key={item.key}>
                        <span className="toggle-text">{item.label}</span>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.notifications.email[item.key]}
                            onChange={() => handleNotificationChange("email", "email", item.key)}
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="notification-section">
                    <div className="notification-section-title">Push Notifications</div>
                    {[
                      { key: "opportunities", label: "New opportunity matches" },
                      { key: "applications", label: "Application updates" },
                      { key: "messages", label: "Messages from NGOs" }
                    ].map(item => (
                      <label className="toggle-label" key={item.key}>
                        <span className="toggle-text">{item.label}</span>
                        <div className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={formData.notifications.push[item.key]}
                            onChange={() => handleNotificationChange("push", "push", item.key)}
                          />
                          <span className="toggle-slider"></span>
                        </div>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Change Password Card */}
                <section className="card profile-card anim-2">
                  <div className="card-title">Change Password</div>
                  
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="form-input" placeholder="••••••••" />
                  </div>
                  
                  <button className="update-password-btn">Update Password</button>
                </section>

                {/* Danger Zone */}
                <section className="card profile-card danger-zone anim-2">
                  <div className="card-title" style={{ color: "#dc2626" }}>Danger Zone</div>
                  <p className="danger-text">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="delete-account-btn">Delete Account</button>
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
function ChartIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function BriefcaseIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>; }
function MessageIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function InfoIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>; }
function ClockIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function BellIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>; }
function HelpIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>; }
function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }

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

/* Nav Styles (same as dashboard) */
.nav-wrap{position:sticky;top:0;z-index:200;padding:12px 20px 0;transition:transform .35s cubic-bezier(.4,0,.2,1), padding .3s;}
.nav-wrap.nav-scrolled{padding-top:6px;padding-bottom:6px;}
.nav-wrap.nav-hidden{transform:translateY(-110%);}
.nav-inner{max-width:1160px;margin:0 auto;height:54px;background:rgba(255,255,255,.82);backdrop-filter:blur(22px) saturate(180%);border-radius:999px;border:1px solid rgba(228,225,219,.85);box-shadow:0 2px 20px rgba(0,0,0,.07);display:flex;align-items:center;padding:0 8px 0 22px;gap:20px;}
.nav-scrolled .nav-inner{background:rgba(255,255,255,.95);box-shadow:0 4px 36px rgba(0,0,0,.10);}
.brand{font-size:16px;font-weight:800;color:var(--dark);letter-spacing:-.5px;white-space:nowrap;}
.nav-links{display:flex;gap:2px;flex:1;}
.nav-link{font-size:13px;font-weight:500;color:var(--muted);padding:6px 13px;border-radius:999px;transition:all .15s;}
.nav-link:hover{color:var(--dark);background:#f0eeec;}
.nav-link.active{color:var(--dark);font-weight:600;background:#f0eeec;}
.nav-right{display:flex;align-items:center;gap:6px;margin-left:auto;}
.role-pill{font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--dark);background:var(--bg);border:1.5px solid var(--border);padding:3px 10px;border-radius:999px;}
.icon-btn{width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:50%;color:#4b5563;position:relative;}
.icon-btn:hover{background:#f3f4f6;color:#111827;}
.notif-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;}
.nav-avatar{width:32px;height:32px;border-radius:50%;background:var(--dark);color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;margin-left:4px;}

/* Layout */
.layout{display:flex;max-width:1160px;margin:0 auto;padding:24px 20px 60px;gap:20px;position:relative;z-index:1;}

/* Sidebar (same as dashboard) */
.sidebar{width:216px;flex-shrink:0;display:flex;flex-direction:column;position:sticky;top:80px;height:fit-content;background:var(--card);border-radius:16px;border:1px solid var(--border);box-shadow:0 1px 2px rgba(0,0,0,.04),0 8px 32px rgba(0,0,0,.05);overflow:hidden;}
.sidebar-top{padding:20px 16px 16px;border-bottom:1px solid var(--border);}
.org-card{display:flex;align-items:center;gap:11px;}
.org-logo{width:42px;height:42px;border-radius:11px;background:var(--dark);color:#fff;font-size:18px;font-weight:800;display:flex;align-items:center;justify-content:center;}
.org-name{font-size:12.5px;font-weight:700;color:var(--dark);}
.org-tag{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted);margin-top:3px;}
.green-dot{width:6px;height:6px;border-radius:50%;background:#22c55e;}
.side-nav{padding:10px 8px;flex:1;display:flex;flex-direction:column;gap:2px;}
.side-link{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:9px;font-size:12.5px;font-weight:500;color:var(--muted);text-align:left;width:100%;transition:all .15s;}
.side-link:hover{background:var(--bg);color:var(--dark);}
.side-link.s-active{background:var(--dark);color:#fff;box-shadow:0 2px 12px rgba(20,24,34,.18);}
.side-icon{color:var(--muted);opacity:.8;display:flex;align-items:center;}
.side-link.s-active .side-icon{color:#fff;}
.side-badge{margin-left:auto;font-size:10px;font-weight:700;background:rgba(239,68,68,.1);color:#dc2626;border-radius:999px;padding:1px 7px;}
.sidebar-footer{padding:12px 8px 14px;border-top:1px solid var(--border);}
.help-btn{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:500;color:var(--muted);width:100%;}
.help-btn:hover{background:var(--bg);color:var(--dark);}

/* Main Content */
.main{flex:1;min-width:0;display:flex;flex-direction:column;gap:20px;}

/* Profile Header */
.profile-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.profile-title{font-size:24px;font-weight:800;color:var(--dark);letter-spacing:-.5px;}
.profile-subtitle{font-size:13px;color:var(--muted);margin-top:4px;}
.profile-actions{display:flex;align-items:center;gap:12px;}
.save-success{font-size:13px;font-weight:600;color:#10b981;background:#d1fae5;padding:6px 12px;border-radius:999px;animation:fadeIn .3s;}
.pill-btn{font-size:12px;font-weight:600;color:var(--dark);border:1.5px solid var(--border);padding:8px 18px;border-radius:999px;transition:all .15s;}
.pill-btn:hover{background:var(--dark);color:#fff;border-color:var(--dark);}
.cancel-btn{background:transparent;}
.save-btn{font-size:12px;font-weight:600;color:#fff;background:var(--dark);border:1.5px solid var(--dark);padding:8px 24px;border-radius:999px;transition:all .15s;}
.save-btn:hover{background:#2a3347;border-color:#2a3347;}
.save-btn:disabled{opacity:0.5;cursor:not-allowed;}

/* Profile Grid */
.profile-grid{display:grid;grid-template-columns:320px 1fr;gap:20px;}

/* Cards */
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px;box-shadow:0 1px 2px rgba(0,0,0,.04),0 4px 20px rgba(0,0,0,.04);margin-bottom:20px;}
.profile-card:last-child{margin-bottom:0;}
.card-title{font-size:16px;font-weight:700;color:var(--dark);margin-bottom:16px;}
.card-header-between{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}

/* Form Elements */
.form-group{position:relative;margin-bottom:16px;}
.form-group:last-child{margin-bottom:0;}
.form-label{display:block;font-size:11px;font-weight:600;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em;}
.form-input{width:100%;padding:10px 14px;font-size:13px;border:1.5px solid var(--border);border-radius:10px;background:var(--card);color:var(--dark);transition:all .15s;}
.form-input:focus{outline:none;border-color:var(--dark);box-shadow:0 0 0 3px rgba(20,24,34,.05);}
.form-textarea{width:100%;padding:12px 14px;font-size:13px;border:1.5px solid var(--border);border-radius:12px;background:var(--card);color:var(--dark);font-family:var(--font);resize:vertical;transition:all .15s;}
.form-textarea:focus{outline:none;border-color:var(--dark);box-shadow:0 0 0 3px rgba(20,24,34,.05);}
.form-select{width:100%;padding:10px 14px;font-size:13px;border:1.5px solid var(--border);border-radius:10px;background:var(--card);color:var(--dark);cursor:pointer;}

/* Profile Picture */
.profile-pic-section{display:flex;gap:20px;align-items:center;}
.profile-pic-large{width:80px;height:80px;border-radius:20px;background:var(--dark);color:#fff;font-size:32px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.profile-pic-actions{display:flex;flex-direction:column;gap:8px;}
.pic-upload-btn{font-size:11px;font-weight:600;color:#3b82f6;background:#eff6ff;padding:8px 16px;border-radius:999px;width:fit-content;}
.pic-upload-btn:hover{background:#dbeafe;}
.pic-remove-btn{font-size:11px;font-weight:600;color:#dc2626;background:#fee2e2;padding:8px 16px;border-radius:999px;width:fit-content;}
.pic-remove-btn:hover{background:#fecaca;}
.pic-hint{font-size:10px;color:var(--muted);margin-top:4px;}

/* Verified Badge */
.verified-badge{position:absolute;right:12px;top:32px;font-size:10px;font-weight:600;color:#10b981;background:#d1fae5;padding:2px 8px;border-radius:999px;}

/* Skills */
.skills-list{display:flex;flex-direction:column;gap:10px;}
.skill-item{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:var(--bg);border-radius:10px;border:1px solid var(--border);}
.skill-info{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.skill-name{font-size:13px;font-weight:600;color:var(--dark);}
.skill-level-badge{font-size:9px;font-weight:700;padding:3px 10px;border-radius:999px;}
.level-beginner{background:#fef3c7;color:#92400e;}
.level-intermediate{background:#dbeafe;color:#1e40af;}
.level-expert{background:#d1fae5;color:#065f46;}
.skill-remove{width:22px;height:22px;border-radius:50%;background:transparent;color:#9ca3af;display:flex;align-items:center;justify-content:center;font-size:14px;}
.skill-remove:hover{background:#fee2e2;color:#dc2626;}

.add-skill-btn{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:#3b82f6;padding:6px 12px;border-radius:999px;border:1.5px dashed #3b82f6;}
.add-skill-form{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.skill-input{flex:1;min-width:180px;padding:8px 12px;font-size:12px;border:1.5px solid var(--border);border-radius:8px;}
.skill-level-select{padding:8px 12px;font-size:12px;border:1.5px solid var(--border);border-radius:8px;background:var(--card);}
.skill-add-btn{padding:8px 16px;font-size:11px;font-weight:600;color:#fff;background:#3b82f6;border-radius:8px;}
.skill-cancel-btn{padding:8px 12px;font-size:11px;font-weight:600;color:var(--muted);background:var(--bg);border-radius:8px;}

/* Days Grid */
.days-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
.day-checkbox{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;}
.day-checkbox input{display:none;}
.day-checkbox span{width:100%;text-align:center;font-size:11px;font-weight:600;color:var(--muted);padding:6px 0;border:1.5px solid var(--border);border-radius:999px;transition:all .15s;}
.day-checkbox input:checked + span{background:var(--dark);color:#fff;border-color:var(--dark);}

/* Radio Group */
.radio-group{display:flex;gap:16px;}
.radio-label{display:flex;align-items:center;gap:6px;cursor:pointer;}
.radio-label input{display:none;}
.radio-custom{width:16px;height:16px;border:2px solid var(--border);border-radius:50%;position:relative;}
.radio-label input:checked + .radio-custom{border-color:var(--dark);}
.radio-label input:checked + .radio-custom::after{content:'';position:absolute;top:3px;left:3px;width:6px;height:6px;border-radius:50%;background:var(--dark);}
.radio-text{font-size:12px;color:var(--dark);}

/* Interests */
.interests-grid{display:flex;flex-wrap:wrap;gap:8px;}
.interest-tag{display:inline-flex;align-items:center;cursor:pointer;}
.interest-tag input{display:none;}
.interest-tag span{font-size:11px;font-weight:600;color:var(--muted);padding:6px 14px;border:1.5px solid var(--border);border-radius:999px;transition:all .15s;}
.interest-tag input:checked + span{background:var(--dark);color:#fff;border-color:var(--dark);}

/* Toggle Switches */
.notification-section{margin-bottom:20px;}
.notification-section:last-child{margin-bottom:0;}
.notification-section-title{font-size:12px;font-weight:700;color:var(--dark);margin-bottom:12px;}
.toggle-label{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;cursor:pointer;}
.toggle-text{font-size:13px;color:var(--dark);}
.toggle-switch{position:relative;display:inline-block;width:44px;height:22px;}
.toggle-switch input{opacity:0;width:0;height:0;}
.toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#e5e7eb;transition:.2s;border-radius:34px;}
.toggle-slider:before{position:absolute;content:"";height:18px;width:18px;left:2px;bottom:2px;background-color:white;transition:.2s;border-radius:50%;}
input:checked + .toggle-slider{background-color:var(--dark);}
input:checked + .toggle-slider:before{transform:translateX(22px);}

/* Password Update */
.update-password-btn{width:100%;font-size:12px;font-weight:600;color:#fff;background:var(--dark);padding:10px;border-radius:999px;margin-top:8px;}
.update-password-btn:hover{background:#2a3347;}

/* Danger Zone */
.danger-zone{border-color:#fee2e2;background:#fff;}
.danger-text{font-size:12px;color:#6b7280;margin-bottom:16px;line-height:1.5;}
.delete-account-btn{font-size:12px;font-weight:600;color:#dc2626;background:#fee2e2;padding:10px 20px;border-radius:999px;}
.delete-account-btn:hover{background:#fecaca;}

/* Animations */
.anim-1{animation:fadeUp .45s ease both .0s;}
.anim-2{animation:fadeUp .45s ease both .1s;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}

/* Responsive */
@media(max-width:1024px){
  .profile-grid{grid-template-columns:1fr;}
  .profile-left{order:2;}
  .profile-right{order:1;}
}
@media(max-width:860px){
  .sidebar{display:none;}
  .profile-header{flex-direction:column;align-items:flex-start;gap:16px;}
}
@media(max-width:560px){
  .nav-links{display:none;}
  .profile-pic-section{flex-direction:column;align-items:flex-start;}
  .days-grid{grid-template-columns:repeat(4,1fr);}
}
`;

export { VolunteerProfileEdit };