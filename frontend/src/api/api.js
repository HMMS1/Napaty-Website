import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});


api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("access") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isUnauthorized = error?.response?.status === 401;
    const isRefreshRequest = originalRequest?.url?.includes(
      "/api/token/refresh/"
    );

    if (isUnauthorized && !originalRequest?._retry && !isRefreshRequest) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.removeItem("access");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("user_type");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${BASE_URL}/api/token/refresh/`,
          { refresh }
        );

        const newAccess = res?.data?.access;

        if (!newAccess) {
          return Promise.reject(error);
        }

        localStorage.setItem("access", newAccess);
        localStorage.setItem("token", newAccess);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        localStorage.removeItem("user_type");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
