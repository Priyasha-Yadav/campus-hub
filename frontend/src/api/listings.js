import api from "./axios";

export const fetchListings = async (params = {}) => {
  const res = await api.get("/listings", { params });
  return res.data?.data ?? [];
};

export const createListing = async (payload) => {
  const res = await api.post("/listings", payload);
  return res.data?.data ?? [];
};
