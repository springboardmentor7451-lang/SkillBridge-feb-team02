import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "volunteer") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Not Authorized</h1>
      </div>
    );
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "V";

  return (
    <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">

      {/* Basic Navigation Sidebar */}
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-32">
          <nav className="flex flex-col gap-2">
            <button
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-slate-900 bg-slate-100 transition-colors"
            >
              Dashboard
            </button>
            <button
              disabled
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-slate-400 bg-transparent cursor-not-allowed"
              title="Coming in M3"
            >
              Browse Opportunities (Coming Soon)
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content: Profile Info */}
      <div className="flex-1 space-y-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">My Profile Info</h2>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg shadow-slate-200">
              {userInitial}
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <p className="text-slate-500 font-medium mt-1">{user.email}</p>
              </div>

              {user.location && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-100">
                  <span>📍</span> {user.location}
                </div>
              )}

              {user.bio && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">About Me</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {user.bio}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">My Skills</h3>
                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">No skills added yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => navigate("/profile/edit")}
              className="px-6 py-2.5 rounded-xl font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}