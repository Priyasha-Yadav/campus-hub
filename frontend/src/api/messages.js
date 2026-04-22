import api from './axios';

export const messagesApi = {
  getConversations: () => api.get('/conversations'),
  getMessages: (conversationId, params) => api.get(`/messages/${conversationId}`, { params }),
  createConversation: (data) => api.post('/conversations', data),
  markConversationRead: (conversationId) => api.put(`/messages/${conversationId}/read`)
};
