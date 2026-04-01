import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Star, X } from "lucide-react";
import matchService from "../services/matchService";

const VolunteerMatching = ({ opportunity, onClose }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matchService.getMatchedVolunteers(opportunity._id);
        if (data.success) {
          setVolunteers(data.data);
        }
      } catch (err) {
        setError(err?.message || "Failed to fetch matching volunteers");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [opportunity._id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Matching Volunteers</h2>
            <p className="text-sm text-slate-500 font-medium mt-1 italic">
              Recommendations for "{opportunity.title}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium">Scanning for the best candidates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-medium">{error}</div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-20 text-slate-400 italic">No exact matches found yet. Try updating your requirements!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {volunteers.map((v) => (
                <div
                  key={v._id}
                  className="p-5 border border-slate-100 rounded-3xl hover:border-indigo-200 transition-all shadow-sm hover:shadow-md bg-white flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                        {v.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 leading-tight">{v.name}</h4>
                        <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">{v.matchScore}% Match</p>
                      </div>
                    </div>
                    <div className="flex bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-bold items-center gap-1">
                      <Star size={12} fill="currentColor" /> {v.matchingSkillsCount} Skills
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Candidate Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.skills?.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {v.location && (
                    <div className="mb-4 text-xs font-medium text-slate-500 flex items-center gap-1.5 px-1 pb-1">
                      <span>📍</span> {v.location}
                    </div>
                  )}

                  <button
                    onClick={() => {
                        onClose();
                        navigate("/chat", { state: { targetUser: v } });
                    }}
                    className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all border-none cursor-pointer shadow-lg shadow-slate-200"
                  >
                    <MessageSquare size={16} /> Send Message
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerMatching;
