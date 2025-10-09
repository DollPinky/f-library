import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import type { StandardResponse } from "@/types";

const BASE_URL = "http://localhost:8080/api/v1";

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null, newToken?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newToken);
    }
  });
  failedQueue = [];
};

const clearAuthData = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const handleLogout = (): void => {
  clearAuthData();
  window.location.replace("/");
};

// Add token to requests
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
axiosClient.interceptors.response.use(
  (response: AxiosResponse<StandardResponse<unknown>>) => response,
  async (error: AxiosError<StandardResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;
    const url = originalRequest.url ?? "";

    // Handle 401 Unauthorized
    if (status === 401 && !originalRequest._retry) {
      // Prevent retry on auth endpoints
      if (url.includes("refresh-token") || url.includes("login")) {
        handleLogout();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return axiosClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post<StandardResponse<{ accessToken: string }>>(
          `${BASE_URL}/accounts/refresh-token`,
          { refreshToken }
        );

        const newToken = res.data.data?.accessToken;
        if (!res.data.success || !newToken) {
          throw new Error("Refresh token failed");
        }

        localStorage.setItem("accessToken", newToken);
        processQueue(null, newToken);
        isRefreshing = false;

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        isRefreshing = false;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
