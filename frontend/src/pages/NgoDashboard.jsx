import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import opportunityService from "../services/opportunityService";
import ApplicationManagement from "../components/ApplicationManagement";

export default function NgoDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);

  useEffect(() => {
    fetchOpportunities();
  }, [user]);

  const fetchOpportunities = async () => {
    if (user?.role !== "ngo") return;
    try {
      setIsLoading(true);
      const data = await opportunityService.getAll({ ngoId: user.id });
      setOpportunities(Array.isArray(data) ? data : (data.data || []));
    } catch (error) {
      console.error("Failed to fetch opportunities", error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (opp) => {
    setOpportunityToDelete(opp);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!opportunityToDelete) return;
    try {
      await opportunityService.delete(opportunityToDelete._id || opportunityToDelete.id);
      setOpportunities(opportunities.filter(o => (o._id || o.id) !== (opportunityToDelete._id || opportunityToDelete.id)));
      setDeleteModalOpen(false);
      setOpportunityToDelete(null);
    } catch (error) {
      console.error("Failed to delete opportunity", error);
      alert("Failed to delete opportunity.");
    }
  };

  if (user?.role !== "ngo") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Not Authorized</h1>
      </div>
    );
  }

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "O";

  return (
    <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white text-4xl font-bold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">{user.organization_name}</h1>
            <p className="text-slate-500">{user.email}</p>
            {user.location && (
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm mt-2">
                📍 {user.location}
              </span>
            )}
            <p className="text-slate-700 mt-4 whitespace-pre-line">
              {user.organization_description || user.organizationDetails || user.bio || "No organization details provided."}
            </p>
          </div>
          <button
            onClick={() => navigate("/opportunities/create")}
            className="w-full md:w-auto px-6 py-3 rounded-xl font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors shrink-0"
          >
            + Create Opportunity
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Posted Opportunities</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading opportunities...</div>
            ) : opportunities.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                You haven't posted any opportunities yet.
                <button onClick={() => navigate("/opportunities/create")} className="block mx-auto mt-4 text-indigo-600 hover:underline">
                  Create your first opportunity
                </button>
              </div>
            ) : (
              opportunities.map((opp) => (
                <div key={opp._id || opp.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">{opp.title}</h3>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${opp.status === 'open' ? 'text-green-700 bg-green-100' : 'text-slate-600 bg-slate-200'}`}>
                        {opp.status || 'open'}
                      </span>
                      <span>• {opp.applicantsCount || 0} applicants</span>
                      <span>• {new Date(opp.createdAt).toLocaleDateString()}</span>
                    </div>
                    {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {opp.requiredSkills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => {
                        setSelectedOpportunity(opp);
                        setShowApplicationsModal(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      View Applications
                    </button>
                    <button
                      onClick={() => navigate(`/opportunities/edit/${opp._id || opp.id}`, { state: { opportunity: opp } })}
                      className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(opp)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 whitespace-nowrap text-xl">
                🗑️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Opportunity?</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to delete <span className="font-semibold text-slate-700">"{opportunityToDelete?.title}"</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showApplicationsModal && selectedOpportunity && (
        <ApplicationManagement
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowApplicationsModal(false);
            setSelectedOpportunity(null);
          }}
        />
      )}
    </div>
  );
}