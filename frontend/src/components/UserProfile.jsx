import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const UserProfile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center text-white text-5xl font-bold shrink-0">
              {userInitial}
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {user.role === "ngo" ? (user.organization_name || user.name) : user.name}
                </h1>
                <p className="text-slate-500">@{user.username}</p>
                {user.role === "ngo" && user.organization_name && user.organization_name !== user.name && (
                  <p className="text-slate-400 text-sm italic">Rep: {user.name}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-1 text-sm rounded-full bg-slate-900 text-white capitalize">
                  {user.role}
                </span>

                {user.location && (
                  <span className="px-4 py-1 text-sm rounded-full bg-slate-100 text-slate-700">
                    📍 {user.location}
                  </span>
                )}

                {user.role === "ngo" && user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1 text-sm rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    🌐 {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}

                <span className="px-4 py-1 text-sm rounded-full bg-slate-100 text-slate-700">
                  🗓 Joined {joinedDate}
                </span>
              </div>

              <p className="text-slate-600 text-sm md:text-base">
                {user.email}
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col gap-3">
              <button
                onClick={() => navigate("/profile/edit")}
                className="w-full md:w-auto px-6 py-2.5 rounded-full text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={logoutUser}
                className="w-full md:w-auto px-6 py-2.5 rounded-full text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="my-10 border-t border-slate-200" />

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
                {user.role === "ngo" ? "Organization Description" : "About Me"}
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {user.role === "ngo"
                  ? (user.organization_description || user.organizationDetails || user.bio || "No description provided.")
                  : (user.bio || "No bio added yet.")
                }
              </p>
            </div>

            {user.role === "volunteer" && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
                  Skills
                </h3>

                {user.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">No skills added yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
