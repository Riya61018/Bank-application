import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api", // Fallback to /api for local dev proxy
  withCredentials: true, // Send cookies with requests
});

export default api;
