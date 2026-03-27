import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import opportunityService from "../services/opportunityService";
import applicationService from "../services/applicationService";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchOpportunityDetails();
    if (isAuthenticated && user?.role === "volunteer") {
      checkApplicationStatus();
    }
  }, [id, isAuthenticated]);

  const fetchOpportunityDetails = async () => {
    setLoading(true);
    try {
      const response = await opportunityService.getOpportunityById(id);
      setOpportunity(response.data);
    } catch (err) {
      setError(err?.message || "Failed to load opportunity details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await applicationService.getMyApplications();
      const applications = response.data || [];
      const alreadyApplied = applications.some(
        (app) => (app.opportunity_id?._id || app.opportunity_id) === id
      );
      setIsApplied(alreadyApplied);
    } catch (err) {
      console.error("Failed to check application status", err);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await applicationService.applyForOpportunity(id, coverLetter);
      setIsApplied(true);
      setShowApplyModal(false);
      alert("Application submitted successfully!");
    } catch (err) {
      alert(err || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-md w-full">
          <p className="text-red-500 font-bold mb-4">{error || "Opportunity not found"}</p>
          <button
            onClick={() => navigate("/opportunities")}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Back to Opportunities
          </button>
        </div>
      </div>
    );
  }

  const ngoName = opportunity.ngo_id?.organization_name || opportunity.ngo_id?.name || "Organization";
  const ngoDescription = opportunity.ngo_id?.organization_description || "";

  return (
    <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider">
                Volunteering Role
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${opportunity.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {opportunity.status}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              {opportunity.title}
            </h1>
            
            <div className="flex items-center gap-2 mb-8 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">
                {ngoName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{ngoName}</p>
                <p className="text-xs text-slate-400">Verified NGO Partner</p>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-bold text-slate-900 mb-3">About the Role</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {opportunity.required_skills?.map((skill, index) => (
                  <span key={index} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {ngoDescription && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-3">About {ngoName}</h3>
              <p className="text-slate-600 leading-relaxed italic">
                {ngoDescription}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-32">
            <h3 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-50">Details</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-slate-400 text-lg">📍</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-medium text-slate-700">{opportunity.location || "Remote / On-site"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 text-lg">⏱️</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  <p className="text-sm font-medium text-slate-700">{opportunity.duration || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-slate-400 text-lg">📅</span>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Posted</p>
                  <p className="text-sm font-medium text-slate-700">{new Date(opportunity.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {user?.role === "volunteer" ? (
              <button
                onClick={() => !isApplied && setShowApplyModal(true)}
                disabled={isApplied || opportunity.status !== 'open'}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                  isApplied 
                    ? "bg-green-500 cursor-default shadow-green-100" 
                    : opportunity.status !== 'open'
                      ? "bg-slate-300 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
                }`}
              >
                {isApplied ? "✓ Applied Successfully" : opportunity.status !== 'open' ? "Opportunity Closed" : "Apply Now"}
              </button>
            ) : user?.role === "ngo" ? (
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-sm text-slate-500 font-medium italic">
                  NGOs cannot apply to opportunities
                </p>
              </div>
            ) : (
              <button
                onClick={() => navigate("/?auth=login")}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
              >
                Login to Apply
              </button>
            )}
            
            <button
              onClick={() => navigate("/opportunities")}
              className="w-full mt-4 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors text-sm"
            >
              ← Back to Listings
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 transform transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Apply for Role</h3>
              <p className="text-slate-500 text-sm">Tell the NGO why you're a great fit for this opportunity.</p>
            </div>
            
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Cover Letter (Optional)
                </label>
                <textarea
                  className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Share your interest and relevant experience..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
