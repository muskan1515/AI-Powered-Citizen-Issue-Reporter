import { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "@/store";
import { logout, setToken } from "@/store/slices/authSlice";
import axios from "axios";

export const applyAxiosInterceptors = (instance: AxiosInstance) => {
  // Request interceptor: attach access token
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = store.getState().auth.token;
      if (token) {
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor: handle 401 → refresh token
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try refreshing the access token
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000"}/api/auth/refresh`,
            null,
            { withCredentials: true }
          );

          // Save new access token in store
          store.dispatch(setToken(data.accessToken));

          // Retry the original request with new token
          if (data.accessToken) {
            (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${data.accessToken}`;
          }

          return instance(originalRequest);
        } catch (refreshError) {
          // Refresh failed → backend logout to remove refresh token cookie
          try {
            await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000"}/api/auth/logout`,
              {},
              { withCredentials: true }
            );
          } catch (logoutError) {
            console.error("Backend logout failed", logoutError);
          }

          // Clear client-side auth state
          store.dispatch(logout());

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
