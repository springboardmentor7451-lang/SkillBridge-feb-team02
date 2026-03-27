import { useState, useEffect } from "react";
import applicationService from "../services/applicationService";
import useAuth from "../context/useAuth";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === "volunteer") {
      fetchMyApplications();
    }
  }, [user]);

  const fetchMyApplications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await applicationService.getMyApplications();
      setApplications(response.data || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      setError("Failed to load your applications. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "pending":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (user?.role !== "volunteer") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900">Not Authorized</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
            <p className="text-slate-500 mt-1">Track the status of your volunteer applications</p>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button
                onClick={fetchMyApplications}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4 text-2xl">
                📄
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No applications yet</h3>
              <p className="text-slate-500 mb-6">Start your journey by applying to exciting opportunities.</p>
              <a
                href="/opportunities"
                className="inline-block px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
              >
                Browse Opportunities
              </a>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">
                          {app.opportunity_id?.title || "Unknown Opportunity"}
                        </h3>
                        {app.opportunity_id?.status === 'closed' && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded-full">
                            Closed
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium text-slate-700">
                          <span className="text-slate-400">🏢</span> {app.ngo_id?.organization_name || app.ngo_id?.name || "Unknown NGO"}
                        </span>
                        {app.opportunity_id?.location && (
                          <span className="flex items-center gap-1.5">
                            <span className="text-slate-400">📍</span> {app.opportunity_id.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <span className="text-slate-400">📅</span> Applied on {new Date(app.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(app.status)}`}>
                        {app.status}
                      </div>
                      
                      {app.status === 'accepted' && (
                        <div className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                          <span className="flex items-center justify-center w-5 h-5 bg-green-100 rounded-full text-[10px]">✓</span> 
                          Contacted
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {app.cover_letter && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Cover Letter</p>
                      <p className="text-sm text-slate-600 leading-relaxed italic">
                        "{app.cover_letter}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
