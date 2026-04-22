import api from "./axios";

export const dashboardApi = {
  getSummary: () => api.get("/dashboard/summary"),
};
