import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const opportunityAxios = axios.create({
  baseURL: `${API_URL}/opportunities`,
});

opportunityAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

opportunityAxios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = new Error(
      error.response?.data?.message ||
        "An error occurred while communicating with the server.",
    );
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    return Promise.reject(customError);
  },
);

export const opportunityService = {
  getAll: async (params = {}) => {
    return await opportunityAxios.get("/my", { params });
  },

  create: async (opportunityData) => {
    return await opportunityAxios.post("/", opportunityData);
  },

  update: async (id, opportunityData) => {
    return await opportunityAxios.put(`/${id}`, opportunityData);
  },

  delete: async (id) => {
    return await opportunityAxios.delete(`/${id}`);
  },
};

export default opportunityService;
