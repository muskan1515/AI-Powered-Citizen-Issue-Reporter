import axios, { AxiosInstance } from "axios";
import { applyAxiosInterceptors } from "./axiosInteceptor";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000";

export const API_ROUTES = {
  AUTH: "api/auth",
  USER: "api/user",
  COMPLAINTS: "api/complaints",
} as const;

type RouteKey = keyof typeof API_ROUTES;

export const getApiInstance = (routeKey: RouteKey): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${BASE_URL}/${API_ROUTES[routeKey]}`,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 300000,
    withCredentials: true,
  });

  applyAxiosInterceptors(instance);

  return instance;
};
