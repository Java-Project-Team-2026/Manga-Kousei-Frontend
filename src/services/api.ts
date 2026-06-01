import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:8080",
  withCredentials: true,
});

export default api;
