import axios from "axios";

export const TOKEN_KEY = "helpdesk_token";

const http = axios.create({ baseURL: "/api" });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign("/login");
    }
    return Promise.reject(
      error.response?.data?.error ?? {
        code: "NETWORK_ERROR",
        message: "Serveur injoignable",
      },
    );
  },
);

export default http;
