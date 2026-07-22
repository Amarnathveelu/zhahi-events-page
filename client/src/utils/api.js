import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://zhahi-events-page.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      if (window.location.pathname === "/admin") {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const createEnrollment = (payload) => api.post("/enrollments", payload);
export const uploadScreenshot = (enrollmentId, formData) =>
  api.post(`/enrollments/${enrollmentId}/screenshot`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getEvents = (activeOnly = false) =>
  api.get(`/events${activeOnly ? "?activeOnly=true" : ""}`);
export const createEvent = (formData) =>
  api.post("/events", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateEvent = (id, formData) =>
  api.put(`/events/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const toggleEventActive = (id) => api.patch(`/events/${id}/toggle`);

export const getOffers = (activeOnly = false) =>
  api.get(`/offers${activeOnly ? "?activeOnly=true" : ""}`);
export const createOffer = (formData) =>
  api.post("/offers", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const updateOffer = (id, formData) =>
  api.put(`/offers/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteOffer = (id) => api.delete(`/offers/${id}`);
export const toggleOfferActive = (id) => api.patch(`/offers/${id}/toggle`);

export const adminLogin = (payload) => api.post("/admin/login", payload);
export const getAdminProfile = () => api.get("/admin/profile");

export const getEnrollments = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api.get(`/enrollments${query ? `?${query}` : ""}`);
};
export const verifyEnrollment = (enrollmentId, action) =>
  api.patch(`/enrollments/${enrollmentId}/verify`, { action });

export const studentRegister = (payload) => api.post("/students/register", payload);
export const studentLogin = (payload) => api.post("/students/login", payload);
export const getStudentProfile = () => api.get("/students/profile");
export const getStudentEnrollments = () => api.get("/students/enrollments");
export const getStudentUpdates = () => api.get("/students/updates");

export const getUpdates = () => api.get("/updates");
export const createUpdate = (payload) => api.post("/updates", payload);
export const deleteUpdate = (id) => api.delete(`/updates/${id}`);

export default api;
