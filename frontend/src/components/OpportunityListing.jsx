import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../context/useAuth";
import opportunityService from "../services/opportunityService";

export default function OpportunityListing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);

  const [filters, setFilters] = useState({
    skill: "",
    location: "",
    search: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFilters({
      skill: params.get('skill') || "",
      location: params.get('location') || "",
      search: params.get('search') || ""
    });
  }, [location.search]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await opportunityService.getOpportunities(filters);
      setOpportunities(response.data || response || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch opportunities');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await opportunityService.getFilterOptions();
      if (response.data) {
        setAvailableSkills(response.data.skills || []);
        setAvailableLocations(response.data.locations || []);
      } else if (response.skills && response.locations) {
        setAvailableSkills(response.skills || []);
        setAvailableLocations(response.locations || []);
      }
    } catch (err) {
      console.error('Failed to fetch filter options:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`/opportunities${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  };

  const clearFilters = () => {
    navigate('/opportunities', { replace: true });
  };

  const handleApply = (opportunityId) => {
    if (!user) {
      navigate('/?auth=login&redirect=/opportunities/' + opportunityId);
      return;
    }

    if (user.role === 'volunteer') {
      navigate(`/opportunities/${opportunityId}/apply`);
    } else {
      alert('Only volunteers can apply for opportunities');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 pt-32 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Find Opportunities</h1>
          <p className="text-slate-600 mt-2">
            Discover volunteering opportunities that match your skills and interests
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filters.skill}
              onChange={(e) => handleFilterChange('skill', e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[150px]"
            >
              <option value="">All Skills</option>
              {availableSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[150px]"
            >
              <option value="">All Locations</option>
              {availableLocations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {(filters.skill || filters.location || filters.search) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {!loading && !error && opportunities.length > 0 && (
          <div className="mb-4 text-sm text-slate-600">
            {opportunities.length} {opportunities.length === 1 ? 'opportunity' : 'opportunities'} found
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading opportunities...</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOpportunities}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && opportunities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No opportunities found</h3>
            <p className="text-slate-600 mb-4">Try adjusting your filters or check back later</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {!loading && !error && opportunities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id || opportunity.id}
                opportunity={opportunity}
                userRole={user?.role}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity, userRole, onApply }) {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'NG';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const skills = opportunity.required_skills || opportunity.skillsRequired || opportunity.skills || [];

  const ngoName = opportunity.ngo_id?.name ||
    opportunity.ngo_id?.organizationName ||
    opportunity.ngoName ||
    'Organization';

  const ngoLogo = opportunity.ngo_id?.logo || opportunity.ngoLogo;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/opportunities/${opportunity._id || opportunity.id}`)}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
          {ngoLogo ? (
            <img src={ngoLogo} alt={ngoName} className="w-full h-full rounded-xl object-cover" />
          ) : (
            getInitials(ngoName)
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">
            {opportunity.title}
          </h3>
          <p className="text-sm text-slate-500">
            {ngoName}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
        {opportunity.description}
      </p>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs">
              +{skills.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-slate-500">
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

      {userRole === 'volunteer' && (
        <button
          className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onApply(opportunity._id || opportunity.id);
          }}
        >
          Apply Now
        </button>
      )}
    </div>
  );
}