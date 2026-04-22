import axios from './axios';

export const fetchUserSettings = async () => {
  const response = await axios.get('/users/settings');
  return response.data;
};

export const updateNotificationPreferences = async (preferences) => {
  const response = await axios.put('/users/notification-preferences', preferences);
  return response.data;
};

export const updatePrivacySettings = async (settings) => {
  const response = await axios.put('/users/privacy-settings', settings);
  return response.data;
};

export const updatePaymentInfo = async (paymentInfo) => {
  const response = await axios.put('/users/payment-info', paymentInfo);
  return response.data;
};

export const uploadPaymentQr = async (file) => {
  const formData = new FormData();
  formData.append("qr", file);
  const response = await axios.put('/users/payment-qr', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
