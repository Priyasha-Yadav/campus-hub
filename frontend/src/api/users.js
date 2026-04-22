import api from "./axios";

export const usersApi = {
  getProfile: (userId) => api.get(`/users/${userId}/profile`),
  getSavedListings: () => api.get("/users/me/saved-listings"),
  toggleSavedListing: (listingId) => api.post(`/users/saved-listings/${listingId}`),
  deleteMe: () => api.delete("/users/me"),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.put("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
