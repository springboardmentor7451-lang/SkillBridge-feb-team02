import api from "./api";

export const getConversationHistory = async (userId) => {
  const response = await api.get(`/messages/${userId}`);
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get("/messages/conversations");
  return response.data;
};

export default {
  getConversationHistory,
  getConversations,
};
