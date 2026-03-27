import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const oppRes = await opportunityService.getOpportunityById(id);
        setOpportunity(oppRes.data);
        if (user?.role === "volunteer") {
          const appsRes = await applicationService.getMyVolunteerApplications();
          const applications = appsRes.data || [];
          const already = applications.some(
            (app) =>
              app.opportunity_id?._id === id ||
              app.opportunity_id === id ||
              app.opportunity_id?.toString() === id.toString()
          );
          setHasApplied(already);
        }
      } catch (err) {
        console.error("Error fetching opportunity:", err);
        setError(err.message || "Failed to load opportunity details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleApply = async () => {
    setApplying(true);
    setApplyMessage(null);
    try {
      const res = await applicationService.applyForOpportunity(id, "");
      setApplyMessage({ type: "success", text: "Application submitted successfully!" });
      setHasApplied(true); 
    } catch (err) {
      console.error("Apply error:", err);
      setApplyMessage({
        type: "error",
        text: err.message || "Failed to apply. Please try again.",
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-red-600 mb-4">{error || "Opportunity not found."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const title = opportunity.title || "Untitled Opportunity";
  const description = opportunity.description || "No description provided.";
  const skills = opportunity.required_skills || opportunity.skillsRequired || [];
  const location = opportunity.location || "Not specified";
  const duration = opportunity.duration || "Flexible";
  const ngoName =
    opportunity.ngo_id?.name ||
    opportunity.ngo_id?.organizationName ||
    opportunity.ngoName ||
    "Organization";
  const ngoLogo = opportunity.ngo_id?.logo;

  const isVolunteer = user?.role === "volunteer";

  return (
    <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Back to Opportunities
        </button>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
                {ngoLogo ? (
                  <img
                    src={ngoLogo}
                    alt={ngoName}
                    className="w-full h-full rounded-xl object-cover"
                  />
                ) : (
                  ngoName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                <p className="text-slate-600">by {ngoName}</p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Description</h2>
              <p className="text-slate-700 whitespace-pre-line">{description}</p>
            </div>
            {skills.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{duration}</span>
              </div>
            </div>
            
            {isVolunteer && (
              <div className="pt-4 border-t border-slate-200">
                {applyMessage && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      applyMessage.type === "success"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {applyMessage.text}
                  </div>
                )}

                {hasApplied ? (
                  <button
                    disabled
                    className="w-full md:w-auto px-6 py-3 bg-green-100 text-green-700 rounded-xl font-medium cursor-default"
                  >
                    ✓ Already Applied
                  </button>
                ) : (
                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {applying ? "Applying..." : "Apply Now"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}