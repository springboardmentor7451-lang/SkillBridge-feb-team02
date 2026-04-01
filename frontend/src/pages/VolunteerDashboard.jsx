import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, Search } from "lucide-react";
import useAuth from "../context/useAuth";
import opportunityService from "../services/opportunityService";

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredOpportunities, setFeaturedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllOpportunities, setShowAllOpportunities] = useState(false);

  useEffect(() => {
    fetchFeaturedOpportunities();
  }, []);

  const fetchFeaturedOpportunities = async () => {
  try {
    setLoading(true);
    const response = await opportunityService.getOpportunities({ limit: 3 });
    const opportunitiesData = response.data || response || [];
    setFeaturedOpportunities(opportunitiesData.slice(0, 3));
  } catch (error) {
    console.error('Error fetching opportunities:', error);
  } finally {
    setLoading(false);
  }
};

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
      <div className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-32">
          <nav className="flex flex-col gap-2">
            <button
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-slate-900 bg-slate-100 transition-colors"
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate('/matches')}
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-slate-900 bg-transparent hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Star size={18} className="text-amber-500" /> My Matches
            </button>

            <button
              onClick={() => navigate('/opportunities')}
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-slate-900 bg-transparent hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Search size={18} className="text-slate-400" /> Browse Opportunities
            </button>

            <button
              onClick={() => navigate('/chat')}
              className="w-full text-left px-4 py-3 rounded-lg font-medium text-slate-900 bg-transparent hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <MessageSquare size={18} className="text-indigo-500" /> Messages
            </button>
          </nav>
        </div>
      </div>

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

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Featured Opportunities</h2>
            <button
              onClick={() => navigate('/opportunities')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
          ) : featuredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredOpportunities.map((opportunity) => (
                <OpportunityCard 
                  key={opportunity._id} 
                  opportunity={opportunity}
                  onView={() => navigate(`/opportunities/${opportunity._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">No opportunities available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity, onView }) {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'NG';
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onView}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
          {opportunity.ngo?.logo ? (
            <img src={opportunity.ngo.logo} alt={opportunity.ngo.name} className="w-full h-full rounded-lg object-cover" />
          ) : (
            getInitials(opportunity.ngo?.name)
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
            {opportunity.title}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            {opportunity.ngo?.name || 'Organization'}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-3 line-clamp-2">
        {opportunity.description}
      </p>

      <div className="flex flex-wrap gap-1 mb-3">
        {(opportunity.skillsRequired || opportunity.skills || []).slice(0, 2).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-white text-slate-600 rounded-md text-xs">
            {skill}
          </span>
        ))}
        {(opportunity.skillsRequired?.length > 2 || opportunity.skills?.length > 2) && (
          <span className="px-2 py-1 bg-white text-slate-600 rounded-md text-xs">
            +{opportunity.skillsRequired?.length - 2 || opportunity.skills?.length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500">
        {opportunity.location && (
          <span className="flex items-center gap-1">
            <span>📍</span> {opportunity.location}
          </span>
        )}
        {opportunity.duration && (
          <span className="flex items-center gap-1">
            <span>⏱️</span> {opportunity.duration}
          </span>
        )}
      </div>
    </div>
  );
}