import api from "./api";

export const getMatchedOpportunities = async () => {
  const response = await api.get("/match/opportunities");
  return response.data;
};

export const getMatchedVolunteers = async (opportunityId) => {
  const response = await api.get(`/match/volunteers/${opportunityId}`);
  return response.data;
};

export default {
  getMatchedOpportunities,
  getMatchedVolunteers,
};
