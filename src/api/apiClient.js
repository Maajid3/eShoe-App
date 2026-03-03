import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL

const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (!error.response) {
          toast.error("Server unreachable. Check your connection.");
        } else if (error.response.status === 500) {
          toast.error("Something went wrong on the server.");
        } 
        return Promise.reject(error);
      },
    );
export default apiClient;