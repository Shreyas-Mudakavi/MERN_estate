import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://estate-backend.adaptable.app/",
  // baseURL: "http://localhost:5000",
});

export default axiosInstance;
