import api from './axios';

export const studyGroupsApi = {
  getStudyGroups: (params) => api.get('/study-groups', { params }),
  getUpcomingSessions: (params) => api.get('/study-groups/upcoming', { params }),
  getStudyGroup: (id) => api.get(`/study-groups/${id}`),
  createStudyGroup: (data) => api.post('/study-groups', data),
  updateStudyGroup: (id, data) => api.put(`/study-groups/${id}`, data),
  updateNextSession: (id, data) => api.put(`/study-groups/${id}/next-session`, data),
  deleteStudyGroup: (id) => api.delete(`/study-groups/${id}`),
  joinStudyGroup: (id) => api.post(`/study-groups/${id}/join`),
  leaveStudyGroup: (id) => api.post(`/study-groups/${id}/leave`),
  uploadCover: (id, file) => {
    const formData = new FormData();
    formData.append('cover', file);
    return api.post(`/study-groups/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
