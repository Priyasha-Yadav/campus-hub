import axios from './axios';

export const fetchNotifications = async (params = {}) => {
  const response = await axios.get('/notifications', { params });
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  const response = await axios.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await axios.put('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axios.delete(`/notifications/${id}`);
  return response.data;
};