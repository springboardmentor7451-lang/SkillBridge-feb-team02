// frontend/src/services/opportunityService.js
import api from './api';

const opportunityService = {
  // Get all opportunities with filters - For volunteers browsing
  getOpportunities: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.skill) params.append('skill', filters.skill);
      if (filters.location) params.append('location', filters.location);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit);
      
      const queryString = params.toString();
      const url = `/opportunities${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data; // Returns { success: true, data: [...], count: n }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      throw error.response?.data || error.message;
    }
  },
  
  // Get single opportunity by ID
  getOpportunityById: async (id) => {
    try {
      const response = await api.get(`/opportunities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      throw error.response?.data || error.message;
    }
  },
  
  // Get filter options (skills, locations)
  getFilterOptions: async () => {
    try {
      const response = await api.get('/opportunities/filters/options');
      return response.data; // Returns { success: true, data: { skills: [], locations: [] } }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error.response?.data || error.message;
    }
  },
  
  // Get NGO's own opportunities (existing method)
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/opportunities/my', { params });
      return response.data; // Already returns data in the format your NgoDashboard expects
    } catch (error) {
      console.error('Error fetching NGO opportunities:', error);
      throw error.response?.data || error.message;
    }
  },

  // Create new opportunity (existing method)
  create: async (opportunityData) => {
    try {
      const response = await api.post('/opportunities', opportunityData);
      return response.data;
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update opportunity (existing method)
  update: async (id, opportunityData) => {
    try {
      const response = await api.put(`/opportunities/${id}`, opportunityData);
      return response.data;
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete opportunity (existing method)
  delete: async (id) => {
    try {
      const response = await api.delete(`/opportunities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default opportunityService;