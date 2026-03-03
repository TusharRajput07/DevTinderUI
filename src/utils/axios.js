import axios from "axios";
import { BASE_URL } from "./constants";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // needed for cookies/session
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: clear token if using
      localStorage.removeItem("token");

      // Redirect to login
      // window.location.href = "/sessionExpired";
      console.log("session expired!");
    }
    return Promise.reject(error);
  }
);

export default api;
