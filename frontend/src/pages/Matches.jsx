import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMatchedOpportunities } from "../services/matchService";
import { MapPin, Star, ArrowRight } from "lucide-react";
import useAuth from "../context/useAuth";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatchedOpportunities();
        if (data.success) {
          setMatches(data.data);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "volunteer") {
      fetchMatches();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="pt-32 px-10 text-center text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-48 bg-slate-200 rounded"></div>
          <div className="h-64 w-full max-w-4xl bg-slate-200 rounded-xl mt-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 md:px-10 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Your Top Matches
        </h1>
        <p className="text-slate-600">
          Opportunities specifically curated based on your skills and location.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="text-slate-300" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No matches found yet</h2>
          <p className="text-slate-500 mb-6">Try adding more skills to your profile to get better recommendations.</p>
          <Link 
            to="/profile/edit"
            className="px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all no-underline inline-block"
          >
            Edit Profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((opportunity) => (
            <div 
              key={opportunity._id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold">
                  <Star size={14} fill="currentColor" />
                  {opportunity.matchScore}% Match
                </div>
                {opportunity.location && (
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <MapPin size={14} />
                    {opportunity.location}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {opportunity.title}
              </h2>
              
              <div className="text-sm font-medium text-slate-500 mb-4">
                by {opportunity.ngo_id?.organization_name || opportunity.ngo_id?.name}
              </div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                {opportunity.description}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {opportunity.matchingSkillsCount} Skills Matching
                </div>
                <Link
                  to={`/opportunities/${opportunity._id}`}
                  className="flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all no-underline"
                >
                  View Details <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
