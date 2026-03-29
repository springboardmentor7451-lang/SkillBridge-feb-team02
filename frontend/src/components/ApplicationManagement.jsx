import { useState, useEffect } from "react";
import applicationService from "../services/applicationService";

export default function ApplicationManagement({ opportunity, onClose }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [opportunity._id]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await applicationService.getApplicationsByOpportunity(opportunity._id);
      setApplications(response.data || []);
    } catch (err) {
      setError(err?.message || err || "Failed to fetch applications");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const response = await applicationService.updateApplicationStatus(applicationId, newStatus);
      setApplications(prev =>
        prev.map(app =>
          app._id === applicationId
            ? { ...app, status: newStatus, reviewed_at: new Date() }
            : app
        )
      );
    } catch (err) {
      alert(`Failed to ${newStatus} application: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all">

        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Applications</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">{opportunity.title}</h3>
          <div className="text-sm text-slate-500 mt-1">
            {opportunity.location && <span className="mr-4">📍 {opportunity.location}</span>}
            {opportunity.required_skills && opportunity.required_skills.length > 0 && (
              <span>Skills: {opportunity.required_skills.join(", ")}</span>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchApplications}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Try Again
              </button>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500">No applications yet for this opportunity.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
                          {app.volunteer_id?.name?.charAt(0)?.toUpperCase() || "V"}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">
                            {app.volunteer_id?.name || "Volunteer"}
                          </h4>
                          <p className="text-sm text-slate-500">{app.volunteer_id?.email}</p>
                        </div>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      {app.volunteer_id?.skills && app.volunteer_id.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {app.volunteer_id.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {app.volunteer_id.skills.length > 3 && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                              +{app.volunteer_id.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {app.volunteer_id?.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <span>📍</span> {app.volunteer_id.location}
                        </p>
                      )}

                      {app.cover_letter && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600 italic">
                            "{app.cover_letter}"
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-slate-400 mt-2">
                        Applied: {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2 md:flex-col items-end">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "accepted")}
                            disabled={updatingId === app._id}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updatingId === app._id ? "..." : "Accept"}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to reject this application?")) {
                                handleStatusUpdate(app._id, "rejected");
                              }
                            }}
                            disabled={updatingId === app._id}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updatingId === app._id ? "..." : "Reject"}
                          </button>
                        </>
                      )}
                      {app.status === "accepted" && (
                        <button
                          disabled
                          className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg cursor-default"
                        >
                          ✓ Accepted
                        </button>
                      )}
                      {app.status === "rejected" && (
                        <button
                          disabled
                          className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg cursor-default"
                        >
                          ✗ Rejected
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}