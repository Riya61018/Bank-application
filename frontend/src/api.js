import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "/api", // Using proxy in vite.config.js to avoid CORS issues locally
  withCredentials: true, // Send cookies with requests
});

export default api;
