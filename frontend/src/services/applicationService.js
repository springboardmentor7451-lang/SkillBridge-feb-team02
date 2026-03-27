import api from "./api";

const applicationService = {
  getApplicationsByOpportunity: async (opportunityId) => {
    try {
      const response = await api.get(`/applications/opportunity/${opportunityId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching applications:", error);
      throw error.response?.data || error.message;
    }
  },

  getMyApplications: async () => {
    try {
      const response = await api.get("/applications/my");
      return response.data;
    } catch (error) {
      console.error("Error fetching my applications:", error);
      throw error.response?.data || error.message;
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await api.put(`/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error.response?.data || error.message;
    }
  },

  applyForOpportunity: async (opportunityId, coverLetter = "") => {
    try {
      const response = await api.post("/applications/apply", {
        opportunityId,
        coverLetter,
      });
      return response.data;
    } catch (error) {
      console.error("Error applying for opportunity:", error);
      throw error.response?.data || error.message;
    }
  },

  getMyVolunteerApplications: async () => {
    try {
      const response = await api.get("/applications/volunteer/applications");
      return response.data;
    } catch (error) {
      console.error("Error fetching my applications:", error);
      throw error.response?.data || error.message;
    }
  },
};

export default applicationService;